// Using state for setting position = horrible performance
// manipulating style directly works much better

module UIComponents
{

export var Draggable =
{
  handleDragStart: function(e)
  {
    this.offset =
    {
      x: e.nativeEvent.layerX,
      y: e.nativeEvent.layerY
    };
    this.DOMNode.style.zIndex = this.props.incrementZIndex();
  },
  handleDrag: function(e)
  {

    if (e.clientX === 0 && e.clientY === 0) return;

    this.DOMNode.style.left = (e.clientX - this.offset.x)+"px";
    this.DOMNode.style.top = (e.clientY - this.offset.y)+"px";
  },
  handleDragEnd: function(e)
  {
    
  },

  componentDidMount: function() {
    this.DOMNode = this.getDOMNode();
  }

};

}