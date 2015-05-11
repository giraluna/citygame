/// <reference path="camera.ts" />
/// <reference path="cell.ts" />
/// <reference path="options.ts" />

module CityGame
{
  export class MouseEventHandler
  {
    startPoint: number[];
    currPoint: number[];

    startCell: number[];
    currCell: number[];
    hoverCell: number[];

    currAction: string;
    stashedAction: string;
    selectedCells: Cell[];

    preventingGhost: boolean = false;

    camera: Camera
    constructor()
    {
      var self = this;

      this.currAction = undefined;
      window.oncontextmenu = function(event)
      {
        var eventTarget = <HTMLElement> event.target;
        if (eventTarget.localName !== "canvas") return;
        event.preventDefault();
        event.stopPropagation();
      };

      var _canvas = document.getElementById("pixi-container");
      _canvas.addEventListener("DOMMouseScroll", function(e: any)
      {
        if (e.target.localName !== "canvas") return;
        self.camera.deltaZoom(-e.detail, 0.05);
        game.uiDrawer.clearAllObjects();
      });
      _canvas.addEventListener("mousewheel", function(e: any)
      {
        if (e.target.localName !== "canvas") return;
        self.camera.deltaZoom(e.wheelDelta / 40, 0.05);
        game.uiDrawer.clearAllObjects();
      });
      _canvas.addEventListener("mouseout", function(e: any)
      {
        if (e.target.localName !== "canvas") return;
        game.uiDrawer.removeActive();
      });
    }
    preventGhost(delay: number)
    {
      this.preventingGhost = true;
      var self = this;
      var timeout = window.setTimeout(function()
      {
        self.preventingGhost = false;
        window.clearTimeout(timeout);
      }, delay);
    }
    mouseDown(event, targetType: string)
    {
      game.uiDrawer.removeActive();
      if (event.originalEvent.button === 2 &&
        this.currAction !== undefined &&
        targetType === "stage")
      {
        if (game.activeTool.onFinish)
        {
          game.activeTool.onFinish()
        }

        this.currAction = undefined;
        this.stashedAction = undefined;
        this.startPoint = undefined;
        this.camera.end();
        game.uiDrawer.clearAllObjects();
        game.spriteHighlighter.clearSprites();
        game.updateWorld();
      }
      else if (event.originalEvent.ctrlKey ||
        event.originalEvent.metaKey ||
        (event.originalEvent.button === 1 ||
        event.originalEvent.button === 2) )
      {
        this.startScroll(event);
      }
      /*
      else if (event.originalEvent.shiftKey)
      {
        this.startZoom(event);
      }*/
      else if (targetType === "world")
      {
        this.startCellAction(event);
      }
    }

    mouseMove(event, targetType: string)
    {
      if (targetType === "stage" &&
        (this.currAction === "zoom" || this.currAction === "scroll"))
      {
        this.stageMove(event);
      }
      else if (targetType === "world" && this.currAction === "cellAction")
      {
        this.worldMove(event);
      }
      else if (targetType === "world" && this.currAction === undefined)
      {
        this.hover(event);
      }
    }
    mouseUp(event, targetType: string)
    {

      if (this.currAction === undefined) return;
      else if (targetType === "stage" &&
        (this.currAction === "zoom" || this.currAction === "scroll"))
      {
        this.stageEnd(event);
        this.preventGhost(15);
      }
      else if (targetType === "world" && this.currAction === "cellAction"
        && event.originalEvent.button !== 2  && event.originalEvent.button !== 3)
      {
        if (!this.preventingGhost) this.worldEnd(event);
      }

    }

    startScroll(event)
    {
      if (this.currAction === "cellAction") this.stashedAction = "cellAction";
      this.currAction = "scroll";
      this.startPoint = [event.global.x, event.global.y];
      this.camera.startScroll(this.startPoint);
      game.uiDrawer.clearAllObjects();
    }
    startZoom(event)
    {
      if (this.currAction === "cellAction") this.stashedAction = "cellAction";
      this.currAction = "zoom";
      this.startPoint = this.currPoint = [event.global.x, event.global.y];
      game.uiDrawer.clearAllObjects();
    }
    stageMove(event)
    {
      if (this.currAction === "scroll")
      {
        this.camera.move([event.global.x, event.global.y]);
      }
      else if (this.currAction === "zoom")
      {
        var delta = event.global.x + this.currPoint[1] -
          this.currPoint[0] - event.global.y;
        this.camera.deltaZoom(delta, 0.005);
        this.currPoint = [event.global.x, event.global.y];
      }
    }
    stageEnd(event)
    {
      if (this.currAction === "scroll")
      {
        this.camera.end();
        this.startPoint = undefined;
        this.currAction = this.stashedAction;
        this.stashedAction = undefined;
      }
      if (this.currAction === "zoom")
      {
        this.startPoint = undefined;
        this.currAction = this.stashedAction;
        this.stashedAction = undefined;
      }
    }
    // need to switch to the click event being transferred to
    // rendertexture parent DOC and checked against individual sprites
    // (that have hit masks) to support slopes / variable height
    startCellAction(event)
    {
      var pos = event.getLocalPosition(event.target);
      var gridPos = getOrthoCoord([pos.x, pos.y+7], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

      if (Options.autoSwitchTools)
      {
        game.activeTool.tempContinuous = event.originalEvent.shiftKey;
      }
      else
      {
        game.activeTool.tempContinuous = !event.originalEvent.shiftKey;
      }

      this.currAction = "cellAction";
      this.startCell = gridPos;
      this.currCell = gridPos;

      //this.selectedCells = [game.activeBoard.getCell(gridPos)];
      this.selectedCells = game.activeBoard.getCells(
          game.activeTool.selectType(this.startCell, this.currCell));

      game.spriteHighlighter.clearSprites();
      if (game.activeTool.tintColor !== null)
      {
        game.spriteHighlighter.tintCells(this.selectedCells, game.activeTool.tintColor);
      }
      if (game.activeTool.onHover)
      {
        game.uiDrawer.clearAllObjects();
        game.activeTool.onHover(this.selectedCells)
      }
      game.updateWorld();
    }
    worldMove(event)
    {
      var pos = event.getLocalPosition(event.target);
      var gridPos = getOrthoCoord([pos.x, pos.y+7], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

      if ( !this.currCell || gridPos[0] !== this.currCell[0] || gridPos[1] !== this.currCell[1] )
      {
        this.currCell = gridPos;
        
        this.selectedCells = game.activeBoard.getCells(
            game.activeTool.selectType(this.startCell, this.currCell));
        /*
        this.selectedCells = game.activeBoard.getCell(this.currCell).getArea(
        {
          size: 1,
          centerSize: [4, 5],
          excludeStart: true
        });*/
        game.spriteHighlighter.clearSprites();
        if (game.activeTool.onHover)
        {
          game.uiDrawer.clearAllObjects();
          game.activeTool.onHover(this.selectedCells)
        }
        if (game.activeTool.tintColor !== null)
        {
          game.spriteHighlighter.tintCells(this.selectedCells, game.activeTool.tintColor);
        }
        game.updateWorld();
     }
    }
    worldEnd(event)
    {
      game.activeTool.activate(this.selectedCells);

      if (game.activeTool.onFinish)
      {
        game.activeTool.onFinish()
      }

      game.uiDrawer.clearAllObjects();
      game.spriteHighlighter.clearSprites();
      this.currAction = undefined;
      this.startCell = undefined;
      this.currCell = undefined;
      this.selectedCells = undefined;

      game.updateWorld(true);
    }
    hover(event)
    {
      var pos = event.getLocalPosition(event.target);
      var gridPos = getOrthoCoord([pos.x, pos.y+7], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);
      var currCell = game.activeBoard.getCell(gridPos);
      // TEMPORARY
      if ( (!gridPos) ||
        (gridPos[0] >= TILES || gridPos[1] >= TILES) || 
        (gridPos[0] < 0 || gridPos[1] < 0) )
      {
        game.uiDrawer.removeActive();
        return;
      }

      if (!this.hoverCell) this.hoverCell = gridPos;
      if (gridPos[0] !== this.hoverCell[0] || gridPos[1] !== this.hoverCell[1])
      {
        this.hoverCell = gridPos;
        game.uiDrawer.removeActive();
        game.uiDrawer.clearAllObjects();
        game.uiDrawer.makeCellTooltip(event, currCell, event.target);
        game.uiDrawer.makeBuildingTipsForCell(currCell)
      }
    }

  }
}
