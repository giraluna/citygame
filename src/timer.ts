// https://gist.github.com/paulirish/5438650
(function(){
 
  // prepare base perf object
  if (typeof window.performance === 'undefined') {
      window.performance = <any> {};
  }
 
  if (!window.performance.now){
    
    var nowOffset = Date.now();
 
    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }
 
 
    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
 
  }
 
})();

module Strawb
{
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
  export class Timer
  {
    startTime  : number;
    totalTime  : number;
    deltaTime  : number;
    runningTime: number = 0;

    private _runStartTime: number;
    private _previousTime: number;
    
    running = false;

    getTime: () => number;


    constructor(public autoStart?)
    {
      // sets the getTime mehtod to use highest resolution timing available
      this.getTime = Date.now;
      var performance = window.performance;
      if (!performance)
      {
        if (performance.now)
        {
          this.getTime = function getTimeFn()
          {
            return performance.now();
          };
        }
      }

      // autostart
      if (autoStart !== false)
      {
        this.start();
      }
    }

  /////////////
  // Methods //
  /////////////

    /**
     * @method Strawb.Timer#start
     */
    start()
    {
      if (this.running)
      {
        return;
      }
      var now = this.getTime();
      if (!this.startTime)
      {
        this.startTime = now;
      }
      this._runStartTime = now;
      this._previousTime = now;
      this.running = true;
    }

    /**
     * @method Strawb.Timer#stop
     */
    stop()
    {
      this.getRunningTime();
      this.running = false;
    }

    /**
     * @method Strawb.Timer#getTotalTime
     */
    getTotalTime()
    {
      this.totalTime = this.getTime() - this.startTime;
      return this.totalTime;
    }

    /**
     * @method Strawb.Timer#getRunningTime
     */
    getRunningTime()
    {
      if (!this.running)
      {
        return this.runningTime;
      }
      var now = this.getTime();
      this.runningTime += now - this._runStartTime;
      this._runStartTime = now;
      return this.runningTime;
    }

    /**
     * @method Strawb.Timer#getDelta
     */
    getDelta()
    {
      var now = this.getTime();
      this.deltaTime = (now - this._previousTime) * 0.001;
      this._previousTime = now;
      return this.deltaTime;
    }
  }
}
