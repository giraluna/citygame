/// <reference path="../lib/pixi.d.ts" />

/// <reference path="js/utility.d.ts" />

function makeLandValueOverlay(board)
{
  var cellsToOverlay = [];
  var minValue, maxValue;
  var colorIndexes: any = {};

  function getRelativeValue(val: number)
  {
    var difference = maxValue - minValue;
    if (difference < 1) difference = 1;
    var ababa = difference / 5;
    if (ababa < 1) ababa = 1;
    var relative = (Math.round(val/ababa) * ababa - minValue) /
      (difference);
    return relative;
  }

  for (var i = 0; i < board.width; i++)
  {
    for (var j = 0; j < board.height; j++)
    {
      var cell = board.cells[i][j]
      if (cell.type.type !== "water")
      {
        if (!minValue)
        {
          minValue = maxValue = cell.landValue
        }
        else
        {
          if (cell.landValue < minValue) minValue = cell.landValue;
          else if (cell.landValue > maxValue) maxValue = cell.landValue;
        }
        
        cellsToOverlay.push(
        {
          value: cell.landValue,
          sprite: cell.sprite
        });
      }
    }
  }

  var container = new PIXI.DisplayObjectContainer();

  for (var i = 0; i < cellsToOverlay.length; i++)
  {
    var cell = cellsToOverlay[i];

    if (!colorIndexes[cell.value])
    {
      var relativeValue = getRelativeValue(cell.value);
      if (relativeValue < 0) relativeValue = 0;
      else if (relativeValue > 1) relativeValue = 1;

      var hue = 100 - 100 * relativeValue;
      var saturation = 1 - 0.2 * relativeValue;
      var luminesence = 0.75 + 0.25 * relativeValue;

      colorIndexes[cell.value] =
        hslToHex(hue / 360, saturation, luminesence / 2);
    }
    
    var color = colorIndexes[cell.value];

    var _s = PIXI.Sprite.fromFrame("blank.png");
    _s.position = cell.sprite.position.clone();
    _s.anchor = cell.sprite.anchor.clone();
    _s.tint = color;

    container.addChild(_s);
  }

  return container;
}