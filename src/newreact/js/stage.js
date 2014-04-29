/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Stage = React.createClass({
        render: function () {
            var self = this;
            var popups = [];
            for (var _popup in this.props.popups) {
                var popup = this.props.popups[_popup];
                popups.push(UIComponents[popup.type].call(null, popup.props));
            }
            ;
            return (React.DOM.div({ id: "react-stage" }, popups));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=stage.js.map
