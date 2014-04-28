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

        eventManager.addEventListener("makeEmployeeActionPopup", function (event) {
            self.makeEmployeeActionPopup(event.content);
        });
    };

    ///// /////
    ReactUI.prototype.makeEmployeeActionPopup = function (props) {
        var container = document.getElementById("react-container");

        var popupProps = {};
        for (var prop in props) {
            popupProps[prop] = props[prop];
        }
        ;
        popupProps.key = this.idGenerator++;
        popupProps.initialStyle = {
            top: container.offsetHeight / 3.5 + this.popups.length * 15,
            left: container.offsetWidth / 3.5 + this.popups.length * 15,
            zIndex: this.incrementZIndex()
        };
        popupProps.incrementZIndex = this.incrementZIndex.bind(this);

        var popup = UIComponents.EmployeeActionPopup(popupProps);

        this.popups.push(popup);
        this.updateReact();
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
