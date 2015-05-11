module CityGame
{
  export module Systems
  {
    export class DelayedActionSystem extends System
    {
      callbacks: any = {};

      constructor(activationRate: number, systemsManager: SystemsManager)
      {
        super(activationRate, systemsManager.tickNumber);
        this.systemsManager = systemsManager;
        this.addEventListeners();
      }

      addEventListeners()
      {
        var self = this;
        eventManager.addEventListener("delayedAction", function(event)
        {
          var action = event.content;
          action.data.finishedOn = action.data.finishedOn ||
            self.lastTick + action.data.time;

          self.addAction(action);
        });
      }

      addAction(action: any)
      {
        if (!this.callbacks[action.data.finishedOn])
        {
          this.callbacks[action.data.finishedOn] = [];
        }
        this.callbacks[action.data.finishedOn].push(action);
      }

      activate(currTick: number)
      {
        if (this.callbacks[currTick])
        {
          for (var i = 0; i < this.callbacks[currTick].length; i++)
          {
            this.callbacks[currTick][i].onComplete.call();
          }
          this.callbacks[currTick] = null;
          delete this.callbacks[currTick];
        }
      }

      reset()
      {
        this.callbacks = {};
      }
    }
  }
}