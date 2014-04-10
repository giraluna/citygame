/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Popup = React.createClass({
        mixins: [UIComponents.Draggable],
        render: function () {
            return (React.DOM.div({ className: "popup" }, React.DOM.span({ className: "popup-text" }, this.props.popupText), this.props.content, React.DOM.div({ className: "popup-buttons" }, this.props.buttons)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=popup.js.map
