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
    var typeIndexes: any = {};

    function getIndexedType(typeName: string)
    {
      if (!typeIndexes[typeName])
      {
        typeIndexes[typeName] = findType(typeName);
      }

      return typeIndexes[typeName];
    }

    for (var i = 0; i < props.board.width; i++)
    {
      for (var j = 0; j < props.board.height; j++)
      {
        var cell = cells[i][j];
        var savedCell = props.savedCells[i][j];



        cell.replace(getIndexedType(savedCell.type));

        if (savedCell.content)
        {
          cell.changeContent(getIndexedType(savedCell.content.type), true,
            savedCell.player);
        }
        if (savedCell.player)
        {
          savedCell.player.addCell(cell);
        }
      }
    }
  }
}