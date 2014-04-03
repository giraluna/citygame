/** @jsx React.DOM */
/*jshint ignore:start */

var EmployeeList = React.createClass({
  render: function()
  {
    var rows = [];
    console.log(this);
    this.props.employees.forEach(function(employee)
    {
      rows.push(<Employee employee={employee}/>);
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
