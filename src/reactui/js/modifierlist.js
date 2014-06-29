/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.ModifierList = React.createClass({
        render: function () {
            var rows = [];
            for (var i = 0; i < this.props.modifiers.length; i++) {
                var modifier = this.props.modifiers[i];
                rows.push({
                    key: modifier.type,
                    data: {
                        title: modifier.title,
                        cost: modifier.cost || null,
                        costString: modifier.cost !== undefined ? beautify(modifier.cost) + "$" : null,
                        description: modifier.description,
                        modifier: modifier
                    }
                });
            }
            var columns = [
                {
                    label: "Title",
                    key: "title"
                },
                {
                    label: "Cost",
                    key: "costString",
                    defaultOrder: "asc",
                    propToSortBy: "cost"
                },
                {
                    label: "Description",
                    key: "description",
                    notSortable: true
                }
            ];

            return (UIComponents.List({
                // TODO fix declaration file and remove
                // typescript qq without these
                selected: null,
                columns: null,
                sortBy: null,
                initialColumn: columns[1],
                ref: "list",
                className: "modifier-list",
                rowStylingFN: this.props.rowStylingFN,
                listItems: rows,
                initialColumns: columns
            }));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=modifierlist.js.map
