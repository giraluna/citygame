/// <reference path="../lib/pixi.d.ts" />
///
/// <reference path="js/spritehighlighter.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
///
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// mom, dad, I'm sorry.
var Blinker = (function (_super) {
    __extends(Blinker, _super);
    function Blinker(delay, color, repeat, autoStart) {
        if (typeof autoStart === "undefined") { autoStart = true; }
        _super.call(this);
        this.delay = delay;
        this.color = color;
        this.repeat = repeat;
        this.toBlink = {};
        this.idGenerator = 0;
        this.blinkFunctions = [];
        this.onRemoveCallbacks = {};

        this.repeat = repeat * 2;

        this.makeBlinkFunctions();

        if (autoStart)
            this.start();

        return this;
    }
    Blinker.prototype.getToBlink = function (id) {
        if (id)
            return this.toBlink[id];
        else {
            var cells = [];

            for (var group in this.toBlink) {
                cells = cells.concat(this.toBlink[group]);
            }
            return cells;
        }
    };
    Blinker.prototype.makeBlinkFunctions = function () {
        // allows dynamic assignment
        var getColor = function getColorFN() {
            return this.color;
        }.bind(this);

        var tintFN = function () {
            this.tintCells(this.getToBlink(), getColor(), false);
        }.bind(this);
        var clearFN = this.clearFN = function (id) {
            this.tintCells(this.getToBlink(id), 0xFFFFFF, false);
        }.bind(this);
        this.blinkFunctions = [tintFN, clearFN];

        this.blink = function loopFN() {
            this.blinkFunctions[0].call();
            this.blinkFunctions[this.blinkFunctions.length - 1] = this.blinkFunctions.shift();
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });

            if (this.repeat > 0) {
                this.repeat--;
                if (this.repeat <= 0)
                    this.stop();
            }
        }.bind(this);
    };
    Blinker.prototype.addCells = function (cells, onRemove, id) {
        if (typeof id === "undefined") { id = this.idGenerator++; }
        if (!this.toBlink[id])
            this.toBlink[id] = cells;
        else {
            this.toBlink[id] = this.toBlink[id].concat(cells);
        }

        if (onRemove) {
            this.onRemoveCallbacks[id] = onRemove;
        }

        return id;
    };
    Blinker.prototype.removeCells = function (id) {
        if (!this.toBlink[id])
            return;
        else {
            if (Object.keys(this.toBlink).length <= 1) {
                this.stop();
            } else {
                this.clearFN(id);
                this.toBlink[id] = null;
                delete this.toBlink[id];
            }

            if (this.onRemoveCallbacks[id]) {
                this.onRemoveCallbacks[id].call();
                this.onRemoveCallbacks[id] = null;
                delete this.onRemoveCallbacks[id];
            }
        }

        return id;
    };
    Blinker.prototype.start = function () {
        // already running
        if (this.intervalFN)
            return this;

        var self = this;

        self.blink();
        this.intervalFN = window.setInterval(self.blink, self.delay);

        return this;
    };
    Blinker.prototype.pause = function () {
        window.clearInterval(this.intervalFN);
        this.intervalFN = null;

        return this;
    };
    Blinker.prototype.stop = function () {
        this.pause();
        this.clearFN();
        eventManager.dispatchEvent({ type: "updateWorld", content: "" });

        this.toBlink = {};

        return this;
    };
    return Blinker;
})(Highlighter);
//# sourceMappingURL=spriteblinker.js.map
