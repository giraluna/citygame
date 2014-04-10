/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/employee.d.ts" />

module UIComponents
{
  
export var EmployeeList = React.createClass({

  getInitialState: function()
  {
    return(
    {
      selected: null,
      filterInactive: true
    });
  },

  handleSelectRow: function(key)
  {
    this.setState(
    {
      selected: key
    });
  },

  render: function()
  {
    var self = this;
    var rows = [];

    this.props.employees.forEach(function(employee)
    {
      var key = employee.id;
      var boundSelect = self.handleSelectRow.bind(self, key);

      var employeeProps =
      {
        key: key,
        employee: employee,
        rowProps:
        {
          onClick: boundSelect
        }
      };

      if (self.state.selected === key)
      {
        employeeProps.rowProps["style"] =
        {
          "backgroundColor": "rgb(88, 121, 130)"
        }
      };

      var row = UIComponents.Employee(employeeProps);

      rows.push(row);
    });
    return(
      React.DOM.table(null,
        React.DOM.thead(null, 
          React.DOM.tr(null, 
            React.DOM.th(null, "Name"),
            React.DOM.th(null, "neg"),
            React.DOM.th(null, "mgt"),
            React.DOM.th(null, "rec"),
            React.DOM.th(null, "con")
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