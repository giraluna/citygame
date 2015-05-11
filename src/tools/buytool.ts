/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class BuyTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "buy";
        this.selectType = SelectionTypes.singleSelect;
        this.tintColor = 0x22EE22;
        this.mapmode = undefined;
      }
      onActivate(target: Cell)
      {
        eventManager.dispatchEvent({type: "makeCellBuyPopup", content:
          {
            player: game.players["player0"],
            cell: target
          }
        });
        if (!this.continuous && !this.tempContinuous)
        {
          eventManager.dispatchEvent(
          {
            type: "clickHotkey",
            content: ""
          });
        }
      }
    }
  }
}
