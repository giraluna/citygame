/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.BuildingList = React.createClass({
        /**
        * props:
        * player
        * buildingTemplates
        * buildingImages
        *
        * state:
        * selected building
        */
        getInitialState: function () {
            return ({
                selected: null
            });
        },
        handleSelectRow: function (selectedBuildingType) {
            this.setState({
                selected: selectedBuildingType
            });
        },
        render: function () {
            var player = this.props.player;
            var rows = [];
            for (var type in this.props.buildingTemplates) {
                var buildingTemplate = this.props.buildingTemplates[type];
                var playerCanBuildBuilding = true;
                var rowProps = {};
                var costProps = { className: "money" };

                if (player.money < buildingTemplate.cost) {
                    playerCanBuildBuilding = false;
                    costProps.className = "insufficient-money";
                }
                ;

                if (playerCanBuildBuilding) {
                    rowProps.onClick = this.handleSelectRow(buildingTemplate.type);
                }
                ;

                var row = React.DOM.tr(rowProps, React.DOM.td({ className: "building-image" }, React.DOM.img({ src: this.props.buildingImages[buildingTemplate.type] })), React.DOM.td({ className: "building-title" }, buildingTemplate.type), React.DOM.td(costProps, buildingTemplate.cost));

                rows.push(row);
            }
            ;

            return (React.DOM.table({ className: "building-list" }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null), React.DOM.th(null, "Type"), React.DOM.th(null, "Cost"))), React.DOM.tbody(null, rows)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=buildinglist.js.map
