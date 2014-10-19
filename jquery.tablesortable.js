;(function($) {

    $.fn.tablesortable = function(methodOrOptions) {

        var $thead = this.find('thead');

        var settings = $.extend({
            columnTypes: {},
            columnContainers: {}
        }, methodOrOptions || []);

        var methods = {
            init: function(options) {

                data = [];
                var $rows = this.find('tbody tr');
                var nRows = $rows.length;
                var raw, cols, container;
                for (var i = 0; i < nRows; i++) {
                    raw = '';
                    cols = [];
                    
                    $cols = $($rows[i]).find('td');
                    for (var j = 0; j < $cols.length; j++) {
                        container = settings.columnContainers[j];
                        if (container)
                            cols.push($($cols[j]).find(container).html());
                        else
                            cols.push($($cols[j]).html());

                        raw += $cols[j].outerHTML;
                    }
                    data.push({content: cols, raw: raw});
                }

                this.data('rows', data);
                this.data('sortStatus', {
                    column: 0,
                    order: methods.ORDER_BY_NONE
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
            ORDER_BY_NONE: 2,

            getCastedDataAsArray: function(a, b, type) {
                if (type == 'integer') {
                    a = parseInt(a);
                    b = parseInt(b);
                } else if (type == 'float') {
                    a = parseFloat(a);
                    b = parseFloat(b);
                } else if (type == 'istring') {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                }
                return [a, b];
            },

            sort: function(colNo) {       
                if (colNo >= this.nCols)
                    return false;

                var rows = this.data('rows');
                var sortStatus = this.data('sortStatus');
                var columnType = this.data('columnTypes')[colNo];

                var isSortedAsc = sortStatus.column == colNo &&
                        sortStatus.order == methods.ORDER_BY_ASC;

                var me = this;

                if (isSortedAsc) {
                    rows.sort(function(a, b) {
                        values = methods.getCastedDataAsArray(
                            a.content[colNo], b.content[colNo], columnType);
                        return values[0] < values[1] ? 1 : -1;
                    });
                    sortStatus.order = methods.ORDER_BY_DESC;
                } else {
                    rows.sort(function(a, b) {
                        values = methods.getCastedDataAsArray(
                            a.content[colNo], b.content[colNo], columnType);
                        return values[0] < values[1] ? -1 : 1;
                    });
                    sortStatus.order = methods.ORDER_BY_ASC;
                }
                sortStatus.column = colNo;

                methods.fillTable.call(this, rows);

                this.trigger('tablesortable.sorted');
                return true;
            },

            fillTable: function(rows) {
                var $tbody = this.find('tbody');
                $tbody.empty();
                var rowString;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].length == 0)
                        continue;
                    $tbody.append('<tr>' + rows[i].raw + '</tr>');
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
                    ' does not exist on jQuery.tablesortable');
        }
    };
})(jQuery);
