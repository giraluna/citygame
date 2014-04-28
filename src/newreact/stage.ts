/// <reference path="../../lib/react.d.ts" />

module UIComponents
{

export var Stage = React.createClass(
{
  render: function()
  {
    var popups = [];
    var self = this;
    this.props.popups.forEach(function(popup)
    {
      popups.push(popup);
    });
    return(
      React.DOM.div( {id:"react-stage"}, 
        popups
      )
    );
  }
});

}