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
   * employees
   * relevantSkills
   * actionText
   * 
   *
   * state:
   * selected employee: Employee
   * action:
   * {
   *   target
   *   base action duration
   *   base action cost
   * }
   * }
   */
  
  /**
   * el
   * {
   *   selected employee
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
      action: this.props.action
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
      data.target = selectedAction.target;
    }

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
        actions.getActionTime(skills, selectedAction.baseCost).approximate : null;

    }

    var actionInfo = UIComponents.ActionInfo({data: data, text: this.props.actionText});

    return (
      React.DOM.div(null,
        el,
        actionInfo
      )
    );
  }
});

}