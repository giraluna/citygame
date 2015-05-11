module CityGame
{
  export module Tools
  {
    export class RemoveTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "remove";
        this.selectType = rectSelect;
        this.tintColor = 0xFF5555;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        if (game.worldRenderer.currentMapmode !== "underground")
        {
          target.changeContent("none");
        }
        else
        {
          target.changeUndergroundContent();
        }
      }
    }
  }
}
