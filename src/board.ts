/// <reference path="js/utility.d.ts" />
/// <reference path="js/mapgeneration.d.ts" />

class Board
{
  width: number;
  height: number;
  cells: any[][];
  constructor(props:
  {
    width: number;
    height?: number;
    savedCells?: any[][];
  })
  {
    this.width = props.width;
    this.height = props.height || props.width;

    var startTime = window.performance.now();

    this.cells = mapGeneration.makeBlankCells(
    {
      width: this.width,
      height: this.height,
    });

    if (props.savedCells)
    {
      mapGeneration.convertCells(this.cells, this);
      mapGeneration.readSavedMap(
      {
        board: this,
        savedCells: props.savedCells
      });
    }
    else
    {

      var coasts = mapGeneration.generateCellNoise(
      {
        width: this.width,
        mapHeight: this.height,
        amountWeights: [1, 0.5, 0.4, 0.3],
        variation: 1,
        yFalloff: 0.07,
        xCutoff: 0.2,
        landThreshhold: 0.45
      });
      mapGeneration.applyCoastsToCells(
      {
        cells: this.cells,
        primaryType: "grass",
        subType: "water",
        coasts: coasts
      });
      var rivers = mapGeneration.makeRivers(
        coasts,
        0.4,
      {
        width: this.width / 6,
        mapHeight: this.height,
        depth: this.height,
        variation: 0.2,
        yFalloff: 0.0001,
        xCutoff: 0.7,
        xFalloff: 0.4,
        xFalloffPerY: 0.2,
        landThreshhold: 0.1
      },
      [this.width / 2 - this.width / 8, 0]);

      if (rivers)
      {
        mapGeneration.applyCoastsToCells(
        {
          cells: this.cells,
          primaryType: "water",
          subType: "grass",
          coasts: rivers
        });
      }
      this.cells = mapGeneration.smoothCells( this.cells, 0.6, 1, 3 );
      this.cells = mapGeneration.smoothCells( this.cells, 0.6, 2, 2 );
      this.cells = mapGeneration.smoothCells( this.cells, 0.7, 3, 1 );
      this.cells = mapGeneration.smoothCells( this.cells, 0.6, 1, 1 );
      mapGeneration.convertCells(this.cells, this);
    }
    
    var elapsed = window.performance.now() - startTime;
    console.log("map gen in " + Math.round(elapsed) + " ms" );  
  }
  
  getCell(arr: number[])
  {
    return this.cells[arr[0]][arr[1]];
  }
  getCells(arr:number[])
  {
    return getFrom2dArray(this.cells, arr);
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
}