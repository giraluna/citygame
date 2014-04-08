/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Popup = React.createClass({
        mixins: [UIComponents.Draggable],
        render: function () {
            return (React.DOM.div({ className: "popup" }, this.props.content, React.DOM.div({ className: "popup-buttons" }, React.DOM.button({ onClick: this.props.handleOk }, this.props.okText), React.DOM.button({ onClick: this.props.handleClose }, this.props.closeText))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=popup.js.map
