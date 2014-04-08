/// <reference path="../../lib/react.d.ts" />
/// <reference path="../js/player.d.ts" />
///
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/cellinfo.d.ts" />
/// <reference path="js/popup.d.ts" />
/// <reference path="js/stage.d.ts" />
var ReactUI = (function () {
    function ReactUI() {
        this.idGenerator = 0;
        this.popups = [];
        this.topZIndex = 15;
        this.init();
    }
    ReactUI.prototype.init = function () {
        this.updateReact();
    };

    ReactUI.prototype.makeCellBuyPopup = function (player, cell) {
        var self = this;

        var activeEmployees = player.getActiveEmployees();
        var key = this.idGenerator++;

        var content = React.DOM.div({ className: "popup-content" }, UIComponents.EmployeeList({ employees: activeEmployees }), UIComponents.CellInfo({ cell: cell }));

        var boundDestroyPopup = this.destroyPopup.bind(this, key);
        var boundIncrementZIndex = this.incrementZIndex.bind(this);

        var popup = UIComponents.Popup({
            content: content,
            okText: "ok",
            closeText: "close",
            key: key,
            handleOk: boundDestroyPopup,
            handleClose: boundDestroyPopup,
            incrementZIndex: boundIncrementZIndex
        });

        this.popups.push(popup);
        this.updateReact();
    };

    ReactUI.prototype.incrementZIndex = function () {
        return this.topZIndex++;
    };

    ReactUI.prototype.destroyPopup = function (key) {
        console.log(this);
        this.popups = this.popups.filter(function (popup) {
            return popup.props.key !== key;
        });

        this.updateReact();
    };

    ReactUI.prototype.updateReact = function () {
        React.renderComponent(UIComponents.Stage({ popups: this.popups }), document.getElementById("react-container"));
    };
    return ReactUI;
})();
//# sourceMappingURL=reactui.js.map
