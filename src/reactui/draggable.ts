/*global React: false*/
"use strict";

module UIComponents
{

export var Draggable =
{
  handleDragStart: function(e)
  {

    this.props.offset =
    {
      x: e.layerX,
      y: e.layerY
    };
    this.props.DOMNode.style["z-index"] = this.props.incrementZIndex();
  },
  handleDrag: function(e)
  {
    if (e.x === 0 && e.y === 0) return;

    this.props.DOMNode.style.left = (e.x - this.props.offset.x) + "px";
    this.props.DOMNode.style.top = (e.y - this.props.offset.y) + "px";
  },
  handleDragEnd: function(e)
  {
    
  },

  componentDidMount: function() {
    var DOMNode = this.props.DOMNode = this.getDOMNode();

    DOMNode.addEventListener("dragstart", this.handleDragStart);
    DOMNode.addEventListener("drag", this.handleDrag);
    DOMNode.addEventListener("dragend", this.handleDragEnd);

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