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
    var skills =
    {
      neg: this.props.employee.skills["negotiation"],
      man: this.props.employee.skills["management"],
      rec: this.props.employee.skills["recruitment"],
      con: this.props.employee.skills["constuction"]
    }

    return(

      React.DOM.tr(this.props.rowProps, 
        React.DOM.td(null, name),

        React.DOM.td(null, skills["neg"]),
        React.DOM.td(null, skills["man"]),
        React.DOM.td(null, skills["rec"]),
        React.DOM.td(null, skills["con"])
      )
    );
  }
});

}
