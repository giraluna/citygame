/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/timer.d.ts" />

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
class SystemsManager
{
  systems: any = {};
  entities: any = {};
  eventListener: PIXI.EventTarget;
  timer: Strawb.Timer;
  tickTime: number;
  tickNumber: number = 0;
  accumulated: number = 0;
  paused: boolean = false;

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
    var slider = <HTMLInputElement> document.getElementById("speed-control");

    slider.addEventListener("change", function()
    {
      if (slider.value === "0")
      {
        self.timer.stop();
        self.paused = true;
      }
      else
      {
        self.timer.start();
        self.paused = false;
        self.tickTime = 1 / Math.pow(parseInt(slider.value), 2);
      }
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
    if (this.paused) return;
    this.accumulated += this.timer.getDelta();
    if (this.accumulated >= this.tickTime)
    {
      this.tick();
    }
  }
}

class System
{
  systemsManager: SystemsManager;
  activationRate: number;
  lastTick: number;
  nextTick: number;

  activate(currTick?){}

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
      this.activate(currTick);
      
      this.updateTicks(currTick);
    }
  }
}

class ProfitSystem extends System
{
  targets: any[] = [];
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
    for (var i = 0; i < this.targets.length; i++)
    {
      this.player.addMoney(1);
    }
  }
}

interface IDateObj
{
  year: number;
  month: number;
  day: number;
}

class DateSystem extends System
{
  year: number;
  month: number;
  day: number;

  dateElem: HTMLElement;

  onDayChange: { (): any; }[];
  onMonthChange: { (): any; }[];
  onYearChange: { (): any; }[];

  constructor(activationRate: number, systemsManager: SystemsManager,
    dateElem: HTMLElement, startDate?: IDateObj)
  {
    super(activationRate, systemsManager.tickNumber);
    this.year  = startDate ? startDate.year  : 2000;
    this.month = startDate ? startDate.month : 1;
    this.day   = startDate ? startDate.day   : 1;

    this.dateElem = dateElem;

    this.updateDate();
  }
  activate()
  {
    this.incrementDate();
  }
  incrementDate()
  {
    this.day++;

    this.fireCallbacks(this.onDayChange, this.day);

    this.calculateDate();
  }
  calculateDate()
  {
    if (this.day > 30)
    {
      this.day -= 30;
      this.month++;

      this.fireCallbacks(this.onMonthChange, this.month);
    }
    if (this.month > 12)
    {
      this.month -= 12;
      this.year++;
      
      this.fireCallbacks(this.onYearChange, this.year);
    }
    if (this.day > 30 || this.month > 12)
    {
      this.calculateDate();
    }
    else
    {
      this.updateDate();
    }
  }

  fireCallbacks(targets: { (): any; }[], date: number)
  {
    if (!targets) return;
    for (var i = 0; i < targets.length; i++)
    {
      targets[i].call(date);
    }
  }

  getDate() :IDateObj
  {
    var dateObj =
    {
      year: this.year,
      month: this.month,
      day: this.day
    };
    return dateObj;
  }
  toString()
  {
    return "" + this.day + "." + this.month + "." + this.year;
  }
  updateDate()
  {
    this.dateElem.innerHTML = this.toString();
  }
}
