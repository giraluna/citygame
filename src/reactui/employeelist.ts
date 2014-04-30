/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/employee.d.ts" />

module UIComponents
{
  
export var EmployeeList = React.createClass({

  render: function()
  {
    var self = this;
    var rows = [];
    var skillColumns = [];

    Object.keys(this.props.employees)
    for (var skill in this.props.employees[ Object.keys(this.props.employees)[0] ])
    {
      var colProps = {};

      if (this.props.relevantSkills && this.props.relevantSkills.length > 0)
      {
        if (this.props.relevantSkills.indexOf(skill) > -1)
        {
          colProps["className"] = "relevant-col";
        }
      };

      skillColumns.push(
        React.DOM.col(colProps)
      );
    }
    for (var _e in this.props.employees)
    {
      var employee = this.props.employees[_e];
      var key = employee.id;

      var employeeProps: any =
      {
        key: key,
        employee: employee,
        relevantSkills: self.props.relevantSkills,
        rowProps:
        {
          className: "employee active"
        }
      };

      if (self.props.handleSelectRow)
      {
        employeeProps.rowProps.onClick = employeeProps.rowProps.onTouchStart =
          self.props.handleSelectRow.bind(null, key, employee);
      }

      if (employee.active === false)
      {
        employeeProps.rowProps["className"] = "employee inactive";
      }

      else if (self.props.selected && self.props.selected.key === key)
      {
        employeeProps.rowProps["className"] = "employee selected";
      };


      var row = UIComponents.Employee(employeeProps);

      rows.push(row);
    };
    
    return(
      React.DOM.table({className: "employee-list"},
        React.DOM.colgroup(null,
          React.DOM.col(null),
          skillColumns
          ),
        React.DOM.thead(null, 
          React.DOM.tr(null, 
            React.DOM.th(null, "Name"),
            React.DOM.th({title: "Negotiation"}, "neg"),
            React.DOM.th({title: "Management"}, "mgt"),
            React.DOM.th({title: "Recruitment"}, "rec"),
            React.DOM.th({title: "Construction"}, "con")
          )
        ),
        React.DOM.tbody(null, 
          rows
        )
      )
    );
  }
});

}