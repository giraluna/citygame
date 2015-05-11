module CityGame
{
  export class System
  {
    systemsManager: SystemsManager;
    activationRate: number;
    lastTick: number;
    nextTick: number;

    activate(any){}

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

      if (currTick >= this.nextTick)
      {
        // do something
        this.activate(currTick);
        
        this.updateTicks(currTick);
      }
    }
  }
}
