/// <reference path="../../lib/react.d.ts" />

module UIComponents
{

export var Employee = React.createClass({
  getDefaultProps: function()
  {
    var defs =
    {
      employee:
      {
        name: "UNDEFINED",
        skills:
        {
          "neg": 0,
          "man": 0,
          "rec": 0,
          "con": 0
        }
      }
    };

    return defs;
  },


  render: function()
  {
    var name = this.props.employee.name;
    var skillCells = [];

    for (var skill in this.props.employee.skills)
    {
      var colProps = {};
      if (this.props.relevantSkills.indexOf(skill) > -1)
      {
        colProps["className"] = "relevant-cell"
      };

      skillCells.push(
        React.DOM.td(colProps, this.props.employee.skills[skill])
      );
    }

    return(

      React.DOM.tr(this.props.rowProps, 
        React.DOM.td({className: "employee-name"}, name),

        skillCells
      )
    );
  }
});

}
