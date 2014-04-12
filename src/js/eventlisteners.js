/// <reference path="../lib/pixi.d.ts" />
var listeners;
(function (listeners) {
    listeners.UI = new PIXI.EventTarget();
    listeners.game = new PIXI.EventTarget();
    listeners.render = new PIXI.EventTarget();
})(listeners || (listeners = {}));
//# sourceMappingURL=eventlisteners.js.map
