var Strawb;
(function (Strawb) {
    /**
    * @class Timer
    * @classdesc Timing module
    * @memberof Strawb
    *
    * @param    autostart      {boolean}
    *
    * @property startTime      First start
    * @property totalTime      Time since clock first started
    * @property runningTime    Time clock has been running since start
    * @property deltaTime      Time since last deltaTime call or start in ms
    * @property _runStartTime  Time clock last started running
    * @property _previousTime  Same as delta
    *
    */
    var Timer = (function () {
        function Timer(autoStart) {
            this.autoStart = autoStart;
            this.runningTime = 0;
            this.running = false;
            // sets the getTime mehtod to use highest resolution timing available
            this.getTime = Date.now;
            var performance = window.performance;
            if (!performance) {
                if (performance.now) {
                    this.getTime = function getTimeFn() {
                        return performance.now();
                    };
                }
            }

            // autostart
            if (autoStart !== false) {
                this.start();
            }
        }
        /////////////
        // Methods //
        /////////////
        /**
        * @method Strawb.Timer#start
        */
        Timer.prototype.start = function () {
            if (this.running) {
                return;
            }
            var now = this.getTime();
            if (!this.startTime) {
                this.startTime = now;
            }
            this._runStartTime = now;
            this._previousTime = now;
            this.running = true;
        };

        /**
        * @method Strawb.Timer#stop
        */
        Timer.prototype.stop = function () {
            this.getRunningTime();
            this.running = false;
        };

        /**
        * @method Strawb.Timer#getTotalTime
        */
        Timer.prototype.getTotalTime = function () {
            this.totalTime = this.getTime() - this.startTime;
            return this.totalTime;
        };

        /**
        * @method Strawb.Timer#getRunningTime
        */
        Timer.prototype.getRunningTime = function () {
            if (!this.running) {
                return this.runningTime;
            }
            var now = this.getTime();
            this.runningTime += now - this._runStartTime;
            this._runStartTime = now;
            return this.runningTime;
        };

        /**
        * @method Strawb.Timer#getDelta
        */
        Timer.prototype.getDelta = function () {
            var now = this.getTime();
            this.deltaTime = (now - this._previousTime) * 0.001;
            this._previousTime = now;
            return this.deltaTime;
        };
        return Timer;
    })();
    Strawb.Timer = Timer;
})(Strawb || (Strawb = {}));
//# sourceMappingURL=timer.js.map
