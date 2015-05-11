/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class SandTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "sand";
        this.selectType = SelectionTypes.rectSelect;
        this.tintColor = 0xE2BF93;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.replace( cg["terrain"]["sand"] );
      }
    }
  }
}
