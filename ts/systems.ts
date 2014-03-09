/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/timer.d.ts" />

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
class SystemsManager extends PIXI.EventTarget
{
  systems: any = {};
  timer: Strawb.Timer;
  tickTime: number;
  tickNumber: number = 0;
  accumulated: number = 0;

  constructor(tickTime)
  {
    super();

    this.timer = new Strawb.Timer();
    this.tickTime = tickTime / 1000;
  }
  addSystem(name, system)
  {
    this.systems[name] = system;
  }
  tick()
  {
    this.accumulated -= this.tickTime;
    this.tickNumber++;
    for (var system in this.systems)
    {

      this.systems[system].tick(this.tickNumber);
    }
  }
  update()
  {
    this.accumulated += this.timer.getDelta();
    if (this.accumulated >= this.tickTime)
    {
      this.tick();
    }
  }
}