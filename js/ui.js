/// <reference path="../js/lib/pixi.d.ts" />
/// <reference path="../js/lib/tween.js.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UIObject = (function (_super) {
    __extends(UIObject, _super);
    function UIObject(_parent, delay, lifeTime) {
        _super.call(this);
        this._parent = _parent;
        this.delay = delay;
        this.lifeTime = lifeTime;
        this.timeouts = {};
        this.visible = false;

        this.init();
    }
    UIObject.prototype.init = function () {
        this._parent.addChild(this);

        var self = this;
        self.timeouts["add"] = window.setTimeout(function UIObjectAddFN() {
            self.visible = true;

            if (self.lifeTime > 0) {
                self.timeouts["remove"] = window.setTimeout(function UIObjectRemoveFN() {
                    self.remove();
                }, self.lifeTime);
            }
        }, self.delay);
    };
    UIObject.prototype.remove = function () {
        this.clearTimeouts();
        console.log("_parent", this._parent);
        console.log("parent", this.parent);
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    UIObject.prototype.clearTimeouts = function () {
        for (var timeout in this.timeouts) {
            window.clearTimeout(this.timeouts[timeout]);
        }
    };
    return UIObject;
})(PIXI.DisplayObjectContainer);
//# sourceMappingURL=ui.js.map
