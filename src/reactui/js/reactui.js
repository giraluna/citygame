/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
///
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/actions.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/cellinfo.d.ts" />
/// <reference path="js/employeeaction.d.ts" />
/// <reference path="js/actioninfo.d.ts" />
/// <reference path="js/popup.d.ts" />
/// <reference path="js/stage.d.ts" />
var ReactUI = (function () {
    function ReactUI(player) {
        this.idGenerator = 0;
        this.popups = [];
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

        eventManager.addEventListener("makeInfoPopup", function (event) {
            self.makeInfoPopup(event.content);
        });
        eventManager.addEventListener("makeConfirmPopup", function (event) {
            self.makeConfirmPopup(event.content);
        });
        eventManager.addEventListener("makeEmployeeActionPopup", function (event) {
            self.makeEmployeeActionPopup(event.content);
        });

        eventManager.addEventListener("makeCellBuyPopup", function (event) {
            self.makeCellBuyPopup(event.content);
        });
        eventManager.addEventListener("makeRecruitPopup", function (event) {
            self.makeRecruitPopup(event.content);
        });
        eventManager.addEventListener("makeRecruitCompletePopup", function (event) {
            self.makeRecruitCompletePopup(event.content);
        });
    };

    ReactUI.prototype.makePopup = function (props) {
        var key = props.key;

        var container = document.getElementById("react-container");
        console.log(container.offsetWidth);
        console.log(this.topZIndex);

        var boundIncrementZIndex = this.incrementZIndex.bind(this);
        var popup = UIComponents.Popup({
            key: key,
            text: props.text || null,
            content: props.content || null,
            buttons: props.buttons || null,
            initialStyle: {
                top: container.offsetHeight / 3.5 + this.popups.length * 15,
                left: container.offsetWidth / 3.5 + this.popups.length * 15,
                zIndex: this.incrementZIndex()
            },
            incrementZIndex: boundIncrementZIndex
        });

        this.popups.push(popup);
        this.updateReact();
    };

    ReactUI.prototype.makeInfoPopup = function (props) {
        var key = this.idGenerator++;
        var boundDestroyPopup = this.destroyPopup.bind(this, key, null);

        var closeBtn = React.DOM.button({
            onClick: boundDestroyPopup,
            key: "close"
        }, props.okText || "close");

        this.makePopup({
            key: key,
            text: props.text,
            buttons: [closeBtn]
        });
    };
    ReactUI.prototype.makeConfirmPopup = function (props) {
        ///// DEFAULTS /////
        props.okText = props.okText || "confirm";
        props.onCancel = props.onCancel || function () {
        };
        props.cancelText = props.cancelText || "cancel";

        var key = this.idGenerator++;
        var boundDestroyPopup = this.destroyPopup.bind(this, key, null);

        ///// BUTTONS /////
        var okBtn = React.DOM.button({
            onClick: function () {
                props.onOk.call();
                boundDestroyPopup();
            },
            key: "ok"
        }, props.okText);

        var closeBtn = React.DOM.button({
            onClick: function () {
                props.onCancel.call();
                boundDestroyPopup();
            },
            key: "cancel"
        }, props.cancelText);

        this.makePopup({
            key: key,
            text: props.text,
            buttons: [okBtn, closeBtn]
        });
    };
    ReactUI.prototype.makeEmployeeActionPopup = function (props) {
        ///// DEFAULTS /////
        props.text = props.text || "Choose employee";
        props.okText = props.okText || "Confirm";
        props.onCancel = props.onCancel || function () {
        };
        props.cancelText = props.cancelText || "Cancel";

        props.relevantSkills = props.relevantSkills || [];

        props.action = props.action || {};

        var self = this;
        var key = this.idGenerator++;
        var player = props.player;
        var boundDestroyPopup = this.destroyPopup.bind(this, key, null);

        ///// CONTENT /////
        var activeEmployees = props.employees;
        if (activeEmployees.length < 1) {
            this.makeInfoPopup({ text: "Recruit some employees first" });
            return;
        }

        var ea = UIComponents.EmployeeAction({
            employees: activeEmployees,
            relevantSkills: props.relevantSkills,
            selected: null,
            action: props.action,
            actionText: props.action.actionText
        });

        var content = React.DOM.div({ className: "popup-content" }, ea);

        ///// BUTTONS /////
        var okBtn = React.DOM.button({
            onClick: function () {
                if (!this.state.selected) {
                    self.makeInfoPopup({ text: "No employee selected" });
                    return;
                } else {
                    props.onOk.call(this, this.state.selected.employee);
                    boundDestroyPopup();
                }
            }.bind(ea),
            key: "ok"
        }, props.okText);

        var closeBtn = React.DOM.button({
            onClick: function () {
                props.onCancel.call(ea);
                boundDestroyPopup();
            }.bind(ea),
            key: "cancel"
        }, props.cancelText);

        this.makePopup({
            key: key,
            text: props.text,
            content: content,
            buttons: [okBtn, closeBtn]
        });
    };

    ReactUI.prototype.makeCellBuyPopup = function (props) {
        var player = props.player;
        var cell = props.cell;

        ///// BUTTONS /////
        var buySelected = function (selected) {
            actions.buyCell(player, cell, selected);
        };

        this.makeEmployeeActionPopup({
            employees: player.getEmployees(),
            relevantSkills: ["negotiation"],
            action: {
                target: cell,
                baseDuration: 14,
                baseCost: cell.landValue,
                actionText: "Buying this plot would take:"
            },
            text: "Choose employee to buy plot",
            onOk: buySelected,
            okText: "Buy"
        });
    };

    ReactUI.prototype.makeRecruitPopup = function (props) {
        var player = props.player;

        ///// BUTTONS /////
        var recruitWithSelected = function (selected) {
            actions.recruitEmployee(player, selected);
        };

        this.makeEmployeeActionPopup({
            player: player,
            employees: player.getEmployees(),
            relevantSkills: ["recruitment"],
            action: { actionText: null },
            text: "Select employee in charge of recruitment",
            onOk: recruitWithSelected,
            okText: "Select"
        });
    };

    ReactUI.prototype.makeRecruitCompletePopup = function (props) {
        var player = props.player;

        props.onConfirm = props.onConfirm || function () {
        };
        props.text = props.text || "Choose employee to recruit";

        ///// BUTTONS /////
        var recruitConfirmFN = function (selected) {
            player.addEmployee(selected);
            props.onConfirm.call();
        };

        this.makeEmployeeActionPopup({
            employees: props.employees,
            text: props.text,
            onOk: recruitConfirmFN,
            okText: "Recruit",
            onCancel: props.onConfirm
        });
    };

    ///// OTHER METHODS /////
    ReactUI.prototype.incrementZIndex = function () {
        return this.topZIndex++;
    };
    ReactUI.prototype.destroyPopup = function (key, callback) {
        this.popups = this.popups.filter(function (popup) {
            return popup.props.key !== key;
        });

        if (callback)
            callback.call();

        this.updateReact();
    };

    ReactUI.prototype.updateReact = function () {
        React.renderComponent(UIComponents.Stage({ popups: this.popups }), document.getElementById("react-container"));
    };
    return ReactUI;
})();
//# sourceMappingURL=reactui.js.map
