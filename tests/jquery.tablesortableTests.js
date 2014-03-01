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
        var expectedData = [['3', 'a'], ['4', 'd'], ['7', 'f'], ['17', 'c']];
        var expectedHtml = [
            ['3', '<a href="9">a</a>'],
            ['4', '<a href="0">d</a>'],
            ['7', '<a href="1">f</a>'],
            ['17', '<a href="3">c</a>']
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
        var expectedData = [['3', 'a'], ['17', 'c'], ['4', 'd'], ['7', 'f']];
        var expectedHtml = [
            ['3', '<a href="9">a</a>'],
            ['17', '<a href="3">c</a>'],
            ['4', '<a href="0">d</a>'],
            ['7', '<a href="1">f</a>']
        ];

        if (typeof desc != 'undefined' && desc == true) {
            expectedData.reverse();
            expectedHtml.reverse();
        }

        Helpers.assertData(expectedData, data);
        Helpers.assertTable(expectedHtml, $table);
    },

    assertVisibleData1stPage: function() {
        var expected = [
            ['17', '<a href="3">c</a>'],
            ['3', '<a href="9">a</a>']
        ];
        Helpers.assertVisibleData(expected);
    },

    assertVisibleData2ndPage: function() {
        var expected = [
            ['7', '<a href="1">f</a>'],
            ['4', '<a href="0">d</a>']
        ];
        Helpers.assertVisibleData(expected);
    },

    assertVisibleData: function(expected) {
        var $table = Helpers.getTable();
        var visible = [];
        var $visibleRows = $table.find('tbody tr:visible');
        $visibleRows.each(function(index, element) {
            var $tds = $(element).find('td');
            visible.push([$($tds[0]).html(), $($tds[1]).html()]);
        });

        Helpers.assertData(expected, visible);
    }
};

test('jQuery.tablesortable()', function() {
    var $obj = $('#myTable').tablesortable({columnContainers: {1: 'a'}});
    ok($obj.length);
    var data = $obj.tablesortable('getData');
    equal(data['rows'].length, 4);
    equal(data['columnTypes'].length, 2);
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

test('jQuery.paginatable()', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    ok($obj);

    $navigations = $('.pgnNavigation');
    equal($navigations.length, 2);

    var $table = Helpers.getTable();
    equal($table.find('tbody tr:visible').length, 2);
    Helpers.assertVisibleData1stPage();

    $obj.paginatable('displayPage', 1);
    equal($table.find('tbody tr:visible').length, 2);
    Helpers.assertVisibleData2ndPage();
});

test('jQuery.paginatable() displayPage() works', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    equal($obj.length, 1);

    var $table = Helpers.getTable();
    equal($table.find('tbody tr:visible').length, 2);
    Helpers.assertVisibleData1stPage();

    $obj.paginatable('displayPage', -1);
    equal($table.find('tbody tr:visible').length, 2);
    Helpers.assertVisibleData2ndPage();

    $obj.paginatable('displayPage', 0);
    equal($table.find('tbody tr:visible').length, 2);
    Helpers.assertVisibleData1stPage();

    $obj.paginatable('displayPage', 1);
    equal($table.find('tbody tr:visible').length, 2);
    Helpers.assertVisibleData2ndPage();
});

test('jQuery.paginatable() buttons exist and accept click events', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    ok($obj.length);

    $navigations = $('.pgnNavigation');
    equal($navigations.length, 2);

    Helpers.assertVisibleData1stPage();

    var $topNavigation = $($navigations[0]);

    var $lastPageButton = $topNavigation.find('.pgnBtnLast');
    equal($lastPageButton.length, 1);
    $lastPageButton.trigger('click');
    Helpers.assertVisibleData2ndPage();

    var $firstPageButton = $topNavigation.find('.pgnBtnFirst');
    equal($firstPageButton.length, 1);
    $firstPageButton.trigger('click');
    Helpers.assertVisibleData1stPage();

    $nextButton = $topNavigation.find('.pgnBtnNext');
    $nextButton.trigger('click');
    Helpers.assertVisibleData2ndPage();

    $prevButton = $topNavigation.find('.pgnBtnPrev');
    $prevButton.trigger('click');
    Helpers.assertVisibleData1stPage();
});

test('jQuery.paginatable() "Prev" button on first page does not change content', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });

    $navigations = $('.pgnNavigation');
    equal($navigations.length, 2);

    Helpers.assertVisibleData1stPage();

    $prevButton = $($navigations[0]).find('li').first();
    $prevButton.trigger('click');
    Helpers.assertVisibleData1stPage();
});

test('jQuery.paginatable() "Next" button on last page does not change content', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    ok($obj.length);

    $navigations = $('.pgnNavigation');
    equal($navigations.length, 2);

    Helpers.assertVisibleData1stPage();

    $obj.paginatable('displayPage', 1);
    Helpers.assertVisibleData2ndPage();

    $nextButton = $($navigations[0]).find('li').last();
    $nextButton.trigger('click');
    Helpers.assertVisibleData2ndPage();
});

test('jQuery.paginatable() refreshes on signal', function() {
    var $obj = $('#myTable').paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody'),
        sigRefreshPages: 'tablesortable.sorted'
    });
    ok($obj.length);

    Helpers.assertVisibleData1stPage();

    $('#myTable tbody').empty();
    $('#myTable tbody').html(
        '<tr><td>3</td><td>x</td></tr>' +
        '<tr><td>7</td><td>y</td></tr>' +
        '<tr><td>1</td><td>z</td></tr>'
    );
    $obj.trigger('tablesortable.sorted');
    Helpers.assertVisibleData([[3, 'x'], [7, 'y']]);
});

test('jQuery.tablesortable().paginatable() work together', function() {
    var $obj = $('#myTable').tablesortable({
        columnTypes: {0: 'integer'},
        columnContainers: {1: 'a'}
    }).paginatable({
        nItemsPerPage: 2,
        container: $('#myTable tbody')
    });
    ok($obj.length);
    var rows = $obj.tablesortable('getData')['rows'];

    var $firstColumn = Helpers.getTable().find('thead tr th').first();
    var $secondColumn = $firstColumn.next();

    $firstColumn.trigger('click');
    Helpers.assertIsSortedByFirstColumn(rows);
    Helpers.assertVisibleData([
        ['3', '<a href="9">a</a>'],
        ['4', '<a href="0">d</a>']
    ]);

    $secondColumn.trigger('click');
    Helpers.assertIsSortedBySecondColumn(rows);
    Helpers.assertVisibleData([
        ['3', '<a href="9">a</a>'],
        ['17', '<a href="3">c</a>']
    ]);
});
