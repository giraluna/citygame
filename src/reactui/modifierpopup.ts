/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
/// <reference path="js/modifierlist.d.ts" />
/// 
/// <reference path="js/list.d.ts" />

module UIComponents
{

  export var ModifierPopup = React.createClass({
    mixins: [Draggable, SplitMultilineText],

    handleClose: function()
    {
      this.props.onClose.call();
    },

    handleOk: function()
    {
      var selected = this.refs.modifierList.refs.list.state.selected;
      
      if (!selected)
      {
        if (this.props.modifierList.length < 1)
        {
          this.handleClose();
        }
        else return false;
      }

      var closeAfter = this.props.onOk.call(null, selected);

      if (closeAfter === true)
      {
        this.handleClose();
      }
      else
      {
        this.refs.modifierList.refs.list.shiftSelection(1);
      }
    },

    applyRowStyle: function(item, rowProps)
    {
      if (item.data.modifier.cost > this.props.player.money)
      {
        rowProps.className = "inactive";
        rowProps.onClick = rowProps.onTouchStart = null;
      }
      return rowProps;
    },

    render: function()
    {
      var stopBubble = function(e){e.stopPropagation();};

      var okBtn = React.DOM.button(
      {
        ref: "okBtn",
        onClick: this.handleOk,
        onTouchStart: this.handleOk,
        draggable: true,
        onDrag: stopBubble
      }, this.props.okBtnText || "Buy");

      var closeBtn = React.DOM.button(
      {
        onClick: this.handleClose,
        onTouchStart: this.handleClose,
        draggable: true,
        onDrag: stopBubble
      }, this.props.closeBtnText || "Close");


      var text = this.splitMultilineText(this.props.text) || null;

      return(

        React.DOM.div(
        {
          className:"popup",
          style: this.props.initialStyle,
          draggable: true,
          onDragStart: this.handleDragStart,
          onDrag: this.handleDrag,
          onDragEnd: this.handleDragEnd,
          onTouchStart: this.handleDragStart,
        },
          React.DOM.p( {className:"popup-text"}, text),
          React.DOM.div( {className:"popup-content",
              draggable: true, onDrag: stopBubble},
            UIComponents.ModifierList(
            {
              ref: "modifierList",
              rowStylingFN: this.applyRowStyle,
              modifiers: this.props.modifierList,
              excludeCost: this.props.excludeCost || false
            })
          ),
          React.DOM.div( {className:"popup-buttons"},
            okBtn,
            closeBtn
          )
          
        )
      );

    }
  });
}