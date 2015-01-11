;(function($) {
    $.fn.filterable = function(methodOrOptions) {

        var SIG_PGN_REFRESH = 'paginatable.refresh';

        var settings = $.extend({
            container: '',
            containerForNavigation: '',
            hideColumns: ''
        }, methodOrOptions || []);

        var methods = {
            CLASS_FILTERED: 'filtered',
            CLASS_BY_FILTER_X: 'byFilter',
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

                return this;
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
                $containers.each(function(i, container) {
                    var $filters = $(container).find('[name=filterOption]');
                    $filters.each(function(j, filter) {
                        var filterConf = settings.hideColumns[j];
                        $(filter).on('change', function() {
                            if ($(this).prop('checked')) {
                                methods.filter.call(me, j, filterConf.column,
                                    filterConf.condition);
                            } else {
                                methods.unfilter.call(me, j);
                            }
                        });
                    });
                });
            },
            filter: function(filterNo, columnNo, condition) {
                this.data('container').find('tr').each(function() {
                    var $this = $(this);
                    $tds = $this.find('td');
                    if ($tds.length < columnNo)
                        return false;

                    if ($tds.eq(columnNo).html() == condition) {
                        $this.addClass(methods.CLASS_FILTERED).addClass(
                            methods.CLASS_BY_FILTER_X + filterNo);
                    }
                });
                methods.signalPaginatable.call(this);
            },
            unfilter: function(filterNo) {
                var byFilterRegex = new RegExp(methods.CLASS_BY_FILTER_X);
                var filterClass;
                this.data('container').find('tr').each(function() {
                    var $this = $(this);
                    if (typeof $this.attr('class') == 'undefined')
                        return true;

                    $this.removeClass(methods.CLASS_BY_FILTER_X + filterNo);
                    if (!$this.attr('class').match(byFilterRegex))
                        $this.removeClass(methods.CLASS_FILTERED);
                });
                methods.signalPaginatable.call(this);
            },
            signalPaginatable: function() {
                this.trigger(SIG_PGN_REFRESH);
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
