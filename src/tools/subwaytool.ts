/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class SubwayTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "subway";
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
        this.mapmode = "underground";
      }
      onActivate(target: Cell)
      {
        target.changeUndergroundContent( cg["content"]["tubes"]["tube_nesw"] );
      }
    }
  }
}
