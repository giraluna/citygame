/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuTools = React.createClass({
        handleRecruit: function () {
            eventManager.dispatchEvent({
                type: "recruit",
                content: ""
            });
        },
        handleToolChange: function (type) {
            this.props.setSelectedTool(type);

            eventManager.dispatchEvent({
                type: "changeTool",
                content: type
            });
        },
        componentDidMount: function () {
            eventManager.addEventListener("buyHotkey", this.handleToolChange.bind(this, "buy"));
            eventManager.addEventListener("sellHotkey", this.handleToolChange.bind(this, "sell"));
            eventManager.addEventListener("clickHotkey", this.handleToolChange.bind(this, "click"));
            eventManager.addEventListener("recruitHotkey", this.handleRecruit);
        },
        render: function () {
            var props = {
                click: {
                    ref: "click",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "click"),
                    onTouchStart: this.handleToolChange.bind(null, "click")
                },
                buy: {
                    ref: "buy",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "buy"),
                    onTouchStart: this.handleToolChange.bind(null, "buy")
                },
                sell: {
                    ref: "sell",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "sell"),
                    onTouchStart: this.handleToolChange.bind(null, "sell")
                },
                recruit: {
                    ref: "recruit",
                    className: "grid-cell interactive",
                    onClick: this.handleRecruit,
                    onTouchStart: this.handleRecruit
                }
            };

            var selectedTool = this.props.selectedTool;
            if (Object.keys(this.props.player.employees).length < 1) {
                props.recruit.className += " new-modifier";

                props.buy.className = "grid-cell disabled";
                props.sell.className = "grid-cell disabled";
            } else if (selectedTool && props[selectedTool]) {
                props[selectedTool].className += " selected-tool";
            }

            return (React.DOM.div({ id: "side-menu-tools", className: "grid-column" }, React.DOM.div({ className: "grid-row" }, React.DOM.div(props.click, "click"), React.DOM.div(props.recruit, "recruit")), React.DOM.div({ className: "grid-row" }, React.DOM.div(props.buy, "buy plot"), React.DOM.div(props.sell, "sell"))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenutools.js.map
