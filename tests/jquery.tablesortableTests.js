var Helpers = {
    tableId: '#myTable',
    getTable: function() {
        return $(this.tableId);
    },
    assertData: function(expected, data) {
        equal(data.length, expected.length);
        for (var row = 0; row < data.length; row++) {
            for (var col = 0; col < data[row].length; col++)
                equal(data[row][col], expected[row][col]);
        }
    },
    assertTable: function(expected, $table) {
        var $rows = $table.find('tbody tr');
        equal($rows.length, expected.length);

        for (var row = 0; row < $rows.length; row++) {
            var $cols = $($rows[row]).find('td');
            for (var col = 0; col < $cols.length; col++) {
                equal($($cols[col]).html(), expected[row][col]);
            }
        }
    },
    assertIsSortedByFirstColumn: function(data, desc) {
        var $table = Helpers.getTable();
        var expectedData = [
            ['3', 'a', 'True', 'True'], ['4', 'd', 'True', 'False'],
            ['7', 'f', 'False', 'False'], ['17', 'c', 'True', 'False']
        ];
        var expectedHtml = [
            ['3', '<a href="9">a</a>', 'True', 'True'],
            ['4', '<a href="0">d</a>', 'True', 'False'],
            ['7', '<a href="1">f</a>', 'False', 'False'],
            ['17', '<a href="3">c</a>', 'True', 'False']
        ];

        if (typeof desc != 'undefined' && desc == true) {
            expectedData.reverse();
            expectedHtml.reverse();
        }

        Helpers.assertData(expectedData, data);
        Helpers.assertTable(expectedHtml, $table);
    },
    assertIsSortedBySecondColumn: function(data, desc) {
        var $table = Helpers.getTable();
        var expectedData = [
            ['3', 'a', 'True', 'True'], ['17', 'c', 'True', 'False'],
            ['4', 'd', 'True', 'False'], ['7', 'f', 'False', 'False']
        ];
        var expectedHtml = [
            ['3', '<a href="9">a</a>', 'True', 'True'],
            ['17', '<a href="3">c</a>', 'True', 'False'],
            ['4', '<a href="0">d</a>', 'True', 'False'],
            ['7', '<a href="1">f</a>', 'False', 'False'],
        ];

        if (typeof desc != 'undefined' && desc == true) {
            expectedData.reverse();
            expectedHtml.reverse();
        }

        Helpers.assertData(expectedData, data);
        Helpers.assertTable(expectedHtml, $table);
    },

    assertCurrentPageData1stPage: function() {
        var expected = [
            ['17', '<a href="3">c</a>'],
            ['3', '<a href="9">a</a>']
        ];
        Helpers.assertCurrentPageData(expected);
    },

    assertCurrentPageData2ndPage: function() {
        var expected = [
            ['7', '<a href="1">f</a>'],
            ['4', '<a href="0">d</a>']
        ];
        Helpers.assertCurrentPageData(expected);
    },

    assertCurrentPageData: function(expected) {
        var $table = Helpers.getTable();
        var visible = [];
        var $visibleRows = $table.find('tbody tr.pgnCurrentPage');
        $visibleRows.each(function(index, element) {
            var $tds = $(element).find('td');
            visible.push([$($tds[0]).html(), $($tds[1]).html()]);
        });

        Helpers.assertData(expected, visible);
    },

    assertCurrentPage: function(expectedPageNo) {
        $elCurrentPage = $($('.pgnNavigation')[0]).find('.pgnCurrent');
        equal($elCurrentPage.html(), expectedPageNo);
    },

    assertTotalPages: function(expectedTotalPages) {
        $elTotalPages = $($('.pgnNavigation')[0]).find('.pgnTotal');
        equal($elTotalPages.html(), expectedTotalPages);
    }
};

QUnit.module('jquery.tablesortable', {});

test('jQuery.tablesortable()', function() {
    var $obj = $('#myTable').tablesortable({columnContainers: {1: 'a'}});
    ok($obj.length);
    var data = $obj.tablesortable('getData');
    equal(data['rows'].length, 4);
    equal(data['columnTypes'].length, 4);
    equal(data['sortStatus'].column, 0);
    equal(data['sortStatus'].order, 2);
});

test('jQuery.tablesortable() settings', function() {
    var $obj = $('#myTable').tablesortable({columnTypes: {0: 'integer'}});
    var data = $obj.tablesortable('getData');
    equal(data.columnTypes[0], 'integer');
    equal(data.columnTypes[1], 'string');
});

test('jQuery.tablesortable("sort")', function() {
    var $obj = $('#myTable').tablesortable({
        columnTypes: {0: 'integer'},
        columnContainers: {1: 'a'}
    });
    var rows = $obj.tablesortable('getData').rows;

    $obj.tablesortable('sort', 0);
    Helpers.assertIsSortedByFirstColumn(rows);

    $obj.tablesortable('sort', 1);
    Helpers.assertIsSortedBySecondColumn(rows);
});

test('jQuery.tablesortable("getCastedDataAsArray")', function() {
    var $obj = $('#myTable').tablesortable({
        columnTypes: {0: 'integer'},
        columnContainers: {1: 'a'}
    });

    var values;

    values = $obj.tablesortable('getCastedDataAsArray', 'x', 'Y', 'istring');
    equal(values[0], 'x');
    equal(values[1], 'y');

    values = $obj.tablesortable('getCastedDataAsArray', '3', '12', 'integer');
    equal(values[0], 3);
    equal(values[1], 12);

    values = $obj.tablesortable('getCastedDataAsArray', '3.14', '12.02', 'float');
    equal(values[0], 3.14);
    equal(values[1], 12.02);
});

test('jQuery.tablesortable() works after clicking the headers', function() {
    var $obj = $('#myTable').tablesortable({
        columnTypes: {0: 'integer'},
        columnContainers: {1: 'a'}
    });
    var rows = $obj.tablesortable('getData')['rows'];

    var $firstColumn = Helpers.getTable().find('thead tr th').first();
    var $secondColumn = $firstColumn.next();

    $firstColumn.trigger('click');
    Helpers.assertIsSortedByFirstColumn(rows);
    $firstColumn.trigger('click');
    Helpers.assertIsSortedByFirstColumn(rows, true);
    $firstColumn.trigger('click');
    Helpers.assertIsSortedByFirstColumn(rows);

    $secondColumn.trigger('click');
    Helpers.assertIsSortedBySecondColumn(rows);
    $secondColumn.trigger('click');
    Helpers.assertIsSortedBySecondColumn(rows, true);
    $secondColumn.trigger('click');
    Helpers.assertIsSortedBySecondColumn(rows);
}); 

QUnit.module('jquery.paginatable', {});

test('jQuery.paginatable()', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    ok($obj.length);

    $navigations = $('.pgnNavigation');
    equal($navigations.length, 2);

    var $table = Helpers.getTable();
    equal($table.find('tbody tr.pgnCurrentPage').length, 2);
    Helpers.assertCurrentPageData1stPage();
    Helpers.assertCurrentPage(1);

    $obj.paginatable('displayNextPage');
    equal($table.find('tbody tr.pgnCurrentPage').length, 2);
    Helpers.assertCurrentPageData2ndPage();
    Helpers.assertCurrentPage(2);

    Helpers.assertTotalPages(2);
});

test('jQuery.paginatable() has correct number of elements in navigation', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    ok($obj.length);

    var $navigation = $($('.pgnNavigation')[0]);
    ok($navigation.length);

    var navigationItems = ['pgnCurrent', 'pgnTotal', 'pgnBtnFirst',
        'pgnBtnPrev', 'pgnBtnNext', 'pgnBtnLast'];

    for (var i in navigationItems)
        equal($navigation.find('.' + navigationItems[i]).length, 1);
});

test('jQuery.paginatable() displayPage() works', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    equal($obj.length, 1);

    var $table = Helpers.getTable();
    equal($table.find('tbody tr.pgnCurrentPage').length, 2);
    Helpers.assertCurrentPageData1stPage();
    Helpers.assertCurrentPage(1);

    $obj.paginatable('displayPrevPage');
    equal($table.find('tbody tr.pgnCurrentPage').length, 2);
    Helpers.assertCurrentPageData1stPage();
    Helpers.assertCurrentPage(1);

    $obj.paginatable('displayNextPage');
    equal($table.find('tbody tr.pgnCurrentPage').length, 2);
    Helpers.assertCurrentPageData2ndPage();
    Helpers.assertCurrentPage(2);

    Helpers.assertTotalPages(2);
});

test('jQuery.paginatable() buttons exist and accept click events', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    ok($obj.length);

    $navigations = $('.pgnNavigation');
    equal($navigations.length, 2);

    Helpers.assertCurrentPageData1stPage();

    var $topNavigation = $($navigations[0]);

    var $lastPageButton = $topNavigation.find('.pgnBtnLast');
    equal($lastPageButton.length, 1);
    $lastPageButton.trigger('click');
    Helpers.assertCurrentPageData2ndPage();

    var $firstPageButton = $topNavigation.find('.pgnBtnFirst');
    equal($firstPageButton.length, 1);
    $firstPageButton.trigger('click');
    Helpers.assertCurrentPageData1stPage();

    $nextButton = $topNavigation.find('.pgnBtnNext');
    $nextButton.trigger('click');
    Helpers.assertCurrentPageData2ndPage();

    $prevButton = $topNavigation.find('.pgnBtnPrev');
    $prevButton.trigger('click');
    Helpers.assertCurrentPageData1stPage();
});

test('jQuery.paginatable() "Prev" button on first page does not change content', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });

    $navigations = $('.pgnNavigation');
    equal($navigations.length, 2);

    var $topNavigation = $($navigations[0]);
    Helpers.assertCurrentPageData1stPage();

    $prevButton = $topNavigation.find('.pgnBtnPrev');
    $prevButton.trigger('click');
    Helpers.assertCurrentPageData1stPage();
});

test('jQuery.paginatable() "Next" button on last page does not change content', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    ok($obj.length);

    $navigations = $('.pgnNavigation');
    equal($navigations.length, 2);

    var $topNavigation = $($navigations[0]);
    Helpers.assertCurrentPageData1stPage();

    $obj.paginatable('displayLastPage');
    Helpers.assertCurrentPageData2ndPage();

    $nextButton = $topNavigation.find('.pgnBtnNext');
    $nextButton.trigger('click');
    Helpers.assertCurrentPageData2ndPage();
});

test('jQuery.paginatable() refreshes on signal', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody'),
        sigRefreshPages: 'tablesortable.sorted'
    });
    ok($obj.length);

    Helpers.assertCurrentPageData1stPage();

    $('#myTable tbody').empty();
    $('#myTable tbody').html(
        '<tr><td>3</td><td>x</td></tr>' +
        '<tr><td>7</td><td>y</td></tr>' +
        '<tr><td>1</td><td>z</td></tr>'
    );
    $obj.trigger('tablesortable.sorted');
    Helpers.assertCurrentPageData([[3, 'x'], [7, 'y']]);
});

QUnit.module('jquery.filterable', {
    $obj: '',
    $navigation: '',
    FILTER1_TEXT: 'filter1 text',
    FILTER2_TEXT: 'filter2 text',
    filterTexts: [
        [this.FILTER1_TEXT, new RegExp(this.FILTER1_TEXT)],
        [this.FILTER2_TEXT, new RegExp(this.FILTER2_TEXT)]
    ],
    beforeEach: function() {
        this.$obj = $('#filterable').filterable({
            hideColumns: [
                {column: 1, condition: 'True', text: this.FILTER1_TEXT},
                {column: 2, condition: 'True', text: this.FILTER2_TEXT}
            ],
            container: $('#filterable tbody')
        });
        this.$navigation = $('.filterNavigation');
        ok(this.$obj.length);
        ok(this.$navigation.length);
    },
    clickFilter1: function() {
        this._clickFilter(0);
    },
    clickFilter2: function() {
        this._clickFilter(1);
    },
    _clickFilter: function(i) {
        var $filter =
            this.$navigation.eq(0).find('[name=filterOption]').eq(i);
        $filter.trigger('click');
    }
});

QUnit.test('settings', function() {
    var nExpectedCheckboxes = 2;
    var nExpectedNavigations = 2;

    equal(this.$navigation.length, nExpectedNavigations);
    equal(this.$navigation.eq(0).find('[name=filterOption]').length,
        nExpectedCheckboxes);

    for (var i = 0; i < nExpectedCheckboxes; i++) {
        var $checkbox =
            this.$navigation.eq(0).find('[name=filterOption]').eq(i);
        equal($checkbox.length, 1);
        var $label = $checkbox.parent();
        ok($label.html().match(this.filterTexts[i][1]));
    }
});

QUnit.test('clicking filter checkbox works as expected', function() {
    var $rows = this.$obj.find('tbody tr');

    this.clickFilter1();
    equal($rows.eq(0).attr('class'), 'byFilter0');
    equal($rows.eq(1).attr('class'), 'filtered');
    equal($rows.eq(2).attr('class'), 'byFilter0');

    this.clickFilter2();
    equal($rows.eq(0).attr('class'), 'byFilter0');
    equal($rows.eq(1).attr('class'), 'filtered');
    equal($rows.eq(2).attr('class'), 'byFilter0 byFilter1');

    this.clickFilter1();
    equal($rows.eq(0).attr('class'), 'filtered');
    equal($rows.eq(1).attr('class'), 'filtered');
    equal($rows.eq(2).attr('class'), 'byFilter1');

    this.clickFilter2();
    equal($rows.eq(0).attr('class'), '');
    equal($rows.eq(1).attr('class'), '');
    equal($rows.eq(2).attr('class'), '');
});

QUnit.test('clicking filter checkbox checks related checkboxes in different' +
        ' filter navigations', function() {
    var $filterNavigations = $('.filterNavigation');
    equal($filterNavigations.length, 2);

    var confirmCheckboxesAreChecked = function(checked, i) {
        $filterNavigations.each(function() {
            var $checkBox = $(this).find('input[type=checkbox]').eq(i);
            equal($checkBox.prop('checked'), checked);
        });
    };

    this.clickFilter1();
    confirmCheckboxesAreChecked(true, 0);
    this.clickFilter1();
    confirmCheckboxesAreChecked(false, 0);

    this.clickFilter2();
    confirmCheckboxesAreChecked(true, 1);
    this.clickFilter2();
    confirmCheckboxesAreChecked(false, 1);
});

QUnit.test('unclicking filter checkbox resets filtered items', function() {
    equal(this.$obj.find('tbody tr.filtered').length, 0);
    this.clickFilter1();
    equal(this.$obj.find('tbody tr.filtered').length, 1);
    this.clickFilter1();
    equal(this.$obj.find('tbody tr.filtered').length, 0);
});

QUnit.module('jquery.tablesortable.paginatable.filterable', {
    $obj: '',
    $firstColumnHeader: '',
    $secondColumnHeader: '',
    $filterNavigation: '',
    FILTER1_TEXT: 'filter1 text',
    FILTER2_TEXT: 'filter2 text',
    $pageNavigation: '',
    beforeEach: function() {
        this.$obj = $('#myTable').tablesortable({
            columnTypes: {0: 'integer'},
            columnContainers: {1: 'a'}
        }).paginatable({
            nItemsPerPage: 2,
            container: $('#myTable tbody')
        }).filterable({
            hideColumns: [
                {column: 2, condition: 'True', text: this.FILTER1_TEXT},
                {column: 3, condition: 'True', text: this.FILTER2_TEXT}
            ],
            container: $('#myTable tbody')
        });
        ok(this.$obj.length);

        this.$firstColumnHeader =
            Helpers.getTable().find('thead tr th').first();
        this.$secondColumnHeader = this.$firstColumnHeader.next();

        this.$filterNavigation = $('.filterNavigation').eq(0);
        ok(this.$filterNavigation.length);

        this.$pageNavigation = $('.pgnNavigation').eq(0);
        ok(this.$pageNavigation.length);
    },
    nextPage: function() {
        this.$pageNavigation.find('.pgnBtnNext').trigger('click');
    },
    prevPage: function() {
        this.$pageNavigation.find('.pgnBtnPrev').trigger('click');
    },
    sortByColumn1: function() {
        this.$firstColumnHeader.trigger('click');
    },
    sortByColumn2: function() {
        this.$secondColumnHeader.trigger('click');
    },
    clickFilter1: function() {
        this._clickFilter(0);
    },
    clickFilter2: function() {
        this._clickFilter(1);
    },
    _clickFilter: function(i) {
        var $filter =
            this.$filterNavigation.eq(0).find('[name=filterOption]').eq(i);
        $filter.trigger('click');
    }
});

QUnit.test('pagination works with sorting', function() {
    var rows = this.$obj.tablesortable('getData')['rows'];

    this.sortByColumn1();
    Helpers.assertIsSortedByFirstColumn(rows);
    Helpers.assertCurrentPageData([
        ['3', '<a href="9">a</a>'],
        ['4', '<a href="0">d</a>']
    ]);

    this.sortByColumn2();
    Helpers.assertIsSortedBySecondColumn(rows);
    Helpers.assertCurrentPageData([
        ['3', '<a href="9">a</a>'],
        ['17', '<a href="3">c</a>']
    ]);
});

QUnit.test('pagination + filtering: number of pages decreases and increases' +
        ' properly with filtered data', function() {

    var confirmPage1Data = function() {
        Helpers.assertCurrentPageData([['3', '<a href="9">a</a>']]);
    };

    this.sortByColumn1();
    this.clickFilter2();
    confirmPage1Data();

    this.nextPage();
    confirmPage1Data();
    this.prevPage();
    confirmPage1Data();

    this.clickFilter2();
    Helpers.assertCurrentPageData([
        ['3', '<a href="9">a</a>'],
        ['4', '<a href="0">d</a>']
    ]);

    this.nextPage();
    Helpers.assertCurrentPageData([
        ['7', '<a href="1">f</a>'],
        ['17', '<a href="3">c</a>']
    ]);
});

QUnit.test('pagination + filtering: filtered items are excluded', function() {

    this.sortByColumn1();
    this.clickFilter1();
    Helpers.assertCurrentPageData([
        ['3', '<a href="9">a</a>'],
        ['4', '<a href="0">d</a>']
    ]);

    this.nextPage();
    Helpers.assertCurrentPageData([
        ['17', '<a href="3">c</a>']
    ]);
});

QUnit.test('pagination + filtering: pagination gets updated after new' +
        ' filtering', function() {

    this.sortByColumn1();

    this.nextPage();
    this.clickFilter1();

    Helpers.assertCurrentPageData([
        ['17', '<a href="3">c</a>']
    ]);
});
