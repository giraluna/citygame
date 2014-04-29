// Using state for setting position = horrible performance
// manipulating style directly works much better
var UIComponents;
(function (UIComponents) {
    UIComponents.Draggable = {
        handleDragStart: function (e) {
            //this.DOMNode.classList.add("dragging");
            // browser overrides css cursor when dragging
            e.nativeEvent.dataTransfer.dropEffect = "move";

            this.offset = {
                x: e.nativeEvent.layerX,
                y: e.nativeEvent.layerY
            };
            this.DOMNode.style.zIndex = this.props.incrementZIndex();
        },
        handleDrag: function (e) {
            if (e.clientX === 0 && e.clientY === 0)
                return;

            this.DOMNode.style.left = (e.clientX - this.offset.x) + "px";
            this.DOMNode.style.top = (e.clientY - this.offset.y) + "px";
        },
        handleDragEnd: function (e) {
            //this.DOMNode.classList.remove("dragging");
        },
        componentDidMount: function () {
            this.DOMNode = this.getDOMNode();
        }
    };
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=draggable.js.map
