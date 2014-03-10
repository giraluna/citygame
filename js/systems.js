/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/timer.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* @class SystemsManager
* @classdesc
*
* @param    tickTime       {number}
*
* @property systems     List of systems registered with this
* @property timer
* @property tickTime    Amount of time for single tick
* @property tickNumber  Counter for total ticks so far
* @property accumulated Amount of time banked towards next tick
*
*/
var SystemsManager = (function () {
    function SystemsManager(tickTime) {
        this.systems = {};
        this.tickNumber = 0;
        this.accumulated = 0;
        this.timer = new Strawb.Timer();
        this.tickTime = tickTime / 1000;
    }
    SystemsManager.prototype.addSystem = function (name, system) {
        this.systems[name] = system;
    };
    SystemsManager.prototype.tick = function () {
        this.accumulated -= this.tickTime;
        this.tickNumber++;
        for (var system in this.systems) {
            this.systems[system].tick(this.tickNumber);
        }
    };
    SystemsManager.prototype.update = function () {
        this.accumulated += this.timer.getDelta();
        if (this.accumulated >= this.tickTime) {
            this.tick();
        }
    };
    return SystemsManager;
})();

var System = (function () {
    function System(activationRate, currTick) {
        this.activationRate = activationRate;
        this.updateTicks(currTick);

        if (activationRate < 1) {
            console.log("<1 activationRate on system", this);
        }
    }
    System.prototype.updateTicks = function (currTick) {
        this.lastTick = currTick;
        this.nextTick = currTick + this.activationRate;
    };

    System.prototype.tick = function (currTick) {
        if (currTick + this.activationRate >= this.nextTick) {
            // do something
            this.activate();

            this.updateTicks(currTick);
        }
    };
    return System;
})();

var HouseSystem = (function (_super) {
    __extends(HouseSystem, _super);
    function HouseSystem(activationRate, currTick) {
        _super.call(this, activationRate, currTick);
        this.targets = [];
    }
    return HouseSystem;
})(System);
//# sourceMappingURL=systems.js.map
