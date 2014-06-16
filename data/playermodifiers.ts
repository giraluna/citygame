module playerModifiers
{
  export interface IPlayerModifier
  {
    type: string;
    effects?:
    {
      targets: string[];
      addedProfit?: number;
      multiplier?: number;
      buildCost?: number;
    }[];
  }


  export var testModifier: IPlayerModifier =
  {
    type: "testModifier",
    effects:
    [
      {
        targets: ["global"],
        addedProfit: 50
      },
      {
        targets: ["fastfood"],
        multiplier: 4
      }
    ]
    
  }
}