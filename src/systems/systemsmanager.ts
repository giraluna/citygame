/// <reference path="../timer.ts" />

/// <reference path="system.ts" />
/// <reference path="autosavesystem.ts" />
/// <reference path="datesystem.ts" />
/// <reference path="delayedactionsystem.ts" />
/// <reference path="profitsystem.ts" />

module CityGame
{
  /**
    * @class SystemsManager
    * @classdesc
    *
    * @param    tickTime    {number}    
    *
    * @property systems     List of systems registered with this
    * @property timer      
    * @property tickTime    Amount of time for single tick in ms
    * @property tickNumber  Counter for total ticks so far
    * @property accumulated Amount of time banked towards next tick
    * 
    */
  export class SystemsManager
  {
    systems:
    {
      dailyProfitSystem: Systems.ProfitSystem;
      delayedAction: Systems.DelayedActionSystem;
      autosave: Systems.AutosaveSystem;
      date: Systems.DateSystem;
    };
    timer: Timer;
    tickTime: number;
    tickNumber: number = 0;
    accumulated: number = 0;
    paused: boolean = false;
    speed: number = 1;
    speedBeforePausing: number;

    constructor(tickTime: number, players: Player[])
    {
      this.timer = new Timer();
      this.tickTime = tickTime / 1000;

      this.init(players);
    }
    init(players: Player[])
    {
      this.addEventListeners();
      this.makeSystems(players);
    }
    makeSystems(players: Player[])
    {
      this.systems =
      {
        dailyProfitSystem: new Systems.ProfitSystem(1, this, players,
          ["fastfood", "shopping", "parking", "factory", "hotel", "apartment", "office"]),
        delayedAction: new Systems.DelayedActionSystem(1, this),
        autosave: new Systems.AutosaveSystem(60, this),
        date: new Systems.DateSystem(1, this,
          document.getElementById("date"))
      }
      /*
      var monthlyProfitSystem = new Systems.ProfitSystem(30, this, players,
        ["apartment"]);
      var quarterlyProfitSystem = new Systems.ProfitSystem(90, this, players,
        ["office"]);
      this.addSystem("monthlyProfitSystem", monthlyProfitSystem);
      this.addSystem("quarterlyProfitSystem", quarterlyProfitSystem);
      */
    }
    addEventListeners()
    {
      var self = this;
      var slider = <HTMLInputElement> document.getElementById("speed-control");

      eventManager.addEventListener("togglePause", function(event)
      {
        self.togglePause();
      });
      eventManager.addEventListener("incrementSpeed", function(event)
      {
        self.setSpeed(self.speed + 1);
      });
      eventManager.addEventListener("decrementSpeed", function(event)
      {
        self.setSpeed(self.speed - 1);
      });

      slider.addEventListener("change", function(event)
      {
        if (slider.value === "0")
        {
          self.pause();
        }
        else
        {
          self.setSpeed(parseInt(slider.value));
        }
      });
    }
    pause()
    {
      this.speedBeforePausing = this.speed;
      this.speed = 0;
      this.timer.stop();
      this.paused = true;
      var slider = <HTMLInputElement> document.getElementById("speed-control");
      slider.value = "0";
    }
    unPause(newSpeed?: number)
    {
      this.timer.start();
      this.paused = false;

      if (newSpeed) this.setSpeed(newSpeed);
    }
    togglePause()
    {
      if (this.paused) this.unPause(this.speedBeforePausing);
      else this.pause();
    }
    setSpeed(speed: number)
    {
      var slider = <HTMLInputElement> document.getElementById("speed-control");
      if (speed <= 0)
      {
        this.pause();
        return;
      }
      else if (speed > parseInt(slider.max)) return;

      if (this.paused) this.unPause();

      var speed = this.speed = Math.round(speed);
      var adjustedSpeed = Math.pow(speed, 2);

      this.tickTime = 1 / adjustedSpeed;
      this.accumulated = this.accumulated / adjustedSpeed;
      slider.value = "" + speed;
    }
    update()
    {
      if (this.paused) return;
      this.accumulated += this.timer.getDelta();
      while (this.accumulated >= this.tickTime)
      {
        this.tick();
      }
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
  }
}
