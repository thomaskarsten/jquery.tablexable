;(function($) {

    $.fn.tableSortable = function(methodOrOptions) {

        var $thead = this.find('thead');

        var settings = $.extend({
            columnTypes: {}
        }, methodOrOptions || []);

        var methods = {
            init: function(options) {
                data = [];
                var $rows = this.find('tbody tr');
                var nRows = $rows.length;
                var row;
                for (var i = 0; i < nRows; i++) {
                    row = [];
                    $cols = $($rows[i]).find('td');

                    for (var j = 0; j < $cols.length; j++)
                        row.push($($cols[j]).html());
                    data.push(row);
                }

                this.data('rows', data);
                this.data('sortStatus', {
                    column: 0,
                    order: 0
                });

                var me = this;
                var columnTypes = [];
                this.find('thead th').each(function(index, element) {
                    $(element).on('click', function() {
                        methods.sort.call(me, index);
                    });
                    var columnType = settings.columnTypes[index];
                    if (columnType)
                        columnTypes.push(columnType);
                    else
                        columnTypes.push('string');
                });

                this.data('columnTypes', columnTypes);

                return this;
            },

            ORDER_BY_ASC: 0,
            ORDER_BY_DESC: 1,

            sort: function(colNo) {       
                if (colNo >= this.nCols)
                    return false;

                var rows = this.data('rows');
                var sortStatus = this.data('sortStatus');
                var columnType = this.data('columnTypes')[colNo];

                var isSortedAsc = sortStatus.column == colNo &&
                        sortStatus.order == this.ORDER_BY_ASC;

                var getCastedDataAsArray = function(a, b, type) {
                    if (type == 'integer') {
                        a = parseInt(a);
                        b = parseInt(b);
                    } else if (type == 'float') {
                        a = parseFloat(a);
                        b = parseFloat(b);
                    }
                    return [a, b];
                };

                var me = this;

                if (isSortedAsc) {
                    rows.sort(function(a, b) {
                        values = getCastedDataAsArray(a[colNo], b[colNo],
                                columnType);
                        return values[0] < values[1];
                    });
                    sortStatus.order = this.ORDER_BY_DESC;
                } else {
                    rows.sort(function(a, b) {
                        values = getCastedDataAsArray(a[colNo], b[colNo],
                                columnType);
                        return values[0] > values[1];
                    });
                    sortStatus.order = this.ORDER_BY_ASC;
                }
                sortStatus.column = colNo;

                methods.fillTable.call(this, rows);

                this.trigger('tableSorter.sorted');
                return true;
            },

            fillTable: function(rows) {
                var $tbody = this.find('tbody');
                $tbody.empty();
                var rowString;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].length == 0)
                        continue;

                    rowString = '';
                    for (var j = 0; j < rows[i].length; j++)
                        rowString += '<td>' + rows[i][j] + '</td>';

                    $tbody.append('<tr>' + rowString + '</tr>');
                }
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
                    ' does not exist on jQuery.tableSortable');
        }
    };
})(jQuery);
var TableSorter = function($table) {
    this.$table = $table;
    this.$thead = $table.find('thead');
    this.$tbody = $table.find('tbody');
    this.$rows = this.$tbody.find('tr');
    this.$headers = this.$thead.find('th');
    this.nCols = this.$headers.length;
    this.nRows = this.$rows.length;

    this.ORDER_BY_ASC = 0;
    this.ORDER_BY_DESC = 1;

    this.data = [];
    this.sortStatus = {
        column: -1,
        order: this.ORDER_BY_ASC
    };

    this.columnTypes = [];

    this.init();
};

TableSorter.STRING = 0;
TableSorter.INTEGER = 1;
TableSorter.FLOAT = 2;

TableSorter.prototype.init = function() {
    var row;
    for (var i = 0; i < this.nRows; i++) {
        row = [];
        $cols = $(this.$rows[i]).find('td');

        for (var j = 0; j < $cols.length; j++)
            row.push($($cols[j]).html());

        this.data.push(row);
    }

    var me = this;
    this.$headers.each(function(index, element) {
        $(element).on('click', function() {
            me.sort(index);
        });
        me.columnTypes.push(TableSorter.STRING);
    });
};

TableSorter.prototype.setColumnType = function(colNo, type) {
    this.columnTypes[colNo] = type;
};

TableSorter.prototype.getColumnType = function(colNo) {
    return this.columnTypes[colNo];
};

TableSorter.prototype.getNRows = function() {
    return this.nRows;
};

TableSorter.prototype.getNCols = function() {
    return this.nCols;
};

TableSorter.prototype.getData = function() {
    return this.data;
};

TableSorter.prototype.sort = function(colNo) {
    if (colNo >= this.nCols)
        return false;

    var isSortedAsc = this.sortStatus.column == colNo &&
            this.sortStatus.order == this.ORDER_BY_ASC;

    var getCastedDataAsArray = function(a, b, type) {
        if (type == TableSorter.INTEGER) {
            a = parseInt(a);
            b = parseInt(b);
        } else if (type == TableSorter.FLOAT) {
            a = parseFloat(a);
            b = parseFloat(b);
        }
        return [a, b];
    };

    var me = this;

    if (isSortedAsc) {
        this.data.sort(function(a, b) {
            values = getCastedDataAsArray(a[colNo], b[colNo],
                    me.getColumnType(colNo));
            return values[0] < values[1];
        });
        this.sortStatus.order = this.ORDER_BY_DESC;
    } else {
        this.data.sort(function(a, b) {
            values = getCastedDataAsArray(a[colNo], b[colNo],
                    me.getColumnType(colNo));
            return values[0] > values[1];
        });
        this.sortStatus.order = this.ORDER_BY_ASC;
    }
    this.sortStatus.column = colNo;

    this.$tbody.empty();
    var data = this.data;
    var rowString;
    for (var i = 0; i < data.length; i++) {
        if (data[i].length == 0)
            continue;

        rowString = '';
        for (var j = 0; j < data[i].length; j++)
            rowString += '<td>' + data[i][j] + '</td>';

        this.$tbody.append('<tr>' + rowString + '</tr>');
    }

    return true;
};
