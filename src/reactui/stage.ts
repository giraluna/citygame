/// <reference path="../../lib/react.d.ts" />

module UIComponents
{

export var Stage = React.createClass(
{
  render: function()
  {
    var self = this;
    var popups = [];
    for (var _popup in this.props.popups)
    {
      var popup = this.props.popups[_popup];
      popups.push( UIComponents[popup.type].call(null, popup.props) );
    };
    return(
      React.DOM.div( {id:"react-wrapper"},
        React.DOM.div(
          {
            id:"react-popups",
            onDragEnter: function(e){e.preventDefault()},
            onDragOver: function(e){e.preventDefault()},
            onDrop: function(e){e.preventDefault()},
            onDragLeave: function(e){e.preventDefault()}
          }, 
          popups
        ),
        React.DOM.div( {id:"react-side-menu"} )
      )
    );
  }
});

}