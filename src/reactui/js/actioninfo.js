/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    * text
    * approx action time
    * approx cost
    *
    */
    UIComponents.ActionInfo = React.createClass({
        render: function () {
            return (React.DOM.div({ className: "action-info" }, React.DOM.span(null, this.props.text || null), React.DOM.br(null), React.DOM.span(null, this.props.data.approxTime + " days"), React.DOM.br(null), React.DOM.span(null, this.props.data.approxCost + "$")));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=actioninfo.js.map
