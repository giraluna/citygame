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
      neg: this.props.employee.skills["neg"],
      man: this.props.employee.skills["man"],
      rec: this.props.employee.skills["rec"],
      con: this.props.employee.skills["con"]
    }

    return(

      React.DOM.tr(null, 
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

var aba = game.players.player0;
var abaaa = new ReactUI();
aba.addEmployee(new Employee("lolol", TEMPNAMES, {skillLevel: 1, growthLevel: 1}));
abaaa.newPopup(aba.employees);