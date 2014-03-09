declare module Strawb {
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
    class Timer {
        public autoStart: any;
        public startTime: number;
        public totalTime: number;
        public deltaTime: number;
        public runningTime: number;
        private _runStartTime;
        private _previousTime;
        public running: boolean;
        public getTime: () => number;
        constructor(autoStart?: any);
        /**
        * @method Strawb.Timer#start
        */
        public start(): void;
        /**
        * @method Strawb.Timer#stop
        */
        public stop(): void;
        /**
        * @method Strawb.Timer#getTotalTime
        */
        public getTotalTime(): number;
        /**
        * @method Strawb.Timer#getRunningTime
        */
        public getRunningTime(): number;
        /**
        * @method Strawb.Timer#getDelta
        */
        public getDelta(): number;
    }
}
