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
        eventManager.addEventListener("makeCellBuyPopup", function (event) {
            self.makeCellBuyPopup(event.content);
        });
    };

    ReactUI.prototype.makePopup = function (props) {
        var key = props.key;

        var boundIncrementZIndex = this.incrementZIndex.bind(this);
        var popup = UIComponents.Popup({
            key: key,
            text: props.text || null,
            content: props.content || null,
            buttons: props.buttons || null,
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

        props.action = props.action || {};

        var self = this;
        var player = props.player;
        var key = this.idGenerator++;
        var boundDestroyPopup = this.destroyPopup.bind(this, key, null);

        ///// CONTENT /////
        var activeEmployees = player.getEmployees();
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
                if (!player.employees[this.state.selected.key]) {
                    self.makeInfoPopup({ text: "No employee selected" });
                    return;
                } else {
                    props.onOk.call(ea);
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
        var buySelected = function () {
            console.log(this);
            actions.buyCell(player, cell, player.employees[this.state.selected.key]);
        };

        this.makeEmployeeActionPopup({
            player: player,
            relevantSkills: ["negotiation"],
            action: {
                target: cell,
                baseDuration: 14,
                baseCost: cell.landValue,
                actionText: "Buying this cell would take:"
            },
            text: "Choose employee",
            onOk: buySelected,
            okText: "Buy"
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
