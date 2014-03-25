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
  entities: any = {};
  eventListener: PIXI.EventTarget;
  timer: Strawb.Timer;
  tickTime: number;
  tickNumber: number = 0;
  accumulated: number = 0;

  constructor(tickTime)
  {
    this.timer = new Strawb.Timer();
    this.tickTime = tickTime / 1000;

    this.init();
  }
  init()
  {
    var e = this.entities;
    e.ownedBuildings = [];
  }
  addSystem(name: string, system: System)
  {
    this.systems[name] = system;
  }
  addEventListeners(listener)
  {
    this.eventListener = listener;
    var self = this;
    listener.addEventListener("builtBuilding", function(event)
    {
      // TEMPORARY
      self.entities.ownedBuildings.push("temp");
    });
    listener.addEventListener("destroyBuilding", function(event)
    {
      // TEMPORARY
      self.entities.ownedBuildings.pop();
    });
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

  activate(){}

  constructor(activationRate: number, currTick: number)
  {
    this.activationRate = activationRate;
    this.updateTicks(currTick);

    if (activationRate < 1)
    {
      console.warn("<1 activationRate on system", this);
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
  systemsManager: SystemsManager;
  player: Player;

  constructor(activationRate: number, systemsManager: SystemsManager, player: Player)
  {
    super(activationRate, systemsManager.tickNumber);
    this.systemsManager = systemsManager;
    this.targets = systemsManager.entities.ownedBuildings;
    this.player = player;
  }

  activate()
  {
    this.player.setIncome(this.targets.length);
    for (var i = 0; i < this.targets.length; i++)
    {
      this.player.addMoney(1);
    }
  }
}