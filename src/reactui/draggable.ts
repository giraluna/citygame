// Using state for setting position = horrible performance
// manipulating style directly works much better

module UIComponents
{

export var Draggable =
{
  handleDragStart: function(e)
  {
    this.DOMNode.style.zIndex = this.props.incrementZIndex();

    if (!e.nativeEvent.dataTransfer) return;
    //this.DOMNode.classList.add("dragging");
    // browser overrides css cursor when dragging
    e.nativeEvent.dataTransfer.dropEffect = "move";


    this.offset =
    {
      x: e.nativeEvent.pageX - parseInt(this.DOMNode.style.left),
      y: e.nativeEvent.pageY - parseInt(this.DOMNode.style.top)
    };
  },
  handleDrag: function(e)
  {
    if (e.clientX === 0 && e.clientY === 0) return;

    var x = e.clientX - this.offset.x;
    var y = e.clientY - this.offset.y;

    var domWidth = parseInt(this.DOMNode.offsetWidth);
    var domHeight = parseInt(this.DOMNode.offsetHeight);

    var pixiWidth = parseInt(this.pixiContainer.offsetWidth);
    var pixiHeight = parseInt(this.pixiContainer.offsetHeight);


    var x2 = x + domWidth;
    var y2 = y + domHeight;

    if (x < 0) x = 0;
    else if (x2 > pixiWidth)
    {
      x = pixiWidth - domWidth;
    };

    if (y < 0) y = 0;
    else if (y2 > pixiHeight)
    {
      y = pixiHeight - domHeight;
    };


    this.DOMNode.style.left = x+"px";
    this.DOMNode.style.top = y+"px";
  },
  handleDragEnd: function(e)
  {
    //this.DOMNode.classList.remove("dragging");
  },

  componentDidMount: function() {
    this.DOMNode = this.getDOMNode();
    this.pixiContainer = document.getElementById("pixi-container");
  }

};

}