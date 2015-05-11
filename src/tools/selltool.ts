/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class SellTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "remove";
        this.selectType = SelectionTypes.rectSelect;
        this.tintColor = 0xFF5555;
        this.mapmode = undefined;
        this.button = null;
      }
      activate(selectedCells: any[])
      {
        var onlySellBuildings = false;

        for (var i = 0; i < selectedCells.length; i++)
        {
          if (selectedCells[i].content && selectedCells[i].player)
          {
            onlySellBuildings = true;
          }
        }

        for (var i = 0; i < selectedCells.length; i++)
        {
          this.onActivate(selectedCells[i], {onlySellBuildings: onlySellBuildings});
        }
      }
      onActivate(target: Cell, props?: any)
      {
        var onlySellBuildings = props.onlySellBuildings;
        var playerOwnsCell = (target.player && target.player.id === game.players["player0"].id);
        if (onlySellBuildings && target.content && playerOwnsCell)
        {
          game.players["player0"].sellContent(target.content);
          target.changeContent("none");
        }
        else if (!onlySellBuildings && playerOwnsCell)
        {
          game.players["player0"].sellCell(target);
        }

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
