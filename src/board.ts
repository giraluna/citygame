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

    this.cells = mapGeneration.makeBlankMap(
    {
      width: this.width,
      height: this.height,
      board: this
    });

    if (props.savedCells)
    {
      mapGeneration.readSavedMap(
      {
        board: this,
        savedCells: props.savedCells,
      });
    }
    else
    {
      mapGeneration.applyCoastsToBoard({board: this});
    }
          
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