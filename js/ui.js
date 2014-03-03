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

var ToolTip = (function (_super) {
    __extends(ToolTip, _super);
    function ToolTip(_parent, delay, lifeTime, data) {
        _super.call(this, _parent, delay, lifeTime);
        this._parent = _parent;
        this.delay = delay;
        this.lifeTime = lifeTime;
        this.data = data;

        this.drawToolTip(data);

        _super.prototype.init.call(this);
    }
    ToolTip.prototype.drawToolTip = function (data) {
        var lineStyle = data.lineStyle || {
            width: 1,
            color: 0x000000,
            alpha: 1
        };
        var fillStyle = data.fillStyle || {
            color: 0xFFFFFF,
            alpha: 1
        };
        var width = data.width || 200;
        var height = data.height || 100;
        var offset = data.offset || 0.25;

        var bubblePolygon = makeSpeechBubble(width, height, offset);

        var gfx = new PIXI.Graphics();
        this.addChild(gfx);

        drawPolygon(gfx, bubblePolygon, lineStyle, fillStyle);
    };
    return ToolTip;
})(UIObject);

function drawPolygon(gfx, polygon, lineStyle, fillStyle) {
    gfx.lineStyle(lineStyle.width, lineStyle.color, lineStyle.alpha);
    gfx.beginFill(fillStyle.color, fillStyle.alpha);

    gfx.moveTo(polygon[0][0], polygon[0][1]);
    for (var i = 1; i < polygon.length; i++) {
        var x = polygon[i][0];
        var y = polygon[i][1];
        gfx.lineTo(x, y);
    }
    gfx.endFill();
    return gfx;
}

function makeSpeechBubble(width, height, offset, tipWidth, tipHeight) {
    if (typeof width === "undefined") { width = 200; }
    if (typeof height === "undefined") { height = 100; }
    if (typeof offset === "undefined") { offset = 0.25; }
    if (typeof tipWidth === "undefined") { tipWidth = 10; }
    if (typeof tipHeight === "undefined") { tipHeight = 20; }
    var xMax = width * (1 - offset);
    var yMax = height + tipHeight;
    var xMin = -width * offset;
    var yMin = tipHeight;

    var resultPolygon = [
        [0, 0],
        [tipWidth, -yMin],
        [xMax, -yMin],
        [xMax, -yMax],
        [xMin, -yMax],
        [xMin, -yMin],
        [0, -yMin],
        [0, 0]
    ];

    return resultPolygon;
}
//# sourceMappingURL=ui.js.map
