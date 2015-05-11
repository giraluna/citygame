/// <reference path="landvalueoverlay.ts" />

module CityGame
{
  export class WorldRenderer
  {
    layers: any = {};
    renderTexture: PIXI.RenderTexture;
    worldSprite: PIXI.Sprite;
    zoomLevel: number = ZOOM_LEVELS[0];
    mapmodes =
    {
      default:
      {
        layers:
        [
          {type: "ground"},
          {type: "cellOverlay"},
          {type: "content"}
        ]
      },
      landValue:
      {
        layers:
        [
          {type: "ground"},
          {type: "landValueOverlay", alpha: 0.7},
          {type: "cellOverlay"},
          {type: "content"}
        ]
      },
      underground:
      {
        layers:
        [
          {type: "underground"},
          {type: "undergroundContent"},
          {type: "ground", alpha: 0.15}
        ],
        properties:
        {
          offsetY: 32
        }
      }
    };
    currentMapmode: string = "default";
    
    constructor(width, height)
    {
      this.initContainers(width, height);
      this.initLayers();
      this.addEventListeners();
    }

    addEventListeners()
    {
      var self = this;
      eventManager.addEventListener("changeZoomLevel", function(event)
      {
        self.changeZoomLevel(event.content.zoomLevel);
      });
      eventManager.addEventListener("updateWorld", function(event)
      {
        self.render(event.content.clear);
      });

      var mapmodeSelect = <HTMLInputElement> document.getElementById("mapmode-select");
      mapmodeSelect.addEventListener("change", function(event)
      {
        self.setMapmode(mapmodeSelect.value);
      });

      eventManager.addEventListener("changeMapmode", function(event)
      {
        self.setMapmode(event.content);
        mapmodeSelect.value = event.content;
      });
      eventManager.addEventListener("updateLandValueMapmode", function (event)
      {
        if (self.currentMapmode !== "landValue") return;

        var zoomLayer = self.layers["zoom" + self.zoomLevel];
        zoomLayer.landValueOverlay = makeLandValueOverlay(game.activeBoard);
        self.changeMapmode("landValue");
      });
    }
    initContainers(width, height)
    {
      this.renderTexture = new PIXI.RenderTexture(width, height, game.renderer, PIXI.scaleModes.NEAREST);
      
      var _ws = this.worldSprite = new PIXI.Sprite(this.renderTexture);

      _ws.hitArea = arrayToPolygon(rectToIso(_ws.width, _ws.height));
      _ws.interactive = true;


      for (var i = 0; i < ZOOM_LEVELS.length; i++)
      {
        var zoomStr = "zoom" + ZOOM_LEVELS[i];
        var zoomLayer = this.layers[zoomStr] = {};
        this.mapmodes[zoomStr] = {};

        var main = zoomLayer["main"] = new PIXI.DisplayObjectContainer();
      }

      var self = this;
      _ws.mousedown = _ws.touchstart = function(event)
      {
        game.mouseEventHandler.mouseDown(event, "world");
      }
      _ws.mousemove = _ws.touchmove = function(event)
      {
        game.mouseEventHandler.mouseMove(event, "world");
      }

      _ws.mouseup = _ws.touchend = function(event)
      {
        game.mouseEventHandler.mouseUp(event, "world");
      }
      _ws.mouseupoutside = _ws.touchendoutside = function(event)
      {
        game.mouseEventHandler.mouseUp(event, "world");
      }
    }
    initLayers()
    {
      for (var i = 0; i < ZOOM_LEVELS.length; i++)
      {
        var zoomStr = "zoom" + ZOOM_LEVELS[i];
        var zoomLayer = this.layers[zoomStr];
        var main = zoomLayer["main"];

        zoomLayer["underground"] = new PIXI.DisplayObjectContainer();
        zoomLayer["undergroundContent"] = new PIXI.DisplayObjectContainer();
        zoomLayer["ground"]  = new PIXI.DisplayObjectContainer();
        zoomLayer["landValueOverlay"] = new PIXI.DisplayObjectContainer();
        zoomLayer["cellOverlay"] = new PIXI.DisplayObjectContainer();
        zoomLayer["content"] = new PIXI.DisplayObjectContainer();
      }

    }
    clearLayers()
    {
      for (var i = 0; i < ZOOM_LEVELS.length; i++)
      {
        var zoomStr = "zoom" + ZOOM_LEVELS[i];
        var zoomLayer = this.layers[zoomStr];
        var main = zoomLayer["main"];

        for (var layer in zoomLayer)
        {
          if (zoomLayer[layer].children.length > 0)
          {
            zoomLayer[layer].removeChildren();
          }
        }
        
        if(main.children.length > 0) main.removeChildren();
      }
      //this.currentMapmode = undefined;
    }
    setBoard(board: Board)
    {
      this.clearLayers();

      for (var zoomLevel in board.layers)
      {
        for (var layer in board.layers[zoomLevel])
        {
          this.layers[zoomLevel][layer].addChild(board.layers[zoomLevel][layer]);
        }
      }

      this.setMapmode(this.currentMapmode);
    }
    changeZoomLevel(level)
    {
      this.zoomLevel = level;
      this.render();
    }
    setMapmode(newMapmode: string)
    {
      var zoomLayer = this.layers["zoom" + this.zoomLevel];
      switch (newMapmode)
      {
        case "default":
        case "terrain":
        {
          this.changeMapmode("default");
          return;
        }
        case "landValue":
        {
          zoomLayer.landValueOverlay = makeLandValueOverlay(game.activeBoard);

          this.changeMapmode("landValue");
          return;
        }
        case "underground":
        {
          if (zoomLayer.underground.children <= 0)
          {
            for (var i = 0; i < zoomLayer.ground.children[0].children.length; i++)
            {
              var currSprite = zoomLayer.ground.children[0].children[i];

              var _s = PIXI.Sprite.fromFrame("underground.png");
              _s.position = currSprite.position.clone();
              _s.anchor = currSprite.anchor.clone();
              zoomLayer.underground.addChild(_s);
            }
          }
          this.changeMapmode("underground");
          return;
        }
      }
    }
    changeMapmode(newMapmode: string)
    {
      var zoomStr = "zoom" + this.zoomLevel;
      var zoomLayer = this.layers[zoomStr];

      if (zoomLayer.main.children.length > 0)
      {
        zoomLayer.main.removeChildren();
      }
      
      for (var i = 0; i < this.mapmodes[newMapmode].layers.length; i++)
      {
        var layerToAdd = this.mapmodes[newMapmode].layers[i];
        zoomLayer.main.addChild(zoomLayer[layerToAdd.type]);

        zoomLayer[layerToAdd.type].alpha = layerToAdd.alpha || 1;
      }

      var props = this.mapmodes[newMapmode].properties || {};
      
      this.worldSprite.y = props.offsetY || 0;
      
      this.currentMapmode = newMapmode;
      this.render();
    }
    render(clear: boolean = true)
    {
      var zoomStr = "zoom" + this.zoomLevel;
      var activeMainLayer = this.layers[zoomStr]["main"]
      this.renderTexture.render(activeMainLayer, null, clear);
    }
  }
}
