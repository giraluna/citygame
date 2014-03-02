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
        this.init();
    }
    UIObject.prototype.init = function () {
        var self = this;
        window.setTimeout(function UIObjectAddFN() {
            console.log(self._parent);
            self._parent.addChild(self);

            window.setTimeout(function UIObjectDeathFN() {
                self.remove();
            }, self.lifeTime);
        }, self.delay);
    };
    UIObject.prototype.remove = function () {
        this._parent.removeChild(this);
    };
    return UIObject;
})(PIXI.DisplayObjectContainer);
//# sourceMappingURL=ui.js.map
