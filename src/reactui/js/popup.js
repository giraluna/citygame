/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Popup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        render: function () {
            var text = this.splitMultilineText(this.props.text);

            return (React.DOM.div({ className: "popup", style: this.props.initialStyle }, React.DOM.p({ className: "popup-text" }, text), this.props.content, React.DOM.div({ className: "popup-buttons" }, this.props.buttons)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=popup.js.map
