/** @jsx React.DOM */
/*jshint ignore:start */


var ReactUI = ReactUI || {};
(function ()
{

  var EmployeeList = React.createClass({
    render: function()
    {
      var rows = [];
      this.props.employees.forEach(function(employee)
      {
        rows.push(<Employee key={employee.id} employee={employee}/>);
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
})();
