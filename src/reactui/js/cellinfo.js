/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.CellInfo = React.createClass({
        render: function () {
            return (React.DOM.div({ className: "cellinfo" }, React.DOM.span(null, this.props.cell.type), React.DOM.br(null), React.DOM.span(null, this.props.cell.landValue)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=cellinfo.js.map
