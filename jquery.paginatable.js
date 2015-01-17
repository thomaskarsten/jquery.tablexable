;(function($) {
    $.fn.paginatable = function(methodOrOptions) {

        var SIG_REFRESH = 'paginatable.refresh';

        var settings = $.extend({
            nItemsPerPage: 10,
            container: '',
            containersForNavigation: '',
            sigRefreshPages: 'tablesortable.sorted ' + SIG_REFRESH
        }, methodOrOptions || []);

        var PGN_CMD_FIRST = 7;
        var PGN_CMD_PREV = 8;
        var PGN_CMD_NEXT = 9;
        var PGN_CMD_LAST = 10;
        var PGN_CMD_CURRENT = 4;

        var methods = {
            init: function() {

                var navClass = 'pgnNavigation';
                var $btnContainers;
                if (settings.containersForNavigation)
                    $btnContainers = settings.containersForNavigation;
                else {
                    var navigation = '<div class="' + navClass + '"></div>';
                    this.after(navigation);
                    this.before(navigation);
                    $btnContainers = $('.' + navClass);
                }

                methods.createNavigation.call(this, $btnContainers);
                methods.initData.call(this);

                methods.displayPage.call(this, PGN_CMD_FIRST);

                var me = this;
                this.on(settings.sigRefreshPages, function() {
                    methods.displayPage.call(me, PGN_CMD_CURRENT);
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
                if (settings.containersForNavigation) {
                    this.data('containersForNavigation',
                        settings.containersForNavigation);
                    $pgnNavigation = settings.containersForNavigation;
                } else {
                    $pgnNavigation = $('.pgnNavigation');
                    this.data('containersForNavigation', $pgnNavigation);
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
                        methods.displayPage.call(me, PGN_CMD_FIRST);
                    });
                    $container.find('.pgnBtnNext').on('click', function() {
                        methods.displayPage.call(me, PGN_CMD_NEXT);
                    });
                    $container.find('.pgnBtnPrev').on('click', function() {
                        methods.displayPage.call(me, PGN_CMD_PREV);
                    });
                    $container.find('.pgnBtnLast').on('click', function() {
                        methods.displayPage.call(me, PGN_CMD_LAST);
                    });
                });
            },

            displayFirstPage: function() {
                methods.displayPage.call(this, PGN_CMD_FIRST);
            },
            displayNextPage: function() {
                methods.displayPage.call(this, PGN_CMD_NEXT);
            },
            displayPrevPage: function() {
                methods.displayPage.call(this, PGN_CMD_PREV);
            },
            displayLastPage: function() {
                methods.displayPage.call(this, PGN_CMD_LAST);
            },

            displayPage: function(command) {
                var $container = this.data('container');
                var $elements = $container.children().not('.filtered');
                var $filteredElements = $container.find('.filtered');
                var nElements = $elements.length;
                var nItemsPerPage = this.data('nItemsPerPage');
                var nPages = Math.ceil(nElements / nItemsPerPage);
                var currentPage = this.data('currentPage');

                if (command == PGN_CMD_LAST)
                    currentPage = nPages - 1;
                else if (command == PGN_CMD_FIRST)
                    currentPage = 0;
                else if (command == PGN_CMD_PREV) {
                    currentPage--;
                    if (currentPage < 0)
                        currentPage = 0;
                } else if (command == PGN_CMD_NEXT) {
                    currentPage++;
                    if (currentPage >= nPages)
                        currentPage = nPages - 1;
                } else if (command = PGN_CMD_CURRENT) {
                }

                $filteredElements.removeClass('pgnCurrentPage')
                    .addClass('pgnOtherPage');

                var visitedPage = -1;
                $elements.each(function(index, element) {
                    if (index % nItemsPerPage === 0)
                        visitedPage++;

                    if (visitedPage == currentPage) {
                        $(this).addClass('pgnCurrentPage')
                            .removeClass('pgnOtherPage');
                    } else {
                        $(this).addClass('pgnOtherPage')
                            .removeClass('pgnCurrentPage');
                    }
                });

                this.data('currentPage', currentPage);
                this.data('$pgnCurrent').html(currentPage + 1);
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
