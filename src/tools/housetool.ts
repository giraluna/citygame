/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class HouseTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "house";
        this.selectType = SelectionTypes.rectSelect;
        this.tintColor = 0x696969;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        // TODO
        var toChange;
        while (true)
        {
          toChange = getRandomProperty(cg["content"]["buildings"]);
          //toChange = cg.content.buildings.bigoffice;
          if (toChange.categoryType && toChange.categoryType === "apartment")
          {
            break;
          }
        }

        target.changeContent( toChange );
      }
    }
  }
}
