/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.InputPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleClose: function () {
            this.props.onClose.call();
        },
        handleOk: function () {
            var callbackSuccessful = this.props.onOk.call(null, this.refs.inputElement.getDOMNode().value);
            if (callbackSuccessful !== false) {
                this.handleClose();
            }
        },
        componentDidMount: function () {
            this.refs.inputElement.getDOMNode().focus();
        },
        render: function () {
            var self = this;
            var text = this.splitMultilineText(this.props.text) || null;

            var inputElement = React.DOM.input({
                ref: "inputElement",
                type: "text"
            });

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: function (e) {
                    e.stopPropagation();
                }
            }, this.props.okBtnText || "Confirm");

            var cancelBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: function (e) {
                    e.stopPropagation();
                }
            }, this.props.CloseBtnText || "Cancel");

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.p({ className: "popup-text" }, text), inputElement, React.DOM.div({ className: "popup-buttons" }, okBtn, cancelBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=inputpopup.js.map
