/// <reference path="system.ts" />

// This is a seperate system, because even though it should be easier
// with just setinterval theres some weird scope fuckery where blurred
// tabs keep calling the function with outdated values
module CityGame
{
  export module Systems
  {
    export class AutosaveSystem extends System
    {
      constructor(activationRate: number, systemsManager: SystemsManager)
      {
        super(activationRate, systemsManager.tickNumber);
        this.systemsManager = systemsManager;
      }

      activate(currTick: number)
      {
        eventManager.dispatchEvent({type:"autosave", content: ""});
      }
    }
  }
}
