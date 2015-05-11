/// <reference path="sprite.ts" />
/// <reference path="cell.ts" />

module CityGame
{
  export class GroundSprite extends Sprite
  {
    cell: Cell;

    constructor(type, cell)
    {
      this.cell = cell;
      super(type);
    }
  }
}
