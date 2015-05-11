/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class ClickTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "click";
        this.selectType = singleSelect;
        this.tintColor = null;
        this.mapmode = undefined;
        this.button = null;
      }
      onChange()
      {
        if (game.players.player0.clicks < 1)
        {
          var textContainer = new PIXI.DisplayObjectContainer();
          var bigText = new PIXI.Text("Click here!",
          {
            font: "bold 50px Arial",
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 6,
            align: "center"
          });
          var smallText = new PIXI.Text("Click on buildings you own for extra income",
          {
            font: "bold 30px Arial",
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 4,
            align: "center"
          });
          textContainer.addChild(bigText);
          bigText.position.x -= bigText.width/2;
          textContainer.addChild(smallText);
          smallText.position.x -= smallText.width/2;
          smallText.position.y += bigText.height;
          textContainer.position.y -= bigText.height;

          game.uiDrawer.makeFadeyPopup(
            [SCREEN_WIDTH / 2, SCREEN_HEIGHT/2],
            [0, 0],
            3000,
            textContainer,
            TWEEN.Easing.Quartic.In
          )
        }
      }
      onActivate(target: Cell)
      {
        var player = game.players.player0;
        var baseAmount = 0;

        if (target.content && target.content.player &&
          target.content.player.id === player.id)
        {
          baseAmount += player.getIndexedProfitWithoutGlobals(
            target.content.type.categoryType, target.content.modifiedProfit) * 0.25;
        }

        var finalAmount = player.addMoney(baseAmount, "click");
        player.addClicks(1);

        if (Options.drawClickPopups)
        {
          game.uiDrawer.makeCellPopup(target, "" +
            finalAmount.toFixed(3), game.worldRenderer.worldSprite);
        }
      }
    }
  }
}
