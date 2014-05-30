/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    * player
    * buildingTemplates
    * buildingImages
    *
    * state:
    * selected building
    */
    UIComponents.BuildingList = React.createClass({
        getInitialState: function () {
            var templates = this.props.buildingTemplates;
            for (var _type in templates) {
                var building = templates[_type];
                if (this.props.player.money >= building.cost && this.props.cell.checkBuildable(building)) {
                    return { selected: building };
                }
            }
            return { selected: null };
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
                var rowProps = { key: buildingTemplate.type };
                var costProps = { className: "money" };
                var nameProps = { className: "building-title" };

                if (player.money < buildingTemplate.cost) {
                    playerCanBuildBuilding = false;
                    rowProps.className = "inactive";
                    costProps.className = "insufficient";
                }
                if (this.props.cell && !this.props.cell.checkBuildable(buildingTemplate)) {
                    playerCanBuildBuilding = false;
                    rowProps.className = "inactive";
                    nameProps.className = "insufficient";
                }
                ;

                if (playerCanBuildBuilding) {
                    rowProps.onClick = rowProps.onTouchStart = this.handleSelectRow.bind(null, buildingTemplate.type);
                    rowProps.className = "active";
                }
                ;

                if (this.state.selected && this.state.selected === buildingTemplate.type) {
                    rowProps.className = "selected";
                }
                ;

                var image = this.props.buildingImages[buildingTemplate.frame];

                var row = React.DOM.tr(rowProps, React.DOM.td({ className: "building-image" }, React.DOM.img({
                    src: image.src,
                    width: image.width / 2,
                    height: image.height / 2
                })), React.DOM.td(nameProps, buildingTemplate.translate), React.DOM.td(costProps, buildingTemplate.cost + "$"));

                rows.push(row);
            }
            ;

            return (React.DOM.table({ className: "building-list" }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null), React.DOM.th(null, "Type"), React.DOM.th(null, "Cost"))), React.DOM.tbody(null, rows)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=buildinglist.js.map
