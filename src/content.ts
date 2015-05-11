module CityGame
{
  export class Content
  {
    type: any;
    baseType: string;
    categoryType: string;
    id: number;
    sprites: Sprite[] = [];
    cells: Cell[];
    baseCell: Cell;
    size: number[];
    flags: string[];

    baseProfit: number = 0;
    modifiers: any = {};
    modifiedProfit: number = 0;
    player: Player;

    constructor(props:
    {
      cells: Cell[];
      type: any;

      player?: Player;
      id?: number;

      layer?: string;
    })
    {
      this.cells = props.cells;

      var minX, minY;
      for (var i = 0; i < this.cells.length; i++)
      {
        var pos = this.cells[i].gridPos;

        if (minY === undefined || pos[1] <= minY)
        {
          minY = pos[1];

          if (minX === undefined || pos[0] < minX)
          {
            minX = pos[0];
          }
        }
      }

      // highest point arbitrarily assigned as root
      this.baseCell = this.cells[0].board.getCell([minX, minY]);
      this.size = props.type.size || [1,1];


      var type = this.type = props.type;
      this.id = props.id || idGenerator.content++;

      this.baseType = type["baseType"] || undefined;
      this.categoryType = type["categoryType"] || undefined;
      this.flags = type["flags"] ? type["flags"].slice(0) : [];
      this.flags.push(this.baseType, this.categoryType);

      this.baseProfit = type.baseProfit || undefined;
      
      if (props.player)
      {
        props.player.addContent(this);
      }
      this.init( type, props.layer );
    }
    init( type, layer: string = "content" )
    {
      for (var i = 0; i < this.cells.length; i++)
      {
        var _cell = this.cells[i];
        var _s = new ContentSprite( type, this, i );
        this.sprites.push(_s);

        _s.position = _cell.board.getCell(_cell.gridPos).sprite.position.clone();
        if (_cell.type.type === "water")
        {
          _s.position.y -= 7;
        }
        else
        {
          _s.position.y -= (_cell.sprite.height - SPRITE_HEIGHT);
        }

        _cell.board.addSpriteToLayer(layer, _s, _cell.gridPos);
      }
    }
    applyModifiers()
    {
      var totals =
      {
        addedProfit: this.baseProfit,
        multiplier: 1
      };
      for (var _modifier in this.modifiers)
      {
        var modifier = this.modifiers[_modifier];
        if (!isFinite(modifier.strength) || modifier.strength <= 0)
        {
          this.modifiers[_modifier] = null;
          delete this.modifiers[_modifier];
        }
        else
        {
          for (var prop in modifier.effect)
          {
            totals[prop] += modifier.scaling(modifier.strength) * modifier.effect[prop];
          }
        }
      }
      this.modifiedProfit = totals.addedProfit * totals.multiplier;
    }
    remove()
    {
      if (this.player)
      {
        this.player.removeContent(this);
      }
      if (this.type.effects)
      {
        this.baseCell.removeAllPropagatedModifiers(this.type.translatedEffects);
      }


      for (var i = 0; i < this.cells.length; i++)
      {
        this.cells[i].content = undefined;
        this.cells[i].board.removeSpriteFromLayer("content", this.sprites[i], this.cells[i].gridPos);
      }
    }
  }
}