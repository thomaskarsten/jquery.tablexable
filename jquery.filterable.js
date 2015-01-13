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
            CLASS_BY_FILTER_X_REGEX: '',
            $btnContainers: null,
            $filterCheckboxes: null,
            init: function() {
                var navClass = 'filterNavigation';
                if (settings.container)
                    this.data('container', settings.container);
                else
                    this.data('container', this);
                if (settings.containerForNavigation)
                    methods.$btnContainers = settings.containerForNavigation;
                else {
                    var navigation = '<div class="' + navClass + '"></div>';
                    this.after(navigation);
                    this.before(navigation);
                    methods.$btnContainers = $('.' + navClass);
                }
                methods.CLASS_BY_FILTER_X_REGEX = new RegExp(methods.CLASS_BY_FILTER_X);

                methods.createNavigation.call(this, methods.$btnContainers);

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
                var nContainers = $containers.length;
                var $filters = methods.getCheckboxes.call(this);
                var filtersPerContainer = $filters.length / nContainers;
                $filters.each(function(i, filter) {
                    var filterNo = i % filtersPerContainer;
                    var filterConf = settings.hideColumns[filterNo];
                    $(filter).on('change', function() {
                        if ($(this).prop('checked')) {
                            methods.syncRelatedCheckboxes.call(me, true,
                                $filters, filterNo, nContainers);
                            methods.filter.call(me, filterNo,
                                filterConf.column, filterConf.condition);
                        } else {
                            methods.syncRelatedCheckboxes.call(me, false,
                                $filters, filterNo, nContainers);
                            methods.unfilter.call(me, filterNo);
                        }
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
                        $this.removeClass(methods.CLASS_FILTERED).addClass(
                            methods.CLASS_BY_FILTER_X + filterNo);
                    } else {
                        var cla$$ = $this.attr('class');
                        if (typeof cla$$ == 'undefined' ||
                                !cla$$.match(methods.CLASS_BY_FILTER_X_REGEX))
                            $this.addClass(methods.CLASS_FILTERED);
                    }
                });
                methods.signalPaginatable.call(this);
            },
            unfilter: function(filterNo) {
                var me = this;
                this.data('container').find('tr').each(function() {
                    var $this = $(this);

                    $this.removeClass(methods.CLASS_BY_FILTER_X + filterNo);

                    var isDisplayedByOtherFilter;
                    if (typeof $this.attr('class') == 'undefined')
                        isDisplayedByOtherFilter = false;
                    else {
                        isDisplayedByOtherFilter = $this.attr('class')
                            .match(methods.CLASS_BY_FILTER_X_REGEX);
                    }
                    var hasActiveFilters =
                        methods.hasActiveFilters.call(this);

                    if (!isDisplayedByOtherFilter && hasActiveFilters)
                        $this.addClass(methods.CLASS_FILTERED);
                    else
                        $this.removeClass(methods.CLASS_FILTERED);
                });
                methods.signalPaginatable.call(this);
            },
            signalPaginatable: function() {
                this.trigger(SIG_PGN_REFRESH);
            },
            syncRelatedCheckboxes: function(checked, $filters, filterNo,
                    nContainers) {
                for (var j = 0; j < nContainers; j++) {
                    $filters.eq(filterNo + j * nContainers)
                        .prop('checked', checked);
                }
            },
            getCheckboxes: function() {
                if (this.$filterCheckboxes == null) {
                    this.$filterCheckboxes =
                        methods.$btnContainers.find('[name=filterOption]');
                }
                return this.$filterCheckboxes;
            },
            hasActiveFilters: function() {
                return methods.$btnContainers
                    .find('[name=filterOption]:checked').length > 0;
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
