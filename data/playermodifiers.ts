module playerModifiers
{
  export interface IPlayerModifier
  {
    type: string;
    title: string;
    description: string;
    effects:
    {
      targets: string[];
      addedProfit?: number;
      multiplier?: number;
      buildCost?: number;
    }[];
    unlockConditions?: any;

  }


  export var testModifier: IPlayerModifier =
  {
    type: "testModifier",
    title: "testing",
    description: "test",
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
    unlockConditions:["default"],
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
    unlockConditions:
    [
      {
        type: "clicks",
        value: 50
      }
    ],
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
    unlockConditions:
    [
      {
        type: "clicks",
        value: 200
      },
      {
        type: "money",
        value: 250
      }
    ],
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
    unlockConditions:
    [
      {
        type: "clicks",
        value: 500
      },
      {
        type: "money",
        value: 2000
      }
    ],
    effects:
    [
      {
        targets: ["click"],
        multiplier: 1.2
      }
    ]
  }

  /**
   * unlockConditions:
   * [
   *   {
   *     type: "buildings", "level", "money"
   *     value: 69
   *   }
   * ]
   * */
   /**
    * modifiersbyUnlock =
    * {
    *   money:
    *   {
    *     69: [playerModifiers.äbäbäbä]
    *   }
    * }
    */

  export var modifiersByUnlock = (function()
  {
    var base: any = {};

    for (var _mod in playerModifiers)
    {
      var modifier = playerModifiers[_mod]
      if (modifier.unlockConditions)
      {
        for (var i = 0; i < modifier.unlockConditions.length; i++)
        {
          var condition = modifier.unlockConditions[i];

          if (condition === "default")
          {
            if (!base.default) base.default = [];
            base.default.push(modifier);
            continue;
          }

          if (!base[condition.type]) base[condition.type] = {};

          var arr = base[condition.type][condition.value] = [];
          arr.push(modifier);
        }
      }
    }
    return base;
  })();

  export var allModifiers = (function()
  {
    var all = [];
    for (var _mod in playerModifiers)
    {
      if (playerModifiers[_mod].type)
      {
        all.push(playerModifiers[_mod]);
      }
    }
    return all;
  })();
}