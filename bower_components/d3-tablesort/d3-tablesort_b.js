/*
 * d3 table sort
 * (c) Ilkka Huotari 2013, http://ilkkah.com
 * Inspired by: http://devforrest.com/examples/table/table.php
 * License: MIT
 */

(function(globals) {

    var sort_column = -1, // don't sort any column by default
        sort_order = 1; // desc

    // utility functions. does d3 have these?
    var isArray = Array.isArray || function(arr) {
            return toString.call(arr) == '[object Array]';
        };

    var isObject = function(a) {
        return (!!a) && (a.constructor === Object);
    };

    globals.TableSort = function(table, columns, data) {


        function sort(d, i) {
            var sort,
                sort_btn = d3.select(d3.event.toElement || d3.event.target),
                is_desc = sort_btn.classed('sort_desc');

            sort_order = is_desc? -1: 1;
            d3.selectAll("th").classed('sort_indicator', false);
            sort_btn.classed('sort_indicator', true).classed('sort_desc', !is_desc).classed('sort_asc', is_desc);
            sort_column = i;
            console.log(d, i);
            outerTable.selectAll("tr:not(.header_row)").sort(
                function(a, b) {
                    return d.sort(isArray(a)? a[sort_column]: a.data[sort_column], isArray(b)? b[sort_column]: b.data[sort_column], sort_order); 
                }
            );
        }

        outerTable = ((typeof table === 'string')? d3.select(table): table)
            .html(null)
            .append("table")//.attr("style", "width:" + dim.w);

        outerTable
            .append("tr").classed('header_row', true).selectAll("th").data(columns).enter()
            .append("th")
            .text(function (column) { return column.text; })
            .classed('sort_desc', true)
            .on('click', sort);

        // Create a row for each object in the data and perform an intial sort.
        rows = outerTable.selectAll("tr:not(.header_row)").data(data).enter().append("tr");

        // set element attributes if data is given in the form of data = [ { ..., data: []}, { ..., data: []}, { ..., data: []}, { ..., data: []} ]
        // where '...' stands for attributes to set
        rows.datum(function(obj) {
            if (isObject(obj)) {
                for (var i in obj) {
                    if (i !== 'data') {
                        this.setAttribute(i, obj[i]);
                    }
                }
            }
            return obj;
        })

        // initial sort
        if (sort_column >= 0 && columns[sort_column].sort) {
            outerTable.selectAll('tr:not(.header_row)').sort(
                function(a, b) {
                    return columns[sort_column].sort(isArray(a)? a[sort_column]: a.data[sort_column], isArray(b)? b[sort_column]: b.data[sort_column], sort_order); 
                })
        }

        // Create a cell in each row for each column
        rows.selectAll("td")
            .data(function (d) {
                return isArray(d)? d: d.data;
            }).enter()
            .append("td")
    		.text(function (d) { return d; });
    }

    globals.TableSort.alphabetic = function(a, b, sort_order) { return sort_order * a.localeCompare(b); }
    globals.TableSort.numeric = function(a, b, sort_order) { return sort_order * (parseFloat(b) - parseFloat(a)); }

}(window));