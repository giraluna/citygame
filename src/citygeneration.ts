/// <reference path="../data/js/cg.d.ts" />
/// <reference path="js/utility.d.ts" />

module cityGeneration
{
  var typeIndexes: any = {};
  function getIndexedType(typeName: string)
  {
    if (!typeIndexes[typeName])
    {
      typeIndexes[typeName] = findType(typeName);
    }

    return typeIndexes[typeName];
  }

  export function placeMainStation( board, includedArea: number)
  {
    var invertedIncludedArea = 1 - includedArea;
    var horBorder = board.width / 2 * invertedIncludedArea;
    var vertBorder = board.height / 2 * invertedIncludedArea;
    var min = [horBorder, vertBorder];
    var max = [board.width - horBorder, board.height - vertBorder];

    var finalPosition;

    for (var i = 0; i < 100; i++)
    {
      if (finalPosition) break;

      var randX = randInt(min[0], max[0]);
      var randY = randInt(min[1], max[1]);

      var stationType = getIndexedType("smallstation");
      var cell = board.getCell([randX, randY])

      var neighs = cell.getArea(3);

      var hasNeighboringWater = false;

      for (var i = 0; i < neighs.length; i++)
      {
        if (neighs[i].type.type === "water")
        {
          hasNeighboringWater = true;
          break;
        }
      }
      
      if ( !hasNeighboringWater && cell.checkBuildable(stationType))
      {
        finalPosition = [randX, randY];
        cell.changeContent(stationType);
      }
    }

    if (!finalPosition) throw new Error("Couldn't place station");
    else
    {
      cell.changeContent(stationType);
      console.log(cell);
      return finalPosition;
    }

  }
}