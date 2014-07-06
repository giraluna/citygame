/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    *   player
    *   buildableTypes
    */
    UIComponents.SideMenuBuildings = React.createClass({
        getInitialState: function () {
            return ({
                beautifyIndex: 0,
                lastSelectedBuilding: playerBuildableBuildings[0],
                currentPopOver: null
            });
        },
        drawPopOver: function (building, parentRef) {
            var popOverNode = this.refs.popOver.getDOMNode();

            popOverNode.classList.remove("hidden");

            popOverNode.style.top = this.refs[parentRef].getDOMNode().getBoundingClientRect().top + "px";
            console.log(popOverNode.style.top);
            this.setState({ currentPopOver: building.type });
        },
        hidePopOver: function () {
            if (!this.state.currentPopOver)
                return;

            this.refs.popOver.getDOMNode().classList.add("hidden");
            this.setState({ currentPopOver: null });
        },
        handleBuildingSelect: function (building, e) {
            if (this.props.player.money < this.props.player.getBuildCost(building)) {
                return;
            }
            this.props.setSelectedTool(building.type);
            this.setState({ lastSelectedBuilding: building });

            var continuous = e && e.shiftKey ? e.shiftKey : false;

            eventManager.dispatchEvent({
                type: "changeBuildingType",
                content: {
                    building: building,
                    continuous: continuous
                }
            });
        },
        componentDidMount: function () {
            eventManager.addEventListener("resizeSmaller", function (e) {
                this.setState({ beautifyIndex: 2 });
            }.bind(this));

            eventManager.addEventListener("resizeBigger", function (e) {
                this.setState({ beautifyIndex: 0 });
            }.bind(this));

            eventManager.addEventListener("buildHotkey", function (e) {
                this.handleBuildingSelect(this.state.lastSelectedBuilding, e.content);
            }.bind(this));
        },
        render: function () {
            var divs = [];
            var player = this.props.player;

            for (var i = 0; i < playerBuildableBuildings.length; i++) {
                var building = playerBuildableBuildings[i];

                var buildCost = player.getBuildCost(building);
                var canAfford = player.money >= buildCost;
                var amountBuilt = player.amountBuiltPerType[building.type];

                var divProps = {
                    className: "side-building",
                    key: building.type,
                    ref: building.type,
                    title: building.title + "\n" + "Base profit: $" + building.baseProfit + "/d",
                    onMouseLeave: this.hidePopOver
                };

                for (var polarity in building.effectTargets) {
                    var targets = building.effectTargets[polarity];
                    if (targets.length < 1)
                        continue;
                    else {
                        var poleSign = (polarity === "negative") ? "-" : "+";
                        divProps.title += "\n-----";
                        divProps.title += "\n" + polarity + " effects:";

                        for (var j = 0; j < targets.length; j++) {
                            divProps.title += "\n" + targets[j] + " " + poleSign;
                        }
                    }
                }

                var imageProps = { className: "building-image" };
                var titleProps = { className: "building-title" };
                var costProps = { className: "building-cost" };
                var amountProps = { className: "building-amount" };

                if (!canAfford) {
                    divProps.className += " disabled";
                    costProps.className += " insufficient";
                } else {
                    divProps.className += " interactive";
                    divProps.onClick = this.handleBuildingSelect.bind(null, building);
                    divProps.onTouchStart = this.handleBuildingSelect.bind(null, building);
                    divProps.onMouseEnter = this.drawPopOver.bind(null, building, divProps.ref);
                }

                if (this.props.selectedTool && this.props.selectedTool === building.type) {
                    divProps.className += " selected-tool";
                }

                var costText = "" + beautify(buildCost, this.state.beautifyIndex);

                if (this.state.beautifyIndex < 2) {
                    costText += "$";
                }

                var image = this.props.frameImages[building.icon];
                imageProps.src = image.src;

                var div = React.DOM.div(divProps, React.DOM.div({ className: "building-image-container" }, React.DOM.img(imageProps, null)), React.DOM.div({ className: "building-content" }, React.DOM.div({ className: "building-content-wrapper" }, React.DOM.div(titleProps, building.title), React.DOM.div(costProps, costText)), React.DOM.div(amountProps, amountBuilt)));

                divs.push(div);
            }

            return (React.DOM.div({ id: "side-menu-buildings", className: "grid-column" }, divs, React.DOM.div({
                id: "building-popover",
                className: "hidden",
                ref: "popOver"
            }, "asdjhksadhja")));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenubuildings.js.map
