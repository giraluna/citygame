/// <reference path="../lib/pixi.d.ts" />
/// 
/// <reference path="js/eventlistener.d.ts" />
/// 

class Highlighter
{
  currHighlighted: PIXI.Sprite[] = [];
  currTransparent: PIXI.Sprite[] = [];

  tintSprites(sprites: PIXI.Sprite[], color: number, shouldGroup: boolean = true)
  {
    for (var i = 0; i < sprites.length; i++)
    {
      var _sprite = sprites[i];
      _sprite.tint = color;

      if (shouldGroup) this.currHighlighted.push( sprites[i] );
    }
  }
  clearSprites(shouldClear: boolean = true)
  {
    for (var i = 0; i < this.currHighlighted.length; i++)
    {
      var _sprite = this.currHighlighted[i];
      _sprite.tint = 0xFFFFFF;
    }
    if (shouldClear) this.clearHighlighted();
  }
  clearHighlighted()
  {
    this.currHighlighted = [];
  }
  tintCells(cells: any[], color: number, shouldGroup: boolean = true)
  {
    var _sprites = [];
    for (var i = 0; i < cells.length; i++)
    {
      _sprites.push(cells[i].sprite);
      if (cells[i].content !== undefined)
      {
        _sprites = _sprites.concat(cells[i].content.sprites);
      }
    }
    this.tintSprites(_sprites, color, shouldGroup);
  }
  alphaBuildings(cells: any[], value: number)
  {
    var _sprites = [];
    for (var i = 0; i < cells.length; i++)
    {
      if (cells[i].content !== undefined)
      {
        var content = cells[i].content;
        for (var j = 0; j < content.sprites.length; j++)
        {
          var sprite = content.sprites[j];
          sprite.alpha = value;
          this.currTransparent.push(sprite);
        }
      }
    }
  }
  clearAlpha()
  {
    for (var i = 0; i < this.currTransparent.length; i++)
    {
      this.currTransparent[i].alpha = 1;
    }
    this.currTransparent = [];
  }
}