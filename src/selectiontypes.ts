module CityGame
{
  export interface ISelectionType
  {
    (startPoint: number[], endPoint: number[]): number[][];
  }

  export module SelectionTypes
  {
    export function singleSelect(a: number[], b: number[]): number[][]
    {
      return [b];
    }

    export function rectSelect(a: number[], b: number[]): number[][]
    {
      var cells = [];
      var xLen = Math.abs(a[0] - b[0]);
      var yLen = Math.abs(a[1] - b[1]);
      var xDir = (b[0] < a[0]) ? -1 : 1;
      var yDir = (b[1] < a[1]) ? -1 : 1;
      var x,y;
      for (var i = 0; i <= xLen; i++)
      {
        x = a[0] + i * xDir;
        for (var j = 0; j <= yLen; j++)
        {
          y = a[1] + j * yDir;
          cells.push([x,y]);
        }
      }
      return cells;
    }

    export function manhattanSelect(a: number[], b: number[]): number[][]
    {
      var xLen = Math.abs(a[0] - b[0]);
      var yLen = Math.abs(a[1] - b[1]);
      var xDir = (b[0] < a[0]) ? -1 : 1;
      var yDir = (b[1] < a[1]) ? -1 : 1;
      var y, x;
      var cells = [];
      if (xLen >= yLen)
      {
        for (var i = 0; i <= xLen; i++)
        {
          x = a[0] + i * xDir;
          cells.push([x, a[1]]);
        }
        for (var j = 1; j <= yLen; j++)
        {
          y = a[1] + j * yDir;
          cells.push([b[0], y]);
        }
      }
      else
      {
        for (var j = 0; j <= yLen; j++)
        {
          y = a[1] + j * yDir;
          cells.push([a[0], y]);
        }
        for (var i = 1; i <= xLen; i++)
        {
          x = a[0] + i * xDir;
          cells.push([x, b[1]]);
        }
      }
      return cells;
    }
  }
}
