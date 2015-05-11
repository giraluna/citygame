/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class RoadTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "road";
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
      } 
      onActivate(target: Cell)
      {
        target.changeContent( cg["content"]["roads"]["road_nesw"] );
      }
    }
  }
}
