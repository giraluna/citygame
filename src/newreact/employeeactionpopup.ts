/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
/// 
/// <reference path="js/employeeaction.d.ts" />
 
module UIComponents
{

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
export var EmployeeActionPopup = React.createClass({
  mixins: [Draggable, SplitMultilineText],

  handleOk: function()
  {
    this.props.onOk.call(this.refs.employeeAction.state.selected);
    this.handleClose();
  },
  handleClose: function()
  {
    this.props.onClose.call();
  },

  render: function()
  {
    var self = this;

    var text = this.splitMultilineText(this.props.text) || null;
    var employees = this.props.employees || this.player.getEmployees();

    var employeeActionProps =
    {
      ref            : "employeeAction",
      employees      : employees,
      relevantSkills : this.props.relevantSkills,
      action         : this.props.action,

      selected: null
    }

    var okBtn = React.DOM.button(
    {
      onClick: this.handleOk
    }, this.props.okBtnText || "Ok");

    var closeBtn = React.DOM.button(
    {
      onClick: this.handleClose
    }, this.props.closeBtnText || "Cancel");

    return(
      React.DOM.div( {className:"popup", style: this.props.initialStyle}, 
        React.DOM.p( {className:"popup-text"}, text ),
        React.DOM.div( {className:"popup-content"},
          UIComponents.EmployeeAction(employeeActionProps)
        ),
        React.DOM.div( {className:"popup-buttons"}, 
          okBtn,
          closeBtn
        )
      )
    );
  }
});

}