;(function($) {
    $.fn.filterable = function(methodOrOptions) {
        var settings = $.extend({
            container: '',
            containerForNavigation: '',
            hideColumns: ''
        }, methodOrOptions || []);

        var methods = {
            init: function() {
                var navClass = 'filterNavigation';
                var $btnContainers;
                if (settings.container)
                    this.data('container', settings.container);
                else
                    this.data('container', this);
                if (settings.containerForNavigation)
                    $btnContainers = settings.containerForNavigation;
                else {
                    var navigation = '<div class="' + navClass + '"></div>';
                    this.after(navigation);
                    this.before(navigation);
                    $btnContainers = $('.' + navClass);
                }

                methods.createNavigation.call(this, $btnContainers);
            },

            createNavigation: function($containers) {
                if (!settings.hideColumns)
                    return;

                var checkbox = '<input type="checkbox" name="filterOption">';
                var navigation = '';
                for (var i in settings.hideColumns) {
                    var columnConf = settings.hideColumns[i];
                    navigation += '<label>' + checkbox + columnConf.text +
                        '</label>';
                }
                $containers.html($containers.html() + navigation);

                var me = this;
                var $filters = $containers.find('[name=filterOption]');
                for (var i = 0; i < settings.hideColumns.length; i++) {
                    var filterConf = settings.hideColumns[i];
                    $filters.eq(i).on('change', function() {
                        me.filter(filterConf.column, filterConf.condition);
                    });
                }
            },
            filter: function(columnNo, condition) {
                this.data('container').find('tr').each(function() {
                    var $this = $(this);
                    $tds = $this.find('td');
                    if ($tds.length < columnNo)
                        return false;

                    if ($tds.eq(columnNo).html() == condition)
                        $this.addClass('filtered');
                    else
                        $this.removeClass('filtered');
                });
            }
        };

        if (methods[methodOrOptions]) {
            return methods[methodOrOptions]
                .apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  methodOrOptions +
                    ' does not exist on jQuery.filterable');
        }
    };
})(jQuery);