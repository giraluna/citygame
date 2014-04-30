/// <reference path="../../lib/react.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
///
/// <reference path="js/employeeaction.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    *
    * props:
    *
    * employees || player
    * text?
    * initialstyle?
    *
    * onOk
    * okBtnText
    * onClose
    * closeBtnText
    * employeeactionprops:
    * {
    *   relevantSkills?
    *   action?
    * }
    *
    * incrementZIndex: function
    *
    **/
    UIComponents.EmployeeActionPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleOk: function (e) {
            var selected = this.refs.employeeAction.state.selected;
            if (!selected || !selected.employee.active) {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup", content: { text: "No employee selected" }
                });
                return false;
            }

            var callbackSuccessful = this.props.onOk.call(null, selected);
            if (callbackSuccessful !== false) {
                this.handleClose();
            }
        },
        handleClose: function () {
            this.props.onClose.call();
        },
        getInitialState: function () {
            return {
                employees: this.props.employees || this.props.player.employees,
                style: this.props.initialStyle
            };
        },
        componentWillRecieveProps: function (newProps) {
            this.setState({ employees: newProps.employees || newProps.player.employees });
        },
        render: function () {
            var self = this;

            var text = this.splitMultilineText(this.props.text) || null;
            var employees = this.state.employees;

            var employeeActionProps = {
                ref: "employeeAction",
                employees: employees,
                relevantSkills: this.props.relevantSkills,
                action: this.props.action,
                selected: null
            };
            var stopBubble = function (e) {
                e.stopPropagation();
            };

            var okBtn = React.DOM.button({
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: stopBubble
            }, this.props.okBtnText || "Ok");

            var closeBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Cancel");

            return (React.DOM.div({
                className: "popup",
                style: this.state.style,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd
            }, React.DOM.p({ className: "popup-text" }, text), React.DOM.div({ className: "popup-content", draggable: true, onDrag: stopBubble }, UIComponents.EmployeeAction(employeeActionProps)), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=employeeactionpopup.js.map
