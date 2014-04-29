/// <reference path="../../lib/react.d.ts" />
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
        handleOk: function () {
            var callbackSuccessful = this.props.onOk.call(null, this.refs.employeeAction.state.selected);
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
                style: this.props.initialStyle,
                pos: { left: this.props.initialStyle.left, top: this.props.initialStyle.top },
                ZIndex: this.props.initialStyle.ZIndex
            };
        },
        componentWillRecieveProps: function (newProps) {
            console.log(newProps.player);
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

            var okBtn = React.DOM.button({
                onClick: this.handleOk
            }, this.props.okBtnText || "Ok");

            var closeBtn = React.DOM.button({
                onClick: this.handleClose
            }, this.props.closeBtnText || "Cancel");

            return (React.DOM.div({
                className: "popup",
                style: this.state.style,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag
            }, React.DOM.p({ className: "popup-text" }, text), React.DOM.div({ className: "popup-content" }, UIComponents.EmployeeAction(employeeActionProps)), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=employeeactionpopup.js.map
