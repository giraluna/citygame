module CityGame
{
  export module Tools
  {
    export class WaterTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "water";
        this.selectType = rectSelect;
        this.tintColor = 0x4444FF;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.replace( cg["terrain"]["water"] );
      }
    }
  }
}
