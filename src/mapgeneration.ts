/// <reference path="../data/js/cg.d.ts" />

/**
 * add base land value
 * add random modifier of land value to tiles
 * create water
 *   coasts
 *     amount
 *     directions
 *     types
 *       coast
 *       bay
 *       broken
 *       
 *       
 */

module mapGeneration
{
  export function makeBlankMap(props:
  {
    width: number;
    height?: number;
    board: any;
  })
  {
    props.height = props.height || props.width;

    var cells: any[] = [];
    // TODO circular reference
    var _: any = window;
    var Cell = _.Cell;

    for (var i = 0; i < props.width; i++)
    {
      cells[i] = [];
      for (var j = 0; j < props.height; j++)
      {
        cells[i][j] = new Cell([i, j], cg["terrain"]["grass"], props.board);
      }
    }

    return cells;
  }

  export function readSavedMap(props:
  {
    board: any
    savedCells: any;
  })
  {
    var cells = props.board.cells;
    for (var i = 0; i < props.board.width; i++)
    {
      for (var j = 0; j < props.board.height; j++)
      {
        cells[i][j].replace(props.savedCells[i][j].type);

        if (props.savedCells[i][j].content)
        {
          cells[i][j].changeContent(props.savedCells[i][j].content.type, true,
            props.savedCells[i][j].content.player);
        }
      }
    }
  }
}