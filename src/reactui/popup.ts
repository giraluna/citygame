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
        this.props.content,
        React.DOM.div( {className:"popup-buttons"}, 
          React.DOM.button( {onClick:this.props.handleOk}, this.props.okText),
          React.DOM.button( {onClick:this.props.handleClose}, this.props.closeText)
        )
      )
    );
  }
});

}