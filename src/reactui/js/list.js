/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    *   listItems
    *   initialColumns
    *
    * state:
    *   selected
    *   columns
    *   sortBy
    *
    * children:
    *   listelement:
    *     key
    *     tr
    *     getData()
    *
    *  columns:
    *    props (classes etc)
    *    label
    *    sorting (alphabet, numeric, null)
    *    title?
    */
    UIComponents.List = React.createClass({
        getInitialState: function () {
            var initialColumn = this.props.initialColumn || this.props.initialColumns[0];

            var initialSelected = this.props.listItems[0];

            return ({
                columns: this.props.initialColumns,
                selected: initialSelected,
                sortBy: {
                    column: initialColumn,
                    order: initialColumn.defaultOrder || "desc"
                }
            });
        },
        componentWillMount: function () {
            this.sort();
            this.setState({
                selected: this.props.sortedItems[0]
            });
        },
        componentDidMount: function () {
            var self = this;
            this.getDOMNode().addEventListener("keydown", function (event) {
                switch (event.keyCode) {
                    case 40: {
                        self.shiftSelection(1);
                        break;
                    }
                    case 38: {
                        self.shiftSelection(-1);
                        break;
                    }
                    default: {
                        return;
                    }
                }
            });
        },
        handleSelectColumn: function (column) {
            if (column.notSortable)
                return;
            var order;
            if (this.state.sortBy.column.key === column.key) {
                order = this.state.sortBy.order === "desc" ? "asc" : "desc";
            } else {
                order = column.defaultOrder;
            }

            this.setState({
                sortBy: {
                    column: column,
                    order: order
                }
            });
        },
        handleSelectRow: function (row) {
            this.setState({
                selected: row
            });
        },
        sort: function () {
            var selectedColumn = this.state.sortBy.column;
            var propToSortBy = selectedColumn.propToSortBy || selectedColumn.key;
            var itemsToSort = this.props.listItems;

            if (selectedColumn.sortingFunction) {
                itemsToSort.sort(selectedColumn.sortingFunction);
            } else {
                itemsToSort.sort(function (a, b) {
                    return a.data[propToSortBy] > b.data[propToSortBy] ? 1 : -1;
                });
            }

            if (this.state.sortBy.order === "asc") {
                itemsToSort.reverse();
            }

            //else if (this.state.sortBy.order !== "desc") throw new Error("Invalid sort parameter");
            this.props.sortedItems = itemsToSort;
        },
        shiftSelection: function (amountToShift) {
            var reverseIndexes = {};
            for (var i = 0; i < this.props.sortedItems.length; i++) {
                reverseIndexes[this.props.sortedItems[i].key] = i;
            }
            ;
            var currSelectedIndex = reverseIndexes[this.state.selected.key];
            var nextIndex = (currSelectedIndex + amountToShift) % this.props.sortedItems.length;
            if (nextIndex < 0) {
                nextIndex += this.props.sortedItems.length;
            }
            this.setState({
                selected: this.props.sortedItems[nextIndex]
            });
        },
        render: function () {
            var self = this;
            var columns = [];
            var headerLabels = [];

            this.state.columns.forEach(function (column) {
                var colProps = {
                    key: column.key
                };

                columns.push(React.DOM.col(colProps));
                headerLabels.push(React.DOM.th({
                    className: !column.notSortable ? "sortable-column" : null,
                    title: column.title,
                    onClick: self.handleSelectColumn.bind(null, column),
                    key: column.key
                }, column.label));
            });

            this.sort();

            var sortedItems = this.props.sortedItems;

            var rows = [];
            sortedItems.forEach(function (item) {
                var cells = [];
                for (var _column in self.state.columns) {
                    var column = self.state.columns[_column];

                    cells.push(React.DOM.td({
                        key: "" + item.key + "_" + column.key
                    }, item.data[column.key] || null));
                }

                var rowProps = {};
                rowProps.key = item.key;
                rowProps.onClick = self.handleSelectRow.bind(null, item);
                if (self.state.selected.key === item.key) {
                    rowProps.className = "selected";
                }
                rows.push(React.DOM.tr(rowProps, cells));
            });

            return (React.DOM.table({
                tabIndex: 1
            }, React.DOM.colgroup(null, columns), React.DOM.thead(null, React.DOM.tr(null, headerLabels)), React.DOM.tbody(null, rows)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=list.js.map
