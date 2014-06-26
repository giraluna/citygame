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
    var employee;
    for (var e in this.props.employees)
    {
      if (this.props.employees[e].active === true)
      {
        employee = this.props.employees[e];
        break;
      }
    }
    return(
    {
      selected: employee ?
      {
        key: employee.id,
        employee: employee
      } : null,
      action: this.props.action || null
    });
  },

  handleSelectRow: function(item)
  {
    var employee = item.data.employee;

    if (employee.active !== true) return;
    else
    {
      this.setState(
      {
        selected:
        {
          key: employee.id,
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
      onRowChange: this.handleSelectRow
    });

    var actionData = <any> {};

    if (selectedAction)
    {
      if (selectedEmployee && selectedEmployee.active === true)
      {
        var skills = this.props.relevantSkills.map(function(skill)
        {
          return selectedEmployee.skills[skill];
        });

        actionData.selectedEmployee = selectedEmployee;

        for (var prop in selectedAction.data)
        {
          var dataProp = selectedAction.data[prop];
          if (dataProp)
          {
            var toAssign: any = {};

            var value = actions.getActionCost(skills, dataProp.amount);

            if (dataProp.approximate === true)
            {
              toAssign.approximate = true;
              toAssign.amount = value.approximate;
            }
            else if (dataProp.approximate === false)
            {
              toAssign.approximate = false;
              toAssign.amount = value.actual;
            }
            else
            {
              toAssign = null;
            };
            actionData[prop] = toAssign;
          }
          else
          {
            actionData[prop] = null;
          };
        }
        

      }
    }
    var actionInfo = selectedAction ?
      UIComponents.ActionInfo({data: actionData, text: selectedAction.actionText}) :
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