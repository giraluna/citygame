/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />

/// <reference path="utility.ts" />

module CityGame
{
  export function makeToolTip(data: any, text: PIXI.Text)
  {
    var toolTip = new PIXI.DisplayObjectContainer;
    var speechRect;

    if (data.autoSize || !data.width)
    {
      speechRect = makeSpeechRect(data, text);
    }
    else
    {
      speechRect = makeSpeechRect(data);
    }
    var speechPoly = speechRect[0];
    var topLeft = speechRect[1];

    var gfx = new PIXI.Graphics();
    drawPolygon(gfx, speechPoly,
      data.style.lineStyle, data.style.fillStyle);

    text.position.set(topLeft[0] + data.padding[0],
      topLeft[1] + data.padding[1]);

    toolTip.addChild(gfx);
    toolTip.addChild(text);

    return toolTip
  }

  export function drawPolygon(gfx: PIXI.Graphics,
    polygon: number[][],
    lineStyle: any,
    fillStyle: any)
  {
    //TODO : floating point errors

    gfx.lineStyle(lineStyle.width, lineStyle.color, lineStyle.alpha);
    gfx.beginFill(fillStyle.color, fillStyle.alpha);
    
    gfx.moveTo(polygon[0][0], polygon[0][1]);

    for (var i = 1; i < polygon.length; i++)
    {
      if ( !(polygon[i][0] === polygon[i-1][0] //check overlapping vertices
      && polygon[i][1] === polygon[i-1][1]) )  //done seperately because [0] !== [0]
      {
        var x = polygon[i][0];
        var y = polygon[i][1];
        gfx.lineTo(x, y);
      }
    }
    gfx.endFill();

    // draw dots at the corners
    /*
    for (var i = 1; i < polygon.length; i++)
    {
      gfx.beginFill();
      gfx.drawEllipse(polygon[i][0], polygon[i][1], 3, 3);
      gfx.endFill();
    }
    */

    return gfx;
  }

  export function makeSpeechRect(data:any, text?: PIXI.Text) : number[][]
  {

    /*
     4|---------------------------|3
      |                           |
      |                           |
      |                           |
     5|----|  /-------------------|2
          6| / 1
           |/
          7,0

          7,0
           |\
          6| \ 1
     5|----|  \-------------------|2
      |                           |
      |                           |
      |                           |
     4|---------------------------|3
    */
   
    var width     = data.width     || 200;
    var height    = data.height    || 100;
    var padding   = data.padding   || 10;

    var tipPos    = data.tipPos    || 0.25;
    var tipWidth  = data.tipWidth  || 10;
    var tipHeight = data.tipHeight || 20;
    var tipDir    = data.tipDir    || "right";
    var pointing  = data.pointing  || "down";

    if (text)
    {
      width  = text.width  + padding[0] * 2;
      height = text.height + padding[1] * 2;
    }

    var xMax = width * ( 1-tipPos );
    var yMax = height + tipHeight;
    var xMin = -width * tipPos;
    var yMin = tipHeight
    var dir = (pointing === "down") ? -1 : 1;

    var polygon;
    var topLeft;

    // make base polygon
    if (pointing === "down")
    {
      polygon =
      [
        [0, 0],
        [0, -yMin],
        [xMax, -yMin],
        [xMax, -yMax],
        [xMin, -yMax],
        [xMin, -yMin],
        [0, -yMin],
        [0, 0],
      ];
      topLeft = [xMin, -yMax];
    }
    else if (pointing === "up")
    {
      polygon =
      [
        [0, 0],
        [0, yMin],
        [xMax, yMin],
        [xMax, yMax],
        [xMin, yMax],
        [xMin, yMin],
        [0, yMin],
        [0, 0],
      ];
      topLeft = [xMin, yMin];
    }

    // adjust direction tip slants in
    if (tipDir === "right")
    {
      polygon[1][0] = tipWidth;
    }
    else if (tipDir === "left")
    {
      polygon[6][0] = -tipWidth;
    }

    // adjust for extreme tip position
    if (tipPos < 0)
    {
      polygon[1][0] = polygon[5][0] + tipWidth;
      polygon[5] = polygon[6] = [polygon[5][0], polygon[5][1] + tipWidth * dir]
    }
    else if (tipPos > 1)
    {
      polygon[6][0] = polygon[2][0] - tipWidth;
      polygon[2] = polygon[1] = [polygon[2][0], polygon[2][1] + tipWidth * dir]
    }

    return [polygon, topLeft ]; //[0]: polygon, [1]: top left
  }
}
