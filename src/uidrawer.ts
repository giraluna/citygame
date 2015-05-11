/// <reference path="../lib/pixi.d.ts" />
/// <reference path="uiobject.ts" />
/// <reference path="uidrawingfunctions.ts" />

module CityGame
{
  export interface IFontDefinition
  {
    font: string;
    fill: string; //hex color string
    align: string;
    stroke?: string; //hex color string
    strokeThickness?: number;
  }
  export class UIDrawer
  {
    layer: PIXI.DisplayObjectContainer;
    fonts:
    {
      [fontName: string]: IFontDefinition;
    };
    styles: any = {};
    textureCache: any = {};
    active: UIObject;
    permanentUIObjects: UIObject[] = [];
    buildingTipTimeOut: any;

    constructor()
    {
      this.layer = game.layers["tooltips"];
      this.init();
    }
    init()
    {
      this.fonts =
      {
        base:
        {
          font: "16px Arial",
          fill: "#444444",
          align: "left"
        },
        black:
        {
          font: "bold 20pt Arial",
          fill: "#000000",
          align: "left"
        },
        green:
        {
          font: "bold 20pt Arial",
          fill: "#00FF00",
          stroke: "#005500",
          strokeThickness: 2,
          align: "left"
        },
        red:
        {
          font: "bold 20pt Arial",
          fill: "#FF0000",
          stroke: "#550000",
          strokeThickness: 2,
          align: "left"
        }
      }
      this.styles["base"] =
      {
        lineStyle:
        {
          width: 2,
          color: 0x587982,
          alpha: 1
        },
        fillStyle:
        {
          color: 0xE8FBFF,
          alpha: 0.8
        }
      };

      this.textureCache =
      {
        buildingPlacement:
        {
          positive1: PIXI.Texture.fromCanvas(
            new PIXI.Text("+", this.fonts["green"]).canvas),
          negative1: PIXI.Texture.fromCanvas(
            new PIXI.Text("-", this.fonts["red"]).canvas)
        }
      };

    }
    removeActive()
    {
      if (this.active)
      {
        this.active.remove();
        this.active = undefined;
      }
    }
    clearAllObjects()
    {
      for (var i = 0; i < this.permanentUIObjects.length; i++)
      {
        this.permanentUIObjects[i].remove();

      }
      this.permanentUIObjects = [];

      this.removeActive();
    }

    makeCellTooltip( event, cell: Cell, container: PIXI.DisplayObjectContainer )
    {
      var screenPos = cell.getScreenPos(container);
      var cellX = screenPos[0];
      var cellY = screenPos[1];

      var screenX = event.global.x;
      var screenY = event.global.y;

      var text = cell.content ? cell.content.type.title || cell.content.type.type : cell.type["type"];

      if (game.worldRenderer.currentMapmode === "landValue")
      {
        text += "\nLand value: " + cell.landValue;
        text += "\nApproximate cost: " + game.players["player0"].getCellBuyCost(cell);
      }
      /*
      else
      {
        for (var modifier in cell.modifiers)
        {
          var _mod = cell.modifiers[modifier];
          text += "\n--------------\n";
          text += "Modifier: " + _mod.title + "\n";
          text += "Strength: " + _mod.strength + "\n";
          text += "Adj strength: " + _mod.scaling(_mod.strength).toFixed(3);
        }
      }*/

      if (cell.content && cell.content.player && cell.content.baseProfit)
      {
        var finalAmount = game.players["player0"].getIndexedProfit(
          cell.content.type.categoryType, cell.content.modifiedProfit).toFixed(2);
        text += "\n--------------\n";
        text += "Base profit: " + cell.content.baseProfit.toFixed(2) + "/d" + "\n";
        text += "-------\n";
        for (var modifier in cell.content.modifiers)
        {
          var _mod = cell.content.modifiers[modifier];
          if (_mod.scaling(_mod.strength) > 0)
          {
            text += "Modifier: " + _mod.title +" "+ _mod.scaling(_mod.strength).toFixed(2) + "\n";
          }
        }
        if (Object.keys(cell.content.modifiers).length > 0) text += "-------\n";
        text += "Final profit: " + finalAmount + "/d";
      }

      var font = this.fonts["base"];

      var textObject = new PIXI.Text(text, font);

      var tipDir, tipPos;

      // change slant of the tip based on screen position
      // 100 pix buffer is arbitrary for now
      if (screenX + textObject.width + 100 > SCREEN_WIDTH)
      {
        tipDir = "left"; tipPos = 0.75;
      }
      else
      {
        tipDir = "right"; tipPos = 0.25;
      }
      // same for vertical pos
      var pointing = (screenY - textObject.height - 100 < 0) ? "up" : "down";

      var x = cellX;
      var y = (cell.content && pointing === "down")
        ? cellY - cell.content.sprites[0].height * cell.content.sprites[0].worldTransform.a / 2
        : cellY;

      var uiObj = this.active = new UIObject(this.layer)
      .delay( 1000 )
      .lifeTime( -1 );

      var toolTip = makeToolTip(
        {
          style: this.styles["base"],
          autoSize: true,
          tipPos: tipPos,
          tipWidth: 10,
          tipHeight: 20,
          tipDir: tipDir,
          pointing: pointing,
          padding: [10, 10]
        }, 
        textObject
        );
      uiObj.position.set(Math.round(x), Math.round(y - (cell.sprite.height - SPRITE_HEIGHT)));

      uiObj.addChild(toolTip);
      uiObj.start();

      return uiObj;
    }
    makeCellPopup(cell: Cell, text: string, container: PIXI.DisplayObjectContainer,
      fontName:string = "black")
    {
      var pos = cell.getScreenPos(container);
      pos[1] -= 32;
      var content = new PIXI.Text(text, this.fonts[fontName]);

      this.makeFadeyPopup([pos[0], pos[1]], [0, -20], 2000, content);
    }
    makeBuildingTipsForCell(baseCell: Cell, delay:number = 0)
    {
      if (this.buildingTipTimeOut)
      {
        window.clearTimeout(this.buildingTipTimeOut);
      }

      if (!baseCell.content || !baseCell.content.player) return

      var self = this;
      this.buildingTipTimeOut = window.setTimeout(function()
      {
        self.makeBuildingTips(baseCell.content.cells, baseCell.content.type);
      }, delay)
    }
    makeBuildingTips(buildArea: Cell[], buildingType: any)
    {
      var toDrawOn: any =
      {
        positive1: [],
        negative1: []
      }

      for (var i = 0; i < buildArea.length; i++)
      {
        var currentModifiers = buildArea[i].getValidModifiers(buildingType);
        for (var _mod in currentModifiers)
        {
          if (currentModifiers[_mod].scaling(currentModifiers[_mod].strength) <= 0) continue;
          var sources = currentModifiers[_mod].sources;
          var _polarity = currentModifiers[_mod].effect[
            Object.keys(currentModifiers[_mod].effect)[0]] > 0;

          var type = (_polarity === true ? "positive1" : "negative1");
          for (var j = 0; j < sources.length; j++)
          {
            //toDrawOn[type][sources[j].gridPos] = sources[j];
            if (sources[j].content)
            {
              toDrawOn[type] = toDrawOn[type].concat( sources[j].content.cells );
            }
            else
            {
              toDrawOn[type].push(sources[j]);
            }
          }
        }
      }
      for (var _type in toDrawOn)
      {
        for (var i = 0; i < toDrawOn[_type].length; i++)
        {
          this.makeBuildingPlacementTip(toDrawOn[_type][i], _type,
            game.worldRenderer.worldSprite);
        }
      }
    }
    makeBuildingPlacementTip(cell: Cell, type: string, container: PIXI.DisplayObjectContainer)
    {
      var pos = cell.getScreenPos(container);
      var content = new PIXI.Sprite(this.textureCache.buildingPlacement[type]);

      var uiObj = new UIObject(this.layer, false);
      uiObj.position.set(pos[0], pos[1] - 10);

      uiObj.addChild(content);
      if (content.width)
      {
        content.position.x -= content.width / 2;
        content.position.y -= content.height / 2;
      }

      uiObj.start();

      this.permanentUIObjects.push(uiObj);
    }
    makeFadeyPopup(pos: number[], drift: number[], lifeTime: number, content,
      easing = TWEEN.Easing.Linear.None)
    {
      var tween = new TWEEN.Tween(
        {
          alpha: 1,
          x: pos[0],
          y: pos[1]
          });
      tween.easing(easing);
      

      var uiObj = new UIObject(this.layer)
      .lifeTime(lifeTime)
      .onAdded(function()
      {
        tween.start();
        })
      .onComplete(function()
      {
        TWEEN.remove(tween);
        });

      tween.to(
        {
          alpha: 0,
          x: pos[0] + drift[0],
          y: pos[1] + drift[1]
        }
          , lifeTime)
      .onUpdate(function()
      {
        uiObj.alpha = this.alpha;
        uiObj.position.set(this.x, this.y);
        });

      uiObj.position.set(pos[0], pos[1]);

      if (content.width)
      {
        content.position.x -= content.width / 2;
        content.position.y -= content.height / 2;
      }

      uiObj.addChild(content);

      uiObj.start();
      return uiObj;
    }

    clearLayer()
    {
      for (var i = this.layer.children.length - 1; i >= 0; i--)
      {
        this.layer.removeChild(this.layer.children[i]);
      }
    }
  }
}
