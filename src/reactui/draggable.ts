/*global React: false*/
"use strict";

module UIComponents
{

export var Draggable =
{
  handleDragStart: function(e)
  {
    //e.dataTransfer.setData("text/plain", "stupid firefox");
    this.props.offset =
    {
      x: e.layerX,
      y: e.layerY
    };
    this.props.DOMNode.style.zIndex = this.props.incrementZIndex();
  },
  handleDrag: function(e)
  {
    //e.dataTransfer.setData("text/plain", "stupid firefox");

    if (e.x === 0 && e.y === 0) return;

    this.props.DOMNode.style.left = (e.x - this.props.offset.x)+"px";
    this.props.DOMNode.style.top = (e.y - this.props.offset.y)+"px";
  },
  handleDragEnd: function(e)
  {
    //e.dataTransfer.setData("text/plain", "stupid firefox");
    
  },

  componentDidMount: function() {
    var DOMNode = this.props.DOMNode = this.getDOMNode();

    DOMNode.addEventListener("dragstart", this.handleDragStart, false);
    DOMNode.addEventListener("drag", this.handleDrag, false);
    DOMNode.addEventListener("dragend", this.handleDragEnd, false);

    DOMNode.draggable = true;
    DOMNode.style.position = "absolute";
  },

  componentWillUnmount: function() {
    this.props.DOMNode.removeEventListener("dragstart", this.handleDragStart);
    this.props.DOMNode.removeEventListener("drag", this.handleDrag);
    this.props.DOMNode.removeEventListener("dragend", this.handleDragEnd);
  },

};

}