/** @jsx React.DOM */
/*jshint ignore:start */

var Employee = React.createClass({
  getDefaultProps: function()
  {
    var defs =
    {
      name: "UNDEFINED",
      skills:
      {
        neg: -1,
        man: -1,
        rec: -1,
        con: -1
      }
    };

    return defs;
    
  },
  render: function()
  {
    var name = this.props.employee.name;
    var skills =
    {
      neg: this.props.employee.skills["neg"],
      man: this.props.employee.skills["man"],
      rec: this.props.employee.skills["rec"],
      con: this.props.employee.skills["con"]
    }

    return(
      <tr>
        <td>{name}</td>

        <td>{skills["neg"]}</td>
        <td>{skills["man"]}</td>
        <td>{skills["rec"]}</td>
        <td>{skills["con"]}</td>
      </tr>
    );
  }
});
