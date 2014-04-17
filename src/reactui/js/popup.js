/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Popup = React.createClass({
        mixins: [UIComponents.Draggable],
        componentDidMount: function () {
            var DOMNode = this.props.DOMNode;

            DOMNode.style.top -= DOMNode.offsetHeight / 2;
            DOMNode.style.left -= DOMNode.offsetWidth / 2;
            console.log("1");
        },
        render: function () {
            var text;
            if (Array.isArray(this.props.text)) {
                text = [];
                for (var i = 0; i < this.props.text.length; i++) {
                    text.push(this.props.text[i]);
                    text.push(React.DOM.br(null));
                }
            } else {
                text = this.props.text;
            }
            console.log("2");
            return (React.DOM.div({ className: "popup", style: this.props.initialStyle }, React.DOM.p({ className: "popup-text" }, text), this.props.content, React.DOM.div({ className: "popup-buttons" }, this.props.buttons)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=popup.js.map
