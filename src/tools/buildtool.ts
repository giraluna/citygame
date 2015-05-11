module CityGame
{
  export module Tools
  {
    export class BuildTool extends Tool
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
  }
}
