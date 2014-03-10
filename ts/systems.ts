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
class SystemsManager
{
  systems: any = {};
  timer: Strawb.Timer;
  tickTime: number;
  tickNumber: number = 0;
  accumulated: number = 0;

  constructor(tickTime)
  {
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

class System
{
  activationRate: number;
  lastTick: number;
  nextTick: number;

  activate: () => any;

  constructor(activationRate: number, currTick: number)
  {
    this.activationRate = activationRate;
    this.updateTicks(currTick);

    if (activationRate < 1)
    {
      console.log("<1 activationRate on system", this);
    }
  }
  updateTicks(currTick: number)
  {
    this.lastTick = currTick;
    this.nextTick = currTick + this.activationRate;
  }

  tick(currTick: number)
  {
    if (currTick + this.activationRate >= this.nextTick)
    {
      // do something
      this.activate();
      
      this.updateTicks(currTick);
    }
  }
}

class ProfitSystem extends System
{
  targets: any[] = [];

  constructor(activationRate: number, currTick: number)
  {
    super(activationRate, currTick);
  }

  activate()
  {
    
  }
}