/// <reference path="../lib/pixi.d.ts" />
/// 
/// <reference path="js/eventlistener.d.ts" />
/// 

class Highlighter
{
  currHighlighted: PIXI.Sprite[] = [];

  blinkGroups: any = {};

  idGenerator: number = 0;
  blinkIntervals: any = {};

  tintSprites(sprites: PIXI.Sprite[], color: number)
  {
    for (var i = 0; i < sprites.length; i++)
    {
      var _sprite = sprites[i];
      _sprite.tint = color;
      this.currHighlighted.push( sprites[i] );
    }
  }
  clearSprites()
  {
    for (var i = 0; i < this.currHighlighted.length; i++)
    {
      var _sprite = this.currHighlighted[i];
      _sprite.tint = 0xFFFFFF;
    }
    this.currHighlighted = [];
  }
  tintCells(cells: any[], color: number)
  {
    var _sprites = [];
    for (var i = 0; i < cells.length; i++)
    {
      _sprites.push(cells[i].sprite);
      if (cells[i].content !== undefined)
      {
        _sprites.push(cells[i].content.sprite);
      }
    }
    this.tintSprites(_sprites, color);
  }
  tintByBlinkKey(key: string, color: number)
  {
    var cells = [];
    for (var cell in this.blinkGroups[key])
    {
      cells = cells.concat(this.blinkGroups[key][cell]);
    }
    this.tintCells(cells, color);
  }

  blinkCells(cells: any[], color: number, delay: number, groupKey: string, id?: string)
  {
    var id = id || "" + this.idGenerator++;

    // create new group if it doesn't exist
    if (!this.blinkGroups[groupKey]) this.blinkGroups[groupKey] = {};
    // add new cells to group
    this.blinkGroups[groupKey][id] = cells;
    
    // return if interval is already active
    if (this.blinkIntervals[groupKey]) return groupKey;

    var blinkFunctions = [this.tintByBlinkKey.bind(this, groupKey, color), this.clearSprites.bind(this)];
    var blinkCellsFN = function()
    {
      blinkFunctions[0].call();
      blinkFunctions[blinkFunctions.length - 1] = blinkFunctions.shift();
      eventManager.dispatchEvent({type: "updateWorld", content: ""});
    }

    this.blinkIntervals[groupKey] = window.setInterval(blinkCellsFN, delay);

    return id;
  }

  removeSingleBlink(group: string, id: string)
  {
    delete this.blinkGroups[group][id];
    if (Object.keys(this.blinkGroups[group]).length <= 0)
    {
      this.stopBlink(group);
    }
  }

  stopBlink(group: string)
  {
    window.clearTimeout( this.blinkIntervals[group] );
    delete this.blinkIntervals[group];

    this.clearSprites();
    this.blinkGroups[group] = [];
    eventManager.dispatchEvent({type: "updateWorld", content: ""});
  }

  stopAllBlinks()
  {
    for (var timeout in this.blinkIntervals)
    {
      this.stopBlink(timeout);
    }
  }
}