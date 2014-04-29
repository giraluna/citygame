/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
///
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/actions.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/employeeaction.d.ts" />
/// <reference path="js/employeeactionpopup.d.ts" />
/// <reference path="js/actioninfo.d.ts" />
/// <reference path="js/stage.d.ts" />
var ReactUI = (function () {
    function ReactUI(player) {
        this.idGenerator = 0;
        this.popups = {};
        this.topZIndex = 15;
        this.player = player;
        this.init();
    }
    ReactUI.prototype.init = function () {
        this.addEventListeners();
        this.updateReact();
    };
    ReactUI.prototype.addEventListeners = function () {
        var self = this;

        eventManager.addEventListener("makeEmployeeActionPopup", function (event) {
            self.makeEmployeeActionPopup(event.content);
        });
        eventManager.addEventListener("makeRecruitPopup", function (event) {
            self.makeRecruitPopup(event.content);
        });
        eventManager.addEventListener("makeRecruitCompletePopup", function (event) {
            self.makeRecruitCompletePopup(event.content);
        });
        eventManager.addEventListener("makeCellBuyPopup", function (event) {
            self.makeCellBuyPopup(event.content);
        });
        eventManager.addEventListener("makeConfirmPopup", function (event) {
            self.makeConfirmPopup(event.content);
        });
        eventManager.addEventListener("makePopup", function (event) {
            self.makePopup(event.content.type, event.content.props);
        });
        eventManager.addEventListener("makeInfoPopup", function (event) {
            self.makeInfoPopup(event.content);
        });
        eventManager.addEventListener("updateReact", function (event) {
            self.updateReact();
        });
    };

    ///// /////
    ReactUI.prototype.makePopup = function (type, props) {
        var container = document.getElementById("react-container");
        var key = this.idGenerator++;

        var onCloseCallback = props.onClose;
        props.onClose = function () {
            this.destroyPopup(key, onCloseCallback);
        }.bind(this);

        var popupProps = {};
        for (var prop in props) {
            popupProps[prop] = props[prop];
        }
        ;
        popupProps.key = key;
        popupProps.initialStyle = {
            top: container.offsetHeight / 3.5 + Object.keys(this.popups).length * 15,
            left: container.offsetWidth / 3.5 + Object.keys(this.popups).length * 15,
            zIndex: this.incrementZIndex()
        };
        popupProps.incrementZIndex = this.incrementZIndex.bind(this);

        var popup = {
            type: type,
            props: popupProps
        };

        this.popups[key] = popup;
        this.updateReact();
    };

    ReactUI.prototype.makeEmployeeActionPopup = function (props) {
        this.makePopup("EmployeeActionPopup", props);
    };

    ReactUI.prototype.makeInfoPopup = function (props) {
        this.makePopup("InfoPopup", props);
    };

    ReactUI.prototype.makeRecruitPopup = function (props) {
        var self = this;
        var recruitWithSelected = function (selected) {
            actions.recruitEmployee(props.player, selected.employee);
        };
        this.makeEmployeeActionPopup({
            player: props.player,
            relevantSkills: ["recruitment"],
            text: "Select employee in charge of recruitment",
            onOk: recruitWithSelected,
            okBtnText: "Select"
        });
    };

    ReactUI.prototype.makeRecruitCompletePopup = function (props) {
        var self = this;
        var recruitConfirmFN = function (selected) {
            props.player.addEmployee(selected.employee);
            if (props.recruitingEmployee) {
                props.recruitingEmployee.active = true;
                props.recruitingEmployee.trainSkill("recruitment");
            }
            self.updateReact();
        };
        this.makeEmployeeActionPopup({
            employees: props.employees,
            text: props.text || "Choose employee to recruit",
            onOk: recruitConfirmFN,
            okBtnText: "Recruit"
        });
    };

    ReactUI.prototype.makeCellBuyPopup = function (props) {
        var buySelected = function (selected) {
            actions.buyCell(props.player, props.cell, selected.employee);
        };
        this.makeEmployeeActionPopup({
            player: props.player,
            relevantSkills: ["negotiation"],
            text: "Select employee in charge of purchasing the plot",
            onOk: buySelected,
            okBtnText: "Buy",
            action: {
                target: props.cell,
                baseDuration: 14,
                baseCost: props.cell.landValue,
                actionText: "Buying this plot would take:"
            }
        });
    };
    ReactUI.prototype.makeConfirmPopup = function (props) {
        this.makePopup("ConfirmPopup", props);
    };

    ///// OTHER METHODS /////
    ReactUI.prototype.incrementZIndex = function () {
        return this.topZIndex++;
    };
    ReactUI.prototype.destroyPopup = function (key, callback) {
        if (callback)
            callback.call();

        this.popups[key] = null;
        delete this.popups[key];

        this.updateReact();
    };
    ReactUI.prototype.closeTopPopup = function () {
    };

    ReactUI.prototype.updateReact = function () {
        React.renderComponent(UIComponents.Stage({ popups: this.popups }), document.getElementById("react-container"));
    };
    return ReactUI;
})();
//# sourceMappingURL=reactui.js.map
