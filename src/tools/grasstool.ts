/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class GrassTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "grass";
        this.selectType = rectSelect;
        this.tintColor = 0x617A4E;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.replace( cg["terrain"]["grass"] );
      }
    }
  }
}
