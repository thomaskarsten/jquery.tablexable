var Helpers = {
    tableId: '#myTable',
    getTable: function() {
        return $(this.tableId);
    },
    getTableSorter: function() {
        var tableSorter = new TableSorter($(this.tableId));
        tableSorter.setColumnType(0, TableSorter.INTEGER);
        tableSorter.setColumnType(1, TableSorter.STRING);
        return tableSorter;
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
        var expected = [['3', 'a'], ['4', 'd'], ['7', 'f'], ['17', 'c']];

        if (typeof desc != 'undefined' && desc == true)
            expected.reverse();

        Helpers.assertData(expected, data);
        Helpers.assertTable(expected, $table);
    },
    assertIsSortedBySecondColumn: function(data, desc) {
        var $table = Helpers.getTable();
        var expected = [['3', 'a'], ['17', 'c'], ['4', 'd'], ['7', 'f']];

        if (typeof desc != 'undefined' && desc == true)
            expected.reverse();

        Helpers.assertData(expected, data);
        Helpers.assertTable(expected, $table);
    }

};

test('TableSorter.constructor()', function() {
    var tableSorter = Helpers.getTableSorter();
    ok(tableSorter);

    equal(tableSorter.getNRows(), 4);
    equal(tableSorter.getNCols(), 2);
    var data = tableSorter.getData();
    equal(data.length, 4);
    Helpers.assertData([['17', 'c'], ['3', 'a'], ['7', 'f'], ['4', 'd']], data);
});

test('TableSorter.sort()', function() {
    var tableSorter = Helpers.getTableSorter();

    tableSorter.sort(0);
    Helpers.assertIsSortedByFirstColumn(tableSorter.getData());

    tableSorter.sort(1);
    Helpers.assertIsSortedBySecondColumn(tableSorter.getData());
});

test('TableSorter.sort() works after clicking the header', function() {
    var $table = Helpers.getTable();
    var tableSorter = Helpers.getTableSorter();

    var $firstColumn = $table.find('thead tr th').first();
    var $secondColumn = $firstColumn.next();

    $firstColumn.trigger('click');
    Helpers.assertIsSortedByFirstColumn(tableSorter.getData());
    $firstColumn.trigger('click');
    Helpers.assertIsSortedByFirstColumn(tableSorter.getData(), true);

    $secondColumn.trigger('click');
    Helpers.assertIsSortedBySecondColumn(tableSorter.getData());
    $secondColumn.trigger('click');
    Helpers.assertIsSortedBySecondColumn(tableSorter.getData(), true);
});
