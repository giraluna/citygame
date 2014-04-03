/** @jsx React.DOM */
/*jshint ignore:start */

var Stage = React.createClass(
{

  render: function()
  {
    var el = <EmployeeList employees={EMPLOYEES}/>
    return(
      <div id="react-container">
        <Popup content={el} />
      </div>
    );
  }
});



var EMPLOYEES =
[
  {
    name: "UNDEFINED",
    skills:
    {
      neg: -1,
      man: -1,
      rec: -1,
      con: -1
    }
  },
  {
    name: "UNDEFINED",
    skills:
    {
      neg: -1,
      man: -1,
      rec: -1,
      con: -1
    }
  }
];

console.log(EMPLOYEES);

React.renderComponent(
  Stage({}),
  document.getElementById("pixi-container")
);