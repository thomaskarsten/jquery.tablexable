;(function($) {
    $.fn.paginatable = function(methodOrOptions) {
        var settings = $.extend({
            nItemsPerPage: 10,
            container: '',
            containerForNavigation: '',
            sigRefreshPages: 'tablesortable.sorted'
        }, methodOrOptions || []);

        var methods = {
            init: function() {

                var navClass = 'pgnNavigation';
                var $btnContainers;
                if (settings.containerForNavigation)
                    $btnContainers = settings.containerForNavigation;
                else {
                    var navigation = '<div class="' + navClass + '"></div>';
                    this.after(navigation);
                    this.before(navigation);
                    $btnContainers = $('.' + navClass);
                }

                methods.createNavigation.call(this, $btnContainers);
                methods.initData.call(this);

                methods.displayPage.call(this, 0);

                var me = this;
                this.on(settings.sigRefreshPages, function() {
                    methods.displayPage.call(me, me.data('currentPage'));
                });

                return this;
            },

            initData: function() {
                this.data('currentPage', 0);
                if (settings.container)
                    this.data('container', settings.container);
                else
                    this.data('container', this);
                var $pgnNavigation;
                if (settings.containerForNavigation) {
                    this.data('containerForNavigation', settings.containerForNavigation);
                    $pgnNavigation = settings.containerForNavigation;
                } else {
                    $pgnNavigation = $('.pgnNavigation');
                    this.data('containerForNavigation', $pgnNavigation);
                }

                this.data('$pgnCurrent', $pgnNavigation.find('.pgnCurrent'));
                this.data('$pgnTotal', $pgnNavigation.find('.pgnTotal'));
                this.data('nItemsPerPage', settings.nItemsPerPage);
            },

            createNavigation: function($containers) {
                var navigation =
                    '<ul>' +
                        '<li><p class="pgnCurrent"></p></li>' +
                        '<li><p class="pgnTotal"></p></li>' +
                        '<li><button type="button" class="pgnBtnFirst">First</button></li>' +
                        '<li><button type="button" class="pgnBtnPrev">Prev</button></li>' +
                        '<li><button type="button" class="pgnBtnNext">Next</button></li>' +
                        '<li><button type="button" class="pgnBtnLast">Last</button></li>' +
                    '</ul>';

                var me = this;
                $containers.html(navigation);
                $containers.each(function(index, container) {
                    $container = $(container);
                    $container.find('.pgnBtnFirst').on('click', function() {
                        methods.displayPage.call(me, 0);
                    });
                    $container.find('.pgnBtnNext').on('click', function() {
                        methods.displayPage.call(me, me.data('currentPage') + 1);
                    });
                    $container.find('.pgnBtnPrev').on('click', function() {
                        methods.displayPage.call(me, me.data('currentPage') - 1);
                    });
                    $container.find('.pgnBtnLast').on('click', function() {
                        methods.displayPage.call(me, -1);
                    });
                });
            },

            displayPage: function(pageNo) {
                var $container = this.data('container');
                var $elements = $container.children();
                var nElements = $elements.length;
                var nItemsPerPage = this.data('nItemsPerPage');
                var nPages = Math.ceil(nElements / nItemsPerPage);

                if (pageNo == -1)
                    pageNo = nPages - 1;
                else {
                    if (pageNo >= nPages || pageNo < 0)
                        return false;
                }

                var currentPage = -1;
                $elements.each(function(index, element) {
                    if (index % nItemsPerPage === 0)
                        currentPage++;

                    if (currentPage == pageNo)
                        $(this).show();
                    else
                        $(this).hide();
                });

                this.data('currentPage', pageNo);
                this.data('$pgnCurrent').html(pageNo + 1);
                this.data('$pgnTotal').html(nPages);
            },

            getData: function() {
                return this.data();
            }
        };

        if (methods[methodOrOptions]) {
            return methods[methodOrOptions]
                .apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  methodOrOptions +
                    ' does not exist on jQuery.tablesortable');
        }
    };
})(jQuery);
