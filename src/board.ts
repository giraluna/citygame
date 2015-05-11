/// <reference path="../lib/pixi.d.ts" />

/// <reference path="utility.ts" />
/// <reference path="idgenerator.ts" />
/// <reference path="cell.ts" />
/// <reference path="sorteddisplaycontainer.ts" />
/// <reference path="mapgeneration.ts" />
/// <reference path="citygeneration.ts" />

module CityGame
{
  export class Board
  {
    id: number;
    name: string;
    width: number;
    height: number;
    totalSize: number;
    cells: Cell[][];
    mapGenInfo: any = {};
    layers: any = {};
    population: number;
    constructor(props:
    {
      width: number;
      height?: number;
      savedCells?: any[][];
      population?: number;
      id?: number;
    })
    {
      this.id = isFinite(props.id) ? props.id : idGenerator.board++;
      this.name = "City " + this.id;

      this.width = props.width;
      this.height = props.height || props.width;

      this.totalSize = this.width * this.height;

      this.initLayers();


      this.population = props.population ||
        randInt(this.totalSize / 15, this.totalSize / 10);

      this.cells = MapGeneration.makeBlankCells(
      {
        width: this.width,
        height: this.height,
      });

      if (props.savedCells)
      {
        MapGeneration.convertCells(this.cells, this, true);
        MapGeneration.readSavedMap(
        {
          board: this,
          savedCells: props.savedCells
        });
      }
      else
      {
        this.generateMap();
        this.generateCity();
      }
    }

    generateMap()
    {
      var startTime = window.performance ? window.performance.now() : Date.now();

      var coasts = this.mapGenInfo.coasts = MapGeneration.generateCellNoise(
      {
        width: this.width,
        mapHeight: this.height,
        amountWeights: [1, 0.5, 0.4, 0],
        variation: 0.5,
        yFalloff: 0.14,
        xCutoff: 0.3,
        xFalloff: 0.1,
        xFalloffPerY: 0.3,
        landThreshhold: 0.4
      });
      MapGeneration.applyCoastsToCells(
      {
        cells: this.cells,
        primaryType: "grass",
        subType: "water",
        coasts: coasts
      });

      var rivers = this.mapGenInfo.rivers = MapGeneration.makeRivers(
        coasts,
        0.7,
      {
        width: this.width / 4,
        mapHeight: this.height,
        depth: this.height,
        variation: 0.000001,
        baseVariation: [0.8, 1],
        yFalloff: 0.00001,
        xCutoff: 0.7,
        xFalloff: 0.6,
        xFalloffPerY: 0.4,
        landThreshhold: 0.2
      },
      [this.width / 2 - this.width / 8, 0]);

      this.cells = MapGeneration.smoothCells( this.cells, 0.6, 1, 4 );
      this.cells = MapGeneration.smoothCells( this.cells, 0.6, 2, 2 );
      this.cells = MapGeneration.smoothCells( this.cells, 0.7, 3, 1 );

      if (rivers)
      {
        MapGeneration.applyCoastsToCells(
        {
          cells: this.cells,
          primaryType: "water",
          subType: "grass",
          coasts: rivers
        });
      }

      this.cells = MapGeneration.smoothCells( this.cells, 0.5, 1, 2 );

      MapGeneration.convertCells(this.cells, this, false);

    
      var finishTime = window.performance ? window.performance.now() : Date.now();
      var elapsed = finishTime - startTime;
      console.log("map gen in " + Math.round(elapsed) + " ms" );  
    }

    generateCity()
    {
      this.mapGenInfo.mainStationPos =
        CityGeneration.placeBuilding(this, "smallstation", 0.4,
        [{flags:["water"], radius: 4}]);
      CityGeneration.placeStationRoads(this);
      CityGeneration.placeMainSubwayLines(this);
      CityGeneration.placeInitialHousing(this);
    }
    
    getCell(toFetch: number[]): Cell
    {
      if (this.cells[toFetch[0]] && this.cells[toFetch[1]])
      {
        return this.cells[toFetch[0]][toFetch[1]];
      }
      else return null;
    }
    getCells(toFetch: number[][]): Cell[]
    {
      return getFrom2dArrayByPosition(this.cells, toFetch);
    }
    destroy()
    {
      for (var i = 0; i < this.cells.length; i++)
      {
        for (var j = 0; j < this.cells[i].length; j++)
        {
          this.cells[i][j] = null;
        }
      }
    }
    initLayers()
    {
      // TODO zoom levels
      for (var i = 1; i <= 1; i++)
      {
        var zoomStr = "zoom" + i;

        var zoomLayer = this.layers[zoomStr] = <any> {};

        zoomLayer["undergroundContent"] = new SortedDisplayObjectContainer(this.totalSize * 2);
        zoomLayer["ground"]  = new PIXI.DisplayObjectContainer();
        zoomLayer["landValueOverlay"] = new PIXI.DisplayObjectContainer();
        zoomLayer["cellOverlay"] = new SortedDisplayObjectContainer(this.totalSize * 2);
        zoomLayer["content"] = new SortedDisplayObjectContainer(this.totalSize * 2);
      }
    }
    addSpriteToLayer(layerToAddTo: string, spriteToAdd: any, gridPos?: number[])
    {
      for (var zoomLevel in this.layers)
      {
        var layer = this.layers[zoomLevel][layerToAddTo];

        if (layer._addChildAt)
        {
          layer._addChildAt(spriteToAdd, gridPos[0] + gridPos[1]);
        }
        else
        {
          layer.addChild(spriteToAdd)
        }
      }
    }
    removeSpriteFromLayer(layerToRemoveFrom: string, spriteToRemove: any, gridPos?: number[])
    {
      for (var zoomLevel in this.layers)
      {
        var layer = this.layers[zoomLevel][layerToRemoveFrom];

        if (layer._removeChildAt)
        {
          layer._removeChildAt(spriteToRemove, gridPos[0] + gridPos[1]);
        }
        else
        {
          layer.removeChild(spriteToRemove)
        }
      }
    }
  }
}
