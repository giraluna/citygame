/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/timer.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
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
        this.tickNumber = 0;
        this.accumulated = 0;
        this.paused = false;
        this.speed = 1;
        this.timer = new Strawb.Timer();
        this.tickTime = tickTime / 1000;

        this.init();
    }
    SystemsManager.prototype.init = function () {
        this.addEventListeners();
    };
    SystemsManager.prototype.addSystem = function (name, system) {
        this.systems[name] = system;
    };
    SystemsManager.prototype.addEventListeners = function () {
        var self = this;
        var slider = document.getElementById("speed-control");

        eventManager.addEventListener("togglePause", function (event) {
            self.togglePause();
        });
        eventManager.addEventListener("incrementSpeed", function (event) {
            self.setSpeed(self.speed + 1);
        });
        eventManager.addEventListener("decrementSpeed", function (event) {
            self.setSpeed(self.speed - 1);
        });

        slider.addEventListener("change", function (event) {
            if (slider.value === "0") {
                self.pause();
            } else {
                self.setSpeed(parseInt(slider.value));
            }
        });
    };
    SystemsManager.prototype.pause = function () {
        this.speedBeforePausing = this.speed;
        this.speed = 0;
        this.timer.stop();
        this.paused = true;
        var slider = document.getElementById("speed-control");
        slider.value = "0";
    };
    SystemsManager.prototype.unPause = function (newSpeed) {
        this.timer.start();
        this.paused = false;

        if (newSpeed)
            this.setSpeed(newSpeed);
    };
    SystemsManager.prototype.togglePause = function () {
        if (this.paused)
            this.unPause(this.speedBeforePausing);
        else
            this.pause();
    };
    SystemsManager.prototype.setSpeed = function (speed) {
        var slider = document.getElementById("speed-control");
        if (speed <= 0) {
            this.pause();
            return;
        } else if (speed > parseInt(slider.max))
            return;

        if (this.paused)
            this.unPause();

        var speed = this.speed = Math.round(speed);
        var adjustedSpeed = Math.pow(speed, 2);

        this.tickTime = 1 / adjustedSpeed;
        this.accumulated = this.accumulated / adjustedSpeed;
        slider.value = "" + speed;
    };
    SystemsManager.prototype.update = function () {
        if (this.paused)
            return;
        this.accumulated += this.timer.getDelta();
        while (this.accumulated >= this.tickTime) {
            this.tick();
        }
    };
    SystemsManager.prototype.tick = function () {
        this.accumulated -= this.tickTime;
        this.tickNumber++;
        for (var system in this.systems) {
            this.systems[system].tick(this.tickNumber);
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
    System.prototype.activate = function (any) {
    };

    System.prototype.updateTicks = function (currTick) {
        this.lastTick = currTick;
        this.nextTick = currTick + this.activationRate;
    };

    System.prototype.tick = function (currTick) {
        if (currTick >= this.nextTick) {
            // do something
            this.activate(currTick);

            this.updateTicks(currTick);
        }
    };
    return System;
})();

var ProfitSystem = (function (_super) {
    __extends(ProfitSystem, _super);
    function ProfitSystem(activationRate, systemsManager, players, targetTypes) {
        _super.call(this, activationRate, systemsManager.tickNumber);
        this.systemsManager = systemsManager;
        this.players = players;
        this.targetTypes = targetTypes;
    }
    ProfitSystem.prototype.activate = function () {
        var currentDate = this.systemsManager.systems.date.getDate();
        for (var _player in this.players) {
            var player = this.players[_player];

            for (var ii = 0; ii < this.targetTypes.length; ii++) {
                var profitPerThisType = 0;
                var targets = player.ownedContent[this.targetTypes[ii]];

                if (targets.length < 1)
                    continue;

                for (var jj = 0; jj < targets.length; jj++) {
                    profitPerThisType += targets[jj].modifiedProfit * targets[jj].type.daysForProfitTick;
                }
                player.addMoney(profitPerThisType, this.targetTypes[ii], currentDate);
            }
        }

        eventManager.dispatchEvent({ type: "updateReact", content: "" });
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
    DateSystem.prototype.setDate = function (newDate) {
        this.year = newDate.year;
        this.month = newDate.month;
        this.day = newDate.day;

        this.updateDate();
    };
    DateSystem.prototype.toString = function () {
        return "" + this.day + "." + this.month + "." + this.year;
    };
    DateSystem.prototype.updateDate = function () {
        this.dateElem.innerHTML = this.toString();
    };
    return DateSystem;
})(System);

var DelayedActionSystem = (function (_super) {
    __extends(DelayedActionSystem, _super);
    function DelayedActionSystem(activationRate, systemsManager) {
        _super.call(this, activationRate, systemsManager.tickNumber);
        this.callbacks = {};
        this.systemsManager = systemsManager;
        this.addEventListeners();
    }
    DelayedActionSystem.prototype.addEventListeners = function () {
        var self = this;
        eventManager.addEventListener("delayedAction", function (event) {
            var _e = event.content;
            self.addAction(self.lastTick, _e.time, _e.onComplete);
        });
    };

    DelayedActionSystem.prototype.addAction = function (currTick, time, action) {
        var actionTime = currTick + time;
        if (!this.callbacks[actionTime]) {
            this.callbacks[actionTime] = [];
        }
        this.callbacks[actionTime].push(action);
    };

    DelayedActionSystem.prototype.activate = function (currTick) {
        if (this.callbacks[currTick]) {
            for (var i = 0; i < this.callbacks[currTick].length; i++) {
                this.callbacks[currTick][i].call();
            }
            this.callbacks[currTick] = null;
            delete this.callbacks[currTick];
        }
    };
    return DelayedActionSystem;
})(System);
//# sourceMappingURL=systems.js.map
