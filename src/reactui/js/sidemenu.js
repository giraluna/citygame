/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenu = React.createClass({
        render: function () {
            var buildings = [];

            for (var i = 0; i <= 20; i++) {
                var div = React.DOM.div({ key: "" + i, className: "grid-cell" }, "building" + i);
                buildings.push(div);
            }
            return (React.DOM.div({ id: "react-side-menu" }, React.DOM.div({ id: "side-menu-main-buttons", className: "grid-column" }, React.DOM.div({ className: "grid-row" }, React.DOM.div({ className: "grid-cell" }, "click"), React.DOM.div({ className: "grid-cell" }, "recruit")), React.DOM.div({ className: "grid-row" }, React.DOM.div({ className: "grid-cell" }, "buy plot"), React.DOM.div({ className: "grid-cell" }, "sell"))), React.DOM.div({ id: "side-menu-buildings", className: "grid-column" }, buildings), React.DOM.div({ id: "side-menu-other-buttons", className: "grid-column" }, React.DOM.div({ id: "save-buttons", className: "grid-row" }, React.DOM.div({ className: "grid-cell" }, "save"), React.DOM.div({ className: "grid-cell" }, "load")), React.DOM.form({ id: "size-menu-zoom", className: "grid-row" }, React.DOM.input({ type: "number", className: "grid-row", id: "zoom-amount", value: "1", step: 0.1 }), React.DOM.button({ id: "zoomBtn", className: "grid-row" }, "zoom"))), React.DOM.div({ id: "side-menu-stats" }, React.DOM.div({ id: "player-level-wrapper" }, React.DOM.progress({ id: "player-level", value: 69, max: 100 }), React.DOM.span(null, "Level 69     4,200,000 / 6,900,000 [ 69% ]")))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenu.js.map
