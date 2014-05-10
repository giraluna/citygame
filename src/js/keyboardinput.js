/// <reference path="js/eventlistener.d.ts" />
var keyboardStates = {
    "default": {
        "keydown": {
            // space
            "32": function () {
                eventManager.dispatchEvent({ type: "togglePause", content: "" });
            },
            // numpad plus
            "107": function () {
                eventManager.dispatchEvent({ type: "incrementSpeed", content: "" });
            },
            // plus
            "187": function () {
                eventManager.dispatchEvent({ type: "incrementSpeed", content: "" });
            },
            // numpad minus
            "109": function () {
                eventManager.dispatchEvent({ type: "decrementSpeed", content: "" });
            },
            // minus
            "189": function () {
                eventManager.dispatchEvent({ type: "decrementSpeed", content: "" });
            },
            // r
            // recruit
            "82": function () {
                document.getElementById("recruitBtn").click();
            },
            // u
            // buy
            "85": function () {
                document.getElementById("buyBtn").click();
            },
            // b
            // build
            "66": function () {
                document.getElementById("buildBtn").click();
            }
        }
    }
};

var KeyboardEventHandler = (function () {
    function KeyboardEventHandler(initialState) {
        if (typeof initialState === "undefined") { initialState = "default"; }
        this.listeners = {};
        this.statesObj = keyboardStates;
        this.setState(initialState);
    }
    KeyboardEventHandler.prototype.setState = function (state) {
        this.removeListeners();
        this.addEventListeners(state);
        this.currState = state;
    };
    KeyboardEventHandler.prototype.addEventListeners = function (state) {
        for (var type in this.statesObj[state]) {
            var eventHandler;
            if (type === "keydown") {
                eventHandler = this.handleKeydown.bind(this);
            } else if (type === "keyup") {
                eventHandler = this.handleKeyup.bind(this);
            } else {
                console.warn("Tried to bind invalid keyboard event ", type);
                return;
            }
            this.listeners[type] = document.addEventListener(type, eventHandler);
        }
    };
    KeyboardEventHandler.prototype.removeListeners = function () {
        for (var type in this.listeners) {
            document.removeEventListener(type, this.listeners[type]);
        }
        this.listeners = {};
    };
    KeyboardEventHandler.prototype.handleKeydown = function (event) {
        if (this.statesObj[this.currState]["keydown"][event.keyCode]) {
            if (event.target.tagName === "INPUT" && event.target.type === "text") {
                return;
            }
            event.preventDefault();
            this.statesObj[this.currState]["keydown"][event.keyCode].call();
        }
    };
    KeyboardEventHandler.prototype.handleKeyup = function (event) {
    };
    return KeyboardEventHandler;
})();
//# sourceMappingURL=keyboardinput.js.map
