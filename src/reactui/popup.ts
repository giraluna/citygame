/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="js/draggable.d.ts" />
 
module UIComponents
{

export var Popup = React.createClass({
  mixins: [Draggable],
  handleClose: function()
  {
    //destroyPopup(this.props.key);
  },
  handleOk: function()
  {

  },
  render: function()
  {
    return(
      React.DOM.div( {className:"popup"}, 
        this.props.content,
        React.DOM.div( {className:"popup-buttons"}, 
          React.DOM.button( {onClick:this.handleOk}, this.props.okText),
          React.DOM.button( {onClick:this.close}, this.props.closeText)
        )
      )
    );
  }
});

}