/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />

module UIComponents
{

export var InfoPopup = React.createClass({
  mixins: [Draggable, SplitMultilineText],

  render: function()
  {
    var self = this;
    var text = this.splitMultilineText(this.props.text) || null;

    var okBtn = React.DOM.button(
    {
      onClick: this.props.onClose,
      onTouchStart: this.props.onClose,
      draggable: true,
      onDrag: function(e){e.stopPropagation();}
    }, this.props.okBtnText || "Ok");

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
        React.DOM.div( {className:"popup-buttons"}, okBtn )
      )
    );

  }

});

}