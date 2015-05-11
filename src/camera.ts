/// <reference path="../lib/pixi.d.ts" />

module CityGame
{
  export class Camera
  {
    container: PIXI.DisplayObjectContainer;
    width: number
    height: number
    bounds: any = {};
    startPos: number[];
    startClick: number[];
    currZoom: number = 1;
    zoomField: any;

    constructor(container: PIXI.DisplayObjectContainer, bound)
    {
      this.container = container;
      this.bounds.min = bound;  // sets clamp limit to percentage of screen from 0.0 to 1.0
      this.bounds.max = Number( (1 - bound).toFixed(1) );
      this.setBounds();
      this.zoomField = document.getElementById("zoom-amount");
    }
    startScroll( mousePos )
    {
      this.setBounds();
      this.startClick = mousePos;
      this.startPos = [this.container.position.x, this.container.position.y];
    }
    end()
    {
      this.startPos = undefined;
    }
    setBounds()
    {
      var rect = this.container.getLocalBounds();
      this.width = SCREEN_WIDTH;
      this.height = SCREEN_HEIGHT;
      this.bounds =
      {
        xMin: (this.width  * this.bounds.min) - rect.width * this.container.scale.x,
        xMax: (this.width  * this.bounds.max),
        yMin: (this.height * this.bounds.min) - rect.height * this.container.scale.y,
        yMax: (this.height * this.bounds.max),
        min: this.bounds.min,
        max: this.bounds.max
      }
    }
    getDelta( currPos )
    {
      var x = this.startClick[0] - currPos[0];
      var y = this.startClick[1] - currPos[1];
      return [-x, -y];
    }
    move( currPos )
    {
      var delta = this.getDelta(currPos);
      this.container.position.x = this.startPos[0] + delta[0];
      this.container.position.y = this.startPos[1] + delta[1];
      this.clampEdges();
    }
    zoom( zoomAmount: number)
    {
      var container = this.container;
      var oldZoom = this.currZoom;

      var zoomDelta = oldZoom - zoomAmount;
      var rect = container.getLocalBounds();

      //these 2 get position of screen center in relation to the container
      //0: far left 1: far right
      var xRatio = 1 - ((container.x - SCREEN_WIDTH/2) / rect.width / oldZoom + 1);
      var yRatio = 1 - ((container.y - SCREEN_HEIGHT/2) / rect.height / oldZoom + 1);

      var xDelta = rect.width * xRatio * zoomDelta;
      var yDelta = rect.height * yRatio * zoomDelta;
      container.position.x += xDelta;
      container.position.y += yDelta;
      container.scale.set(zoomAmount, zoomAmount);
      this.zoomField.value = this.currZoom = zoomAmount;

      eventManager.dispatchEvent({type:"updateZoomValue", content: this.currZoom});
    }
    deltaZoom( delta, scale )
    {
      if (delta === 0)
      {
        return;
      }
      var direction = delta < 0 ? "out" : "in";
      var adjDelta = 1 + Math.abs(delta) * scale
      if (direction === "out")
      {
        this.zoom(this.currZoom / adjDelta);
      }
      else
      {
        this.zoom(this.currZoom * adjDelta);
      }
    }
    clampEdges()
    {
      var x = this.container.position.x;
      var y = this.container.position.y;

      //horizontal
      //left edge
      if ( x < this.bounds.xMin)
      {
        x = this.bounds.xMin;
      }
      //right edge
      else if ( x > this.bounds.xMax)
      {
        x = this.bounds.xMax;
      }

      //vertical
      //top
      if ( y < this.bounds.yMin )
      {
        y = this.bounds.yMin;
      }
      //bottom
      else if ( y > this.bounds.yMax )
      {
        y = this.bounds.yMax;
      }

      this.container.position.set(x, y)
    }
  }
}
