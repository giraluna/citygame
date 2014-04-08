/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Stage = React.createClass({
        render: function () {
            var popups = [];
            var self = this;
            this.props.popups.forEach(function (popup) {
                popups.push(popup);
            });
            return (React.DOM.div({ id: "react-stage" }, popups));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=stage.js.map
