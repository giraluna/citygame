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
        render: function () {
            var props = {
                click: {
                    ref: "click",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "click")
                },
                buy: {
                    ref: "buy",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "buy")
                },
                sell: {
                    ref: "sell",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "sell")
                }
            };

            var selectedTool = this.props.selectedTool;
            if (selectedTool && this.refs[selectedTool]) {
                props[selectedTool].className += " selected-tool";
            }

            return (React.DOM.div({ id: "side-menu-tools", className: "grid-column" }, React.DOM.div({ className: "grid-row" }, React.DOM.div(props.click, "click"), React.DOM.div({
                ref: "recruit",
                className: "grid-cell interactive",
                onClick: this.handleRecruit
            }, "recruit")), React.DOM.div({ className: "grid-row" }, React.DOM.div(props.buy, "buy plot"), React.DOM.div(props.sell, "sell"))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenutools.js.map
