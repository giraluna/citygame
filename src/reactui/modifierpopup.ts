/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
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

    render: function()
    {
      var stopBubble = function(e){e.stopPropagation();};
      var closeBtn = React.DOM.button(
      {
        onClick: this.handleClose,
        onTouchStart: this.handleClose,
        draggable: true,
        onDrag: stopBubble
      }, this.props.closeBtnText || "Cancel");

      var rows = [];
      for (var i = 0; i < this.props.player.unlockedModifiers.length; i++)
      {
        var modifier = this.props.player.unlockedModifiers[i];
        rows.push(
        {
          key: modifier.type,
          data:
          {
            title: modifier.title,
            cost: beautify(modifier.cost) + "$",
            description: modifier.description
          }
        });
      }
      var columns =
      [
        {
          label: "Title",
          key: "title"
        },
        {
          label: "Cost",
          key: "cost"
        },
        {
          label: "Description",
          key: "description",
          notSortable: true
        }
      ];

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
          React.DOM.div( {className:"popup-content", draggable: true, onDrag: stopBubble},
            UIComponents.List(
            {
              // TODO fix declaration file and remove
              // typescript qq without these
              selected: null,
              columns: null,
              sortBy: null,
              initialColumn: columns[1],
              ref: "availableModifiers",

              listItems: rows,
              initialColumns: columns
            })
          ),
          React.DOM.div( {className:"popup-buttons"},
            closeBtn
          )
          
        )
      );

    }
  });
}