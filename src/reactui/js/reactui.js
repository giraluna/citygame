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
        this.topZIndex = 0;
        this.init();
    }
    ReactUI.prototype.init = function () {
        this.updateReact();
    };

    ReactUI.prototype.makeCellBuyPopup = function (player, cell) {
        var activeEmployees = player.getActiveEmployees();

        var content = React.DOM.div(null, UIComponents.EmployeeList({ employees: activeEmployees }), UIComponents.CellInfo({ cell: cell }));

        var popup = UIComponents.Popup({
            content: content,
            okText: "ok",
            closeText: "close",
            key: this.idGenerator++
        });

        this.popups.push(popup);
    };

    ReactUI.prototype.newPopup = function (_employees) {
        var el = UIComponents.EmployeeList({ employees: _employees });
        var popup = UIComponents.Popup({
            content: el,
            key: this.idGenerator++
        });
        this.popups.push(popup);
        this.updateReact();
    };

    ReactUI.prototype.destroyPopup = function (key) {
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

function ABA() {
    var abaa = new ReactUI();
    game.players.player0.addEmployee(new Employee("lolol", TEMPNAMES, { skillLevel: 1, growthLevel: 1 }));

    abaa.newPopup(game.players.player0.employees);
}
//# sourceMappingURL=reactui.js.map
