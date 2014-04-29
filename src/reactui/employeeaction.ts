/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/employee.d.ts" />
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/actioninfo.d.ts" />
/// 
/// <reference path="../js/actions.d.ts" />

module UIComponents
{
  /**
   * props:
   * employees: array
   * relevantSkills?: array
   * action?: any
   *
   * state:
   * selected employee: employee
   * action
   * {
   *   target
   *   base cost
   *   base duration
   * }
   *
   *
   * children:
   * el
   * {
   *   selected
   *   employees
   *   relevantskills
   *   handleselect
   * }
   */
export var EmployeeAction = React.createClass({

  getInitialState: function()
  {
    return(
    {
      selected: null,
      action: this.props.action || null
    });
  },

  handleSelectRow: function(key, employee)
  {
    if (employee.active !== true) return;
    else
    {
      this.setState(
      {
        selected:
        {
          key: key,
          employee: employee
        }
      });
    }
  },

  render: function()
  {
    var self = this;
    var selectedEmployee = 
      this.state.selected ? this.state.selected.employee : null;

    var selectedAction = this.state.action;

    var el = UIComponents.EmployeeList(
    {
      employees: this.props.employees,
      relevantSkills: this.props.relevantSkills,
      selected: this.state.selected,
      handleSelectRow: this.handleSelectRow
    });

    var data = <any> {};

    if (selectedAction)
    {
      var data: any = {};
        data.target = selectedAction.target;

      if (selectedEmployee)
      {
        var skills = this.props.relevantSkills.map(function(skill)
        {
          return selectedEmployee.skills[skill];
        });

        data.selectedEmployee = selectedEmployee;

        data.approxTime = selectedAction.baseDuration ? 
          actions.getActionTime(skills, selectedAction.baseDuration).approximate : null;
        data.approxCost = selectedAction.baseCost ? 
          actions.getActionCost(skills, selectedAction.baseCost).approximate : null;
      }
    }
    var actionInfo = selectedAction ?
      UIComponents.ActionInfo({data: data, text: selectedAction.actionText}) :
      null;

    return (
      React.DOM.div(null,
        el,
        actionInfo
      )
    );
  }
});

}