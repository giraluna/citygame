/** @jsx React.DOM */
/*jshint ignore:start */

var UIComponents = UIComponents || {};

UIComponents.EmployeeList = React.createClass({
  render: function()
  {
    var rows = [];
    this.props.employees.forEach(function(employee)
    {
      rows.push(<UIComponents.Employee key={employee.id} employee={employee}/>);
    });
    return(
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
