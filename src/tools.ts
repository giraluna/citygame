/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    class WaterTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "water";
        this.selectType = rectSelect;
        this.tintColor = 0x4444FF;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.replace( cg["terrain"]["water"] );
      }
    }

    class GrassTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "grass";
        this.selectType = rectSelect;
        this.tintColor = 0x617A4E;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.replace( cg["terrain"]["grass"] );
      }
    }

    class SandTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "sand";
        this.selectType = rectSelect;
        this.tintColor = 0xE2BF93;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.replace( cg["terrain"]["sand"] );
      }
    }

    class SnowTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "snow";
        this.selectType = rectSelect;
        this.tintColor = 0xBBDFD7;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.replace( cg["terrain"]["snow"] );
      }
    }
    class RemoveTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "remove";
        this.selectType = rectSelect;
        this.tintColor = 0xFF5555;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        if (game.worldRenderer.currentMapmode !== "underground")
        {
          target.changeContent("none");
        }
        else
        {
          target.changeUndergroundContent();
        }
      }
    }

    class SellTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "remove";
        this.selectType = rectSelect;
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
        var playerOwnsCell = (target.player && target.player.id === game.players.player0.id);
        if (onlySellBuildings && target.content && playerOwnsCell)
        {
          game.players.player0.sellContent(target.content);
          target.changeContent("none");
        }
        else if (!onlySellBuildings && playerOwnsCell)
        {
          game.players.player0.sellCell(target);
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

    class PlantTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "plant";
        this.selectType = rectSelect;
        this.tintColor = 0x338833;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.addPlant();
      }
    }

    class HouseTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "house";
        this.selectType = rectSelect;
        this.tintColor = 0x696969;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        // TODO
        var toChange;
        while (true)
        {
          toChange = getRandomProperty(cg["content"]["buildings"]);
          //toChange = cg.content.buildings.bigoffice;
          if (toChange.categoryType && toChange.categoryType === "apartment")
          {
            break;
          }
        }

        target.changeContent( toChange );
      }
    }
    class RoadTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "road";
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
      } 
      onActivate(target: Cell)
      {
        target.changeContent( cg["content"]["roads"]["road_nesw"] );
      }
    }
    class SubwayTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "subway";
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
        this.mapmode = "underground";
      }
      onActivate(target: Cell)
      {
        target.changeUndergroundContent( cg["content"]["tubes"]["tube_nesw"] );
      }
    }

    class BuyTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "buy";
        this.selectType = singleSelect;
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

    class BuildTool extends Tool
    {
      selectedBuildingType: any;
      canBuild: boolean;
      mainCell: Cell;
      continuous: boolean;
      timesTriedToBuiltOnNonOwnedPlot: number = 0;
      ghostSprites:
      {
        sprite: PIXI.Sprite;
        pos: number[];
      }[] = [];

      constructor()
      {
        super();
        this.type = "build";
        this.mapmode = undefined;
        this.button = null;

        this.setDefaults();
      }
      setDefaults()
      {
        this.selectedBuildingType = undefined;
        this.selectType = singleSelect;
        this.tintColor = 0xFFFFFF;
        this.canBuild = false;
        this.mainCell = undefined;
        this.continuous = false;
        eventManager.dispatchEvent(
        {
          type: "clickHotkey",
          content: ""
        });
      }
      changeBuilding(buildingType, continuous:boolean = false)
      {
        if (Options.autoSwitchTools)
        {
          this.continuous = continuous;
        }
        else this.continuous = !continuous;

        if (this.selectedBuildingType === buildingType) return;

        this.selectedBuildingType = buildingType;
        var size = buildingType.size || [1,1];

        this.selectType = function(a, b)
        {
          var start = game.activeBoard.getCell(b);

          if (!start) return b;
          else
          {
            this.mainCell = start;
          }

          var buildable = start.checkBuildable(
            this.selectedBuildingType, game.players.player0);

          if (buildable)
          {
            this.tintColor = 0x338833;
            this.canBuild = true;
          }
          else
          {
            this.tintColor = 0xFF5555;
            this.canBuild = false;
          }
          return rectSelect(b, [b[0]+size[0]-1,b[1]+size[1]-1]);
        }.bind(this);
      }

      activate(selectedCells: any[])
      {
        if (this.canBuild === true)
        {
          var cost = game.players.player0.getBuildCost(this.selectedBuildingType);
          if (game.players.player0.money >= cost)
          {
            eventManager.dispatchEvent(
            {
              type: "makeBuildingConstructPopup",
              content:
              {
                player: game.players.player0,
                buildingTemplate: this.selectedBuildingType,
                cell: this.mainCell,
                onOk: ( this.continuous || this.tempContinuous ?
                  function(){return;} : this.setDefaults.bind(this) )
              }
            });
          }
          else
          {
            eventManager.dispatchEvent(
            {
              type: "makeInfoPopup",
              content:
              {
                text: "Not enough funds"
              }
            })
          };
        }
        else if ( !selectedCells[0].player ||
          selectedCells[0].player.id !== game.players.player0.id)
        {
          /*
          this.timesTriedToBuiltOnNonOwnedPlot++;
          if (this.timesTriedToBuiltOnNonOwnedPlot <= 3 )
          {
            eventManager.dispatchEvent(
            {
              type: "makeInfoPopup",
              content:
              {
                text: "You need to purchase that plot first"
              }
            })
          }
          */
          for (var i = 0; i < selectedCells.length; i++)
          {
            eventManager.dispatchEvent({type: "makeCellBuyPopup", content:
              {
                player: game.players["player0"],
                cell: selectedCells[i],
                onOk: ( this.continuous || this.tempContinuous ?
                  function(){return;} : this.setDefaults.bind(this) )
              }
            });
          }
        }

        this.onFinish();
      }
      onHover(targets: Cell[])
      {
        var baseCell = targets[0];
        if (!baseCell) return;

        var _b = baseCell.gridPos
        var size = this.selectedBuildingType.size || [1,1];
        var buildArea = baseCell.board.getCells(
          rectSelect(_b, [_b[0]+size[0]-1,_b[1]+size[1]-1]));
        var belowBuildArea = getArea(
        {
          targetArray: baseCell.board.cells,
          start: _b,
          centerSize: size,
          size: 2,
          anchor: "nw"
        });

        this.clearEffects();

        for (var i = 0; i < belowBuildArea.length; i++)
        {
          game.highlighter.alphaBuildings(belowBuildArea, 0.2);
        }

        if (!baseCell.content)
        {
          for (var i = 0; i < buildArea.length; i++)
          {
            var _cell = buildArea[i];
            if (_cell.content)
            {
              this.clearGhostBuilding();
              break;
            }
            var _s = new Sprite( this.selectedBuildingType, i );
            _s.alpha = 0.6;
            this.ghostSprites.push(
            {
              sprite: _s,
              pos: _cell.gridPos
            });

            _s.position = _cell.board.getCell(_cell.gridPos).sprite.position.clone();

            if (_cell.type.type !== "water")
            {
              _s.position.y -= (_cell.sprite.height - SPRITE_HEIGHT);
            }

            _cell.board.addSpriteToLayer("content", _s, _cell.gridPos);
          }
        }


        var effects: any =
        {
          positive: [],
          negative: []
        };

        for (var i = 0; i < this.selectedBuildingType.translatedEffects.length; i++)
        {
          var modifier = this.selectedBuildingType.translatedEffects[i];
          var categoryType = this.selectedBuildingType.categoryType
          var effectedCells = baseCell.getArea(
          {
            size: modifier.range,
            centerSize: modifier.center,
            excludeStart: true
          });

          for (var _cell in effectedCells)
          {
            var cell = effectedCells[_cell];

            var polarity = cell.getModifierPolarity(modifier);

            if (polarity === null) continue;
            else
            {
              var type = (polarity === true ? "positive1" : "negative1");
              var cells = cell.content ? cell.content.cells : cell;
              for (var j = 0; j < cells.length; j++)
              {
                game.uiDrawer.makeBuildingPlacementTip(cells[j], type,
                  game.worldRenderer.worldSprite);
              }
            }
          }
        }

        game.uiDrawer.makeBuildingTips(buildArea, this.selectedBuildingType);
      }
      onFinish()
      {
        this.clearEffects();
        this.mainCell = undefined;
      }
      clearEffects()
      {
        game.highlighter.clearAlpha();
        this.clearGhostBuilding();
      }
      clearGhostBuilding()
      {
        for (var i = 0; i < this.ghostSprites.length; i++)
        {
          var _s = this.ghostSprites[i].sprite;
          var _pos = this.ghostSprites[i].pos;
          this.mainCell.board.removeSpriteFromLayer("content", _s, _pos);
        }
        this.ghostSprites = [];
      }
    }

    class ClickTool extends Tool
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

    class NothingTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "nothing";
        this.selectType = singleSelect;
        this.tintColor = null;
        this.mapmode = undefined;
        this.button = null;
      }
      onActivate(target: Cell)
      {
      }
    }
  }
}