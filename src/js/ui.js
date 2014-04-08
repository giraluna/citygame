/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />
///
/// <reference path="js/utility.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UIObject = (function (_super) {
    __extends(UIObject, _super);
    function UIObject(parent) {
        _super.call(this);
        this._timeouts = {};
        this._callbacks = {
            start: [],
            added: [],
            complete: []
        };
        this._delay = 0;
        this._lifeTime = -1;
        this.visible = false;
        this.setParent(parent);

        return this;
    }
    UIObject.prototype.start = function () {
        var self = this;

        self.fireCallbacks("start");
        self._timeouts["add"] = window.setTimeout(function UIObjectAddFN() {
            self._parent.addChild(self);
            self.visible = true;
            self.fireCallbacks("added");

            if (self._lifeTime > 0) {
                self._timeouts["remove"] = window.setTimeout(function UIObjectRemoveFN() {
                    self.remove.call(self);
                    self.fireCallbacks("complete");
                }, self._lifeTime);
            }
        }, self._delay);
        return this;
    };
    UIObject.prototype.setParent = function (parent) {
        this._parent = parent;
        return this;
    };
    UIObject.prototype.delay = function (time) {
        this._delay = time;
        return this;
    };
    UIObject.prototype.lifeTime = function (time) {
        this._lifeTime = time;
        return this;
    };
    UIObject.prototype.addChild = function (child) {
        _super.prototype.addChild.call(this, child);
        return this;
    };
    UIObject.prototype.fireCallbacks = function (id) {
        if (!this._callbacks[id]) {
            throw new Error("UIObject fired callbacks with id: " + id);
            return;
        }
        var callbacks = this._callbacks[id];

        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].call();
        }
        return this;
    };
    UIObject.prototype.remove = function () {
        this.clearTimeouts();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        deepDestroy(this);
    };
    UIObject.prototype.onStart = function (callback) {
        this._callbacks["start"].push(callback);
        return this;
    };
    UIObject.prototype.onAdded = function (callback) {
        this._callbacks["added"].push(callback);
        return this;
    };
    UIObject.prototype.onComplete = function (callback) {
        this._callbacks["complete"].push(callback);
        return this;
    };
    UIObject.prototype.clearTimeouts = function () {
        for (var timeout in this._timeouts) {
            window.clearTimeout(this._timeouts[timeout]);
        }
    };
    return UIObject;
})(PIXI.DisplayObjectContainer);

function makeToolTip(data, text) {
    var toolTip = new PIXI.DisplayObjectContainer;
    var speechRect;

    if (data.autoSize || !data.width) {
        speechRect = makeSpeechRect(data, text);
    } else {
        speechRect = makeSpeechRect(data);
    }
    var speechPoly = speechRect[0];
    var topLeft = speechRect[1];

    var gfx = new PIXI.Graphics();
    drawPolygon(gfx, speechPoly, data.style.lineStyle, data.style.fillStyle);

    text.position.set(topLeft[0] + data.padding[0], topLeft[1] + data.padding[1]);

    toolTip.addChild(gfx);
    toolTip.addChild(text);

    return toolTip;
}

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

function makeSpeechRect(data, text) {
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
    var width = data.width || 200;
    var height = data.height || 100;
    var padding = data.padding || 10;

    var tipPos = data.tipPos || 0.25;
    var tipWidth = data.tipWidth || 10;
    var tipHeight = data.tipHeight || 20;
    var tipDir = data.tipDir || "right";
    var pointing = data.pointing || "down";

    if (text) {
        width = text.width + padding[0] * 2;
        height = text.height + padding[1] * 2;
    }

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
