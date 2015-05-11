/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="draggable.ts" />
/// <reference path="splitmultilinetext.ts" />

module UIComponents
{

export var ConfirmPopup = React.createClass({
  mixins: [Draggable, SplitMultilineText],

  handleClose: function()
  {
    this.props.onClose.call();
  },
  handleOk: function()
  {
    var callbackSuccessful =
      this.props.onOk.call();
    if (callbackSuccessful !== false)
    {
      this.handleClose();
    }
  },

  componentDidMount: function()
  {
    this.refs.okBtn.getDOMNode().focus();
  },

  render: function()
  {
    var self = this;
    var text = this.splitMultilineText(this.props.text) || null;

    var okBtn = React.DOM.button(
    {
      ref: "okBtn",
      onClick: this.handleOk,
      onTouchStart: this.handleOk,
      draggable: true,
      onDrag: function(e){e.stopPropagation();}
    }, this.props.okBtnText || "Confirm");

    var cancelBtn = React.DOM.button(
    {
      onClick: this.handleClose,
      onTouchStart: this.handleClose,
      draggable: true,
      onDrag: function(e){e.stopPropagation();}
    }, this.props.CloseBtnText || "Cancel");

    return(
      React.DOM.div( 
      {
        className:"popup",
        style: this.props.initialStyle,
        draggable: true,
        onDragStart: this.handleDragStart,
        onDrag: this.handleDrag,
        onDragEnd: this.handleDragEnd,
        onTouchStart: this.handleDragStart
      }, 
        React.DOM.p( {className:"popup-text"}, text ),
        React.DOM.div( {className:"popup-buttons"}, okBtn, cancelBtn)
      )
    );

  }

});

}