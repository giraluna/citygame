/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    *   player
    *   buildableTypes
    */
    UIComponents.SideMenuBuildings = React.createClass({
        handleBuildingSelect: function (building, continuous) {
            eventManager.dispatchEvent({
                type: "changeBuildingType",
                content: {
                    building: building,
                    continuous: continuous
                }
            });
        },
        render: function () {
            var divs = [];
            var player = this.props.player;

            for (var i = 0; i < playerBuildableBuildings.length; i++) {
                var building = playerBuildableBuildings[i];

                var boundSelect = this.handleBuildingSelect.bind(null, building, false);
                var boundContinuous = this.handleBuildingSelect.bind(null, building, true);

                var buildCost = player.getBuildCost(building);
                var canAfford = player.money >= buildCost;
                var amountBuilt = player.amountBuiltPerType[building.categoryType];

                var divProps = { className: "side-building", key: building.type };

                var imageProps = { className: "building-image" };
                var titleProps = { className: "building-title" };
                var costProps = { className: "building-cost" };
                var amountProps = { className: "building-amount" };

                if (!canAfford) {
                    divProps.className += " inactive";
                    costProps.className += " insufficient";
                } else {
                    divProps.onClick = function (e) {
                        console.log(e.shiftKey);
                        if (e.shiftKey)
                            boundContinuous();
                        else
                            boundSelect();
                    };
                }

                var image = this.props.frameImages[building.frame];
                imageProps.src = image.src;

                var div = React.DOM.div(divProps, React.DOM.img(imageProps, null), React.DOM.div({ className: "building-content" }, React.DOM.div({ className: "building-content-wrapper" }, React.DOM.div(titleProps, building.translate), React.DOM.div(costProps, "" + buildCost + "$")), React.DOM.div(amountProps, amountBuilt)));

                divs.push(div);
            }
            return (React.DOM.div({ id: "side-menu-buildings", className: "grid-column" }, divs));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenubuildings.js.map
