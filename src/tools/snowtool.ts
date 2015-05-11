/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class SnowTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "snow";
        this.selectType = rectSelect;
        this.tintColor = 0xBBDFD7;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.replace( cg["terrain"]["snow"] );
      }
    }
  }
}
