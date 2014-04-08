/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Popup = React.createClass({
        mixins: [UIComponents.Draggable],
        handleClose: function () {
            //destroyPopup(this.props.key);
        },
        handleOk: function () {
        },
        render: function () {
            return (React.DOM.div({ className: "popup" }, this.props.content, React.DOM.div({ className: "popup-buttons" }, React.DOM.button({ onClick: this.handleOk }, this.props.okText), React.DOM.button({ onClick: this.close }, this.props.closeText))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=popup.js.map
