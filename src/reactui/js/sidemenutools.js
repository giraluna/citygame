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
            this.refs[type].getDOMNode().classList.add("selected-tool");
            eventManager.dispatchEvent({
                type: "changeTool",
                content: type
            });
        },
        render: function () {
            return (React.DOM.div({ id: "side-menu-tools", className: "grid-column" }, React.DOM.div({ className: "grid-row" }, React.DOM.div({
                className: "grid-cell interactive"
            }, "click"), React.DOM.div({
                ref: "recruit",
                className: "grid-cell interactive",
                onClick: this.handleRecruit
            }, "recruit")), React.DOM.div({ className: "grid-row" }, React.DOM.div({
                ref: "buy",
                className: "grid-cell interactive",
                onClick: this.handleToolChange.bind(null, "buy")
            }, "buy plot"), React.DOM.div({
                ref: "remove",
                className: "grid-cell interactive",
                onClick: this.handleToolChange.bind(null, "remove")
            }, "remove"))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenutools.js.map
