/** @jsx React.DOM */
/*jshint ignore:start */

var ReactUI = ReactUI || {};
(function ()
{
var Stage = React.createClass(
{
  getDefaultProps: function()
  {
    return
    {
      popupIdGenerator: 0
    }
  },

  newEmployeePopup: function(employees)
  {
    var el = <EmployeeList employees={employees}/>;
    var popup = <Popup content={el} key={this.props.popupIdGenerator++} />;
    this.props.popups.push(popup);
  },

  render: function()
  {
    var popups = [];
    var self = this;
    this.props.popups.forEach(function(popup)
    {
      popups.push(popup);
    });
    return(
      <div id="react-container">
        {popups}
      </div>
    );
  }
});



var EMPLOYEES =
[
  {
    id: "employee1",
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
    id: "employee2",
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

var popuplist =[];
var popupIdGenerator = 0;

function newPopup(_employees)
{
  var el = EmployeeList({employees: _employees});
  var popup = Popup (
    {
      content: el,
      key: popupIdGenerator++,

    });
  popuplist.push(popup);
  updateReact();
}

function destroyPopup(key)
{
  popuplist = popuplist.filter(function(popup)
  {
    return popup.props.key !== key;
  });

  updateReact();
}

function updateReact()
{
  React.renderComponent(
    <Stage popups={popuplist}/>,
    document.getElementById("pixi-container")
  );
}

document.getElementById("popupBtn").addEventListener('click',
  function()
  {
    newPopup(EMPLOYEES);
  });

updateReact();