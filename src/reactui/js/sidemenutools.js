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
        handleToolChange: function (type, e) {
            this.props.setSelectedTool(type);

            var continuous = false;

            if (type !== "click" && e && e.shiftKey)
                continuous = true;

            eventManager.dispatchEvent({
                type: "changeTool",
                content: {
                    type: type,
                    continuous: continuous
                }
            });
        },
        componentDidMount: function () {
            eventManager.addEventListener("buyHotkey", function (e) {
                ;
                this.handleToolChange("buy", e.content);
            }.bind(this));

            eventManager.addEventListener("sellHotkey", function (e) {
                this.handleToolChange("sell", e.content);
            }.bind(this));

            eventManager.addEventListener("clickHotkey", function (e) {
                this.handleToolChange("click", e.content);
            }.bind(this));

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

                props.click.className = "grid-cell disabled";
                props.buy.className = "grid-cell disabled";
                props.sell.className = "grid-cell disabled";
            } else if (this.props.player.clicks <= 0) {
                props.buy.className = "grid-cell disabled";
                props.sell.className = "grid-cell disabled";
            } else if (selectedTool && props[selectedTool]) {
                props[selectedTool].className += " selected-tool";
            }

            return (React.DOM.div({ id: "side-menu-tools", className: "grid-column" }, React.DOM.div({ className: "grid-row" }, React.DOM.div(props.click, React.DOM.u(null, "c"), "lick"), React.DOM.div(props.recruit, React.DOM.u(null, "r"), "ecruit")), React.DOM.div({ className: "grid-row" }, React.DOM.div(props.buy, "b", React.DOM.u(null, "u"), "y plot"), React.DOM.div(props.sell, React.DOM.u(null, "s"), "ell"))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenutools.js.map
