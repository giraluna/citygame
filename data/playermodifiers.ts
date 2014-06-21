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

  export var clickModifier1: IPlayerModifier =
  {
    type: "clickModifier1",
    title: "clickModifier1",
    description: "0.1 / click",
    cost: 50,
    effects:
    [
      {
        targets: ["click"],
        addedProfit: 0.1
      }
    ]
  }
  export var clickModifier2: IPlayerModifier =
  {
    type: "clickModifier2",
    title: "clickModifier2",
    description: "0.5 / click",
    cost: 200,
    effects:
    [
      {
        targets: ["click"],
        addedProfit: 0.5
      }
    ]
  }
  export var clickModifier3: IPlayerModifier =
  {
    type: "clickModifier3",
    title: "clickModifier3",
    description: "clicks * 1.2",
    cost: 1000,
    effects:
    [
      {
        targets: ["click"],
        multiplier: 1.2
      }
    ]
  }
  export var clickModifier4: IPlayerModifier =
  {
    type: "clickModifier4",
    title: "clickModifier4",
    description: "clicks * 1.2",
    cost: 5000,
    effects:
    [
      {
        targets: ["click"],
        multiplier: 1.2
      }
    ]
  }
}