/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/timer.d.ts" />
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
* @property tickTime    Amount of time for single tick in ms
* @property tickNumber  Counter for total ticks so far
* @property accumulated Amount of time banked towards next tick
*
*/
var SystemsManager = (function () {
    function SystemsManager(tickTime) {
        this.systems = {};
        this.entities = {};
        this.tickNumber = 0;
        this.accumulated = 0;
        this.paused = false;
        this.timer = new Strawb.Timer();
        this.tickTime = tickTime / 1000;

        this.init();
    }
    SystemsManager.prototype.init = function () {
        var e = this.entities;
        e.ownedBuildings = [];
    };
    SystemsManager.prototype.addSystem = function (name, system) {
        this.systems[name] = system;
    };
    SystemsManager.prototype.addEventListeners = function (listener) {
        this.eventListener = listener;
        var self = this;
        listener.addEventListener("builtBuilding", function (event) {
            // TEMPORARY
            self.entities.ownedBuildings.push("temp");
        });
        listener.addEventListener("destroyBuilding", function (event) {
            // TEMPORARY
            self.entities.ownedBuildings.pop();
        });
        var slider = document.getElementById("speed-control");

        slider.addEventListener("change", function () {
            if (slider.value === "0") {
                self.timer.stop();
                self.paused = true;
            } else {
                self.timer.start();
                self.paused = false;
                self.tickTime = 1 / Math.pow(parseInt(slider.value), 2);
            }
        });
    };
    SystemsManager.prototype.tick = function () {
        this.accumulated -= this.tickTime;
        this.tickNumber++;
        for (var system in this.systems) {
            this.systems[system].tick(this.tickNumber);
        }
    };
    SystemsManager.prototype.update = function () {
        if (this.paused)
            return;
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
            console.warn("<1 activationRate on system", this);
        }
    }
    System.prototype.activate = function (currTick) {
    };

    System.prototype.updateTicks = function (currTick) {
        this.lastTick = currTick;
        this.nextTick = currTick + this.activationRate;
    };

    System.prototype.tick = function (currTick) {
        if (currTick + this.activationRate >= this.nextTick) {
            // do something
            this.activate(currTick);

            this.updateTicks(currTick);
        }
    };
    return System;
})();

var ProfitSystem = (function (_super) {
    __extends(ProfitSystem, _super);
    function ProfitSystem(activationRate, systemsManager, player) {
        _super.call(this, activationRate, systemsManager.tickNumber);
        this.targets = [];
        this.systemsManager = systemsManager;
        this.targets = systemsManager.entities.ownedBuildings;
        this.player = player;
    }
    ProfitSystem.prototype.activate = function () {
        for (var i = 0; i < this.targets.length; i++) {
            this.player.addMoney(1);
        }
    };
    return ProfitSystem;
})(System);

var DateSystem = (function (_super) {
    __extends(DateSystem, _super);
    function DateSystem(activationRate, systemsManager, dateElem, startDate) {
        _super.call(this, activationRate, systemsManager.tickNumber);
        this.year = startDate ? startDate.year : 2000;
        this.month = startDate ? startDate.month : 1;
        this.day = startDate ? startDate.day : 1;

        this.dateElem = dateElem;

        this.updateDate();
    }
    DateSystem.prototype.activate = function () {
        this.incrementDate();
    };
    DateSystem.prototype.incrementDate = function () {
        this.day++;

        this.fireCallbacks(this.onDayChange, this.day);

        this.calculateDate();
    };
    DateSystem.prototype.calculateDate = function () {
        if (this.day > 30) {
            this.day -= 30;
            this.month++;

            this.fireCallbacks(this.onMonthChange, this.month);
        }
        if (this.month > 12) {
            this.month -= 12;
            this.year++;

            this.fireCallbacks(this.onYearChange, this.year);
        }
        if (this.day > 30 || this.month > 12) {
            this.calculateDate();
        } else {
            this.updateDate();
        }
    };

    DateSystem.prototype.fireCallbacks = function (targets, date) {
        if (!targets)
            return;
        for (var i = 0; i < targets.length; i++) {
            targets[i].call(date);
        }
    };

    DateSystem.prototype.getDate = function () {
        var dateObj = {
            year: this.year,
            month: this.month,
            day: this.day
        };
        return dateObj;
    };
    DateSystem.prototype.toString = function () {
        return "" + this.day + "." + this.month + "." + this.year;
    };
    DateSystem.prototype.updateDate = function () {
        this.dateElem.innerHTML = this.toString();
    };
    return DateSystem;
})(System);
//# sourceMappingURL=systems.js.map
