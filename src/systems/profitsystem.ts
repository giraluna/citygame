module CityGame
{
  export module Systems
  {
    export class ProfitSystem extends System
    {
      players: {[key:string]: Player};
      targetTypes: string[];

      constructor(activationRate: number, systemsManager: SystemsManager, players: {[key:string]: Player},
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
        for (var _player in this.players)
        {
          var player = this.players[_player];

          for (var ii = 0; ii < this.targetTypes.length; ii++)
          {
            var profitPerThisType = 0;
            var targets = player.ownedContent[this.targetTypes[ii]];
            
            if (targets.length < 1) continue;

            for (var jj = 0; jj < targets.length; jj++)
            {
              var profit = targets[jj].modifiedProfit;

              // content isn't removed in place
              // which means the array here is the pre-splicing ver
              // which probably makes this whole system pointless
              // 
              // but this check means it doesn't fall apart at least
              if (isFinite(profit)) profitPerThisType += profit;
            }
            player.addMoney(profitPerThisType, this.targetTypes[ii],
              targets.length, currentDate);
          }
        }
      }
    }
  }
}
