;(function($) {
    $.fn.paginatable = function(methodOrOptions) {
        var settings = $.extend({
            nItemsPerPage: 10,
            container: '',
            containerForButtons: '',
            sigRefreshPages: 'tablesortable.sorted'
        }, methodOrOptions || []);

        var methods = {
            init: function() {

                methods.initData.call(this);

                var navId = 'paginatableNavigation';
                var $btnContainer;
                if (settings.containerForButtons)
                    $btnContainer = settings.containerForButtons;
                else {
                    this.append('<div id="' + navId + '"></div>');
                    $btnContainer = $('#' + navId);
                }

                methods.createNavigation.call(this, $btnContainer);
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
                this.data('nItemsPerPage', settings.nItemsPerPage);
            },

            createNavigation: function($container) {
                var navigation =
                    '<ul>' +
                        '<li><a href="javascript:void(0)">Prev</a></li>' +
                        '<li><a href="javascript:void(0)">Next</a></li>' +
                    '</ul>';

                var me = this;
                $container.html(navigation);
                $buttons = $container.find('li');
                $prevBtn = $buttons.first();
                $nextBtn = $buttons.last();
                $nextBtn.on('click', function() {
                    methods.displayPage.call(me, me.data('currentPage') + 1);
                });
                $prevBtn.on('click', function() {
                    methods.displayPage.call(me, me.data('currentPage') - 1);
                });
            },

            displayPage: function(pageNo) {
                var $container = this.data('container');
                var $elements = $container.children();
                var nElements = $elements.length;
                var nItemsPerPage = this.data('nItemsPerPage');

                if (pageNo >= Math.ceil(nElements / nItemsPerPage) || pageNo < 0)
                    return false;

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
