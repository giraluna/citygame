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
      mapGeneration.applyCoastsToCells(
        {
          cells: this.cells,
          coastProps:
          {
            amountWeights: [1, 0.7, 0.5, 0.33],
            depth: 7,
            variation: 3,
            falloff: 0.1,
            landThreshhold: 0.6
          }
        });
      this.cells = mapGeneration.smoothCells( this.cells, 0.6, 4 );
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