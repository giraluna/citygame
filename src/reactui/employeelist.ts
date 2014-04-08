/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/employee.d.ts" />

module UIComponents
{
  
export var EmployeeList = React.createClass({

  render: function()
  {
    var rows = [];
    this.props.employees.forEach(function(employee)
    {
      rows.push(UIComponents.Employee(
        {
          key: employee.id,
          employee: employee
        } ));
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