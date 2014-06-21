/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.ModifierPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleClose: function () {
            this.props.onClose.call();
        },
        render: function () {
            var stopBubble = function (e) {
                e.stopPropagation();
            };
            var closeBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Cancel");

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.div({ className: "popup-content", draggable: true, onDrag: stopBubble }, UIComponents.List({
                // TODO fix declaration file and remove
                // typescript qq without these
                selected: null,
                columns: null,
                sortBy: null,
                initialColumn: columns[2],
                ref: "availableModifiers",
                listItems: availableModifiers,
                initialColumns: availableColumns
            })), React.DOM.div({ className: "popup-buttons" }, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=modifierpopup.js.map
