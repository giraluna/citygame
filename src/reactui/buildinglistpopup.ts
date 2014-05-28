/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
/// <reference path="js/buildinglist.d.ts" />
/// 
/// <reference path="js/employeeaction.d.ts" />

module UIComponents
{

  /**
   * props:
   * player
   * buildingTemplates
   * buildingImages
   */
  export var BuildingListPopup = React.createClass(
  {
    mixins: [Draggable, SplitMultilineText],

    getInitialState: function()
    {
      return {
        player: this.props.player,
        style: this.props.initialStyle
      };
    },

    componentWillRecieveProps: function(newProps)
    {
      this.setState({player: newProps.player});
    },

    componentDidMount: function()
    {
      this.refs.okBtn.getDOMNode().focus();
    },

    handleOk: function(e)
    {
      var selectedTemplate = this.refs.buildingList.state.selected;
      var selected = selectedTemplate ? this.props.buildingTemplates[selectedTemplate] : null;
      if (!selected || this.props.player.money < selected.cost)
      {
        eventManager.dispatchEvent({
          type: "makeInfoPopup", content:{text: "No building selected"}
        });
        return false;
      }

      var callbackSuccessful =
        this.props.onOk.call(null, selected);
      if (callbackSuccessful !== false)
      {
        this.handleClose();
      }
    },
    handleClose: function()
    {
      this.props.onClose.call();
    },

    render: function()
    {
      var self = this;

      var text = this.splitMultilineText(this.props.text) || null;

      var buildingListProps =
      {
        ref               : "buildingList",
        buildingTemplates : this.props.buildingTemplates,
        buildingImages    : this.props.buildingImages,
        player            : this.state.player,
        cell              : this.props.cell,

        selected: null
      }
      var stopBubble = function(e){e.stopPropagation();};

      var okBtn = React.DOM.button(
      {
        ref: "okBtn",
        onClick: this.handleOk,
        onTouchStart: this.handleOk,
        draggable: true,
        onDrag: stopBubble
      }, this.props.okBtnText || "Build");

      var closeBtn = React.DOM.button(
      {
        onClick: this.handleClose,
        onTouchStart: this.handleClose,
        draggable: true,
        onDrag: stopBubble
      }, this.props.closeBtnText || "Cancel");


      return(
        React.DOM.div( 
          {
            className: "popup",
            style: this.props.initialStyle,
            draggable: true,
            onDragStart: this.handleDragStart,
            onDrag: this.handleDrag,
            onDragEnd: this.handleDragEnd,
            onTouchStart: this.handleDragStart
          }, 
          React.DOM.p( {className:"popup-text"}, text ),
          React.DOM.div( {className:"popup-content", draggable: true, onDrag: stopBubble},
            UIComponents.BuildingList(buildingListProps)
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