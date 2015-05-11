/// <reference path="system.ts" />

module CityGame
{
  export module Systems
  {
    export class ProfitSystem extends System
    {
      players: Player[];
      targetTypes: string[];

      constructor(activationRate: number, systemsManager: SystemsManager, players: Player[],
        targetTypes: string[])
      {
        super(activationRate, systemsManager.tickNumber);
        this.systemsManager = systemsManager;
        this.players = players;
        this.targetTypes = targetTypes;
      }

      activate()
      {
        var currentDate = this.systemsManager.systems.date.getDate();
        for (var i = 0; i < this.players.length; i++)
        {
          var player = this.players[i];

          for (var j = 0; j < this.targetTypes.length; j++)
          {
            var profitPerThisType = 0;
            var targets = player.ownedContent[this.targetTypes[j]];
            
            if (targets.length < 1) continue;

            for (var k = 0; k < targets.length; k++)
            {
              var profit = targets[k].modifiedProfit;

              // content isn't removed in place
              // which means the array here is the pre-splicing ver
              // which probably makes this whole system pointless
              // 
              // but this check means it doesn't fall apart at least
              if (isFinite(profit)) profitPerThisType += profit;
            }
            player.addMoney(profitPerThisType, this.targetTypes[j],
              targets.length, currentDate);
          }
        }
      }
    }
  }
}
