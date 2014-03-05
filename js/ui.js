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
        var lineStyle = data.style.lineStyle;
        var fillStyle = data.style.fillStyle;

        var tipPos = (data.tipPos !== undefined) ? data.tipPos : 0.25;
        var tipWidth = data.tipWidth || 10;
        var tipHeight = data.tipHeight || 20;
        var tipDir = data.tipDir || "right";
        var pointing = data.pointing || "down";

        var textObject = data.textObject;
        var textWidth = textObject.width + data.padding[0] * 2;
        var textHeight = textObject.height + data.padding[1] * 2;

        var width = (data.autoSize || !data.width) ? textWidth : data.width;
        var height = (data.autoSize || !data.height) ? textHeight : data.height;

        var speechPoly = makeSpeechRect(width, height, tipPos, tipWidth, tipHeight, tipDir, pointing);
        this.topLeftCorner = speechPoly[1];

        var gfx = new PIXI.Graphics();
        this.addChild(gfx);

        drawPolygon(gfx, speechPoly[0], lineStyle, fillStyle);

        this.setTextPos(textObject, data.padding);
        gfx.addChild(textObject);
    };
    ToolTip.prototype.setTextPos = function (text, padding) {
        var x = this.topLeftCorner[0] + padding[0];
        var y = this.topLeftCorner[1] + padding[1];

        text.position.set(x, y);
        return text;
    };
    return ToolTip;
})(UIObject);

function drawPolygon(gfx, polygon, lineStyle, fillStyle) {
    // BUG : floating point errors
    // TODO : round them maybe
    gfx.lineStyle(lineStyle.width, lineStyle.color, lineStyle.alpha);
    gfx.beginFill(fillStyle.color, fillStyle.alpha);

    gfx.moveTo(polygon[0][0], polygon[0][1]);

    for (var i = 1; i < polygon.length; i++) {
        if (!(polygon[i][0] === polygon[i - 1][0] && polygon[i][1] === polygon[i - 1][1])) {
            var x = polygon[i][0];
            var y = polygon[i][1];
            gfx.lineTo(x, y);
        }
    }
    gfx.endFill();

    // draw dots at the corners
    /*
    for (var i = 1; i < polygon.length; i++)
    {
    gfx.beginFill();
    gfx.drawEllipse(polygon[i][0], polygon[i][1], 3, 3);
    gfx.endFill();
    }
    */
    return gfx;
}

function makeSpeechRect(width, height, tipPos, tipWidth, tipHeight, tipDir, pointing) {
    if (typeof width === "undefined") { width = 200; }
    if (typeof height === "undefined") { height = 100; }
    if (typeof tipPos === "undefined") { tipPos = 0.25; }
    if (typeof tipWidth === "undefined") { tipWidth = 10; }
    if (typeof tipHeight === "undefined") { tipHeight = 20; }
    if (typeof tipDir === "undefined") { tipDir = "right"; }
    if (typeof pointing === "undefined") { pointing = "down"; }
    /*
    4|---------------------------|3
    |                           |
    |                           |
    |       1                   |
    5|----|  /-------------------|2
    6| /
    |/
    0, 7
    
    0,7
    |\
    6| \ 1
    5|----|  \-------------------|2
    |                           |
    |                           |
    |                           |
    4|---------------------------|3
    */
    var xMax = width * (1 - tipPos);
    var yMax = height + tipHeight;
    var xMin = -width * tipPos;
    var yMin = tipHeight;
    var dir = (pointing === "down") ? -1 : 1;

    var polygon;
    var topLeft;

    // make base polygon
    if (pointing === "down") {
        polygon = [
            [0, 0],
            [0, -yMin],
            [xMax, -yMin],
            [xMax, -yMax],
            [xMin, -yMax],
            [xMin, -yMin],
            [0, -yMin],
            [0, 0]
        ];
        topLeft = [xMin, -yMax];
    } else if (pointing === "up") {
        polygon = [
            [0, 0],
            [0, yMin],
            [xMax, yMin],
            [xMax, yMax],
            [xMin, yMax],
            [xMin, yMin],
            [0, yMin],
            [0, 0]
        ];
        topLeft = [xMin, yMin];
    }

    // adjust direction tip slants in
    if (tipDir === "right") {
        polygon[1][0] = tipWidth;
    } else if (tipDir === "left") {
        polygon[6][0] = -tipWidth;
    }

    // adjust for extreme tip position
    if (tipPos < 0) {
        polygon[1][0] = polygon[5][0] + tipWidth;
        polygon[5] = polygon[6] = [polygon[5][0], polygon[5][1] + tipWidth * dir];
    } else if (tipPos > 1) {
        polygon[6][0] = polygon[2][0] - tipWidth;
        polygon[2] = polygon[1] = [polygon[2][0], polygon[2][1] + tipWidth * dir];
    }

    return [polygon, topLeft];
}
//# sourceMappingURL=ui.js.map
