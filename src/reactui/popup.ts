/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="js/draggable.d.ts" />
 
module UIComponents
{

export var Popup = React.createClass({
  mixins: [Draggable],
  render: function()
  {
    return(
      React.DOM.div( {className:"popup"}, 
        React.DOM.span( {className:"popup-text"}, this.props.text ),
        this.props.content,
        React.DOM.div( {className:"popup-buttons"}, 
          this.props.buttons
        )
      )
    );
  }
});

}