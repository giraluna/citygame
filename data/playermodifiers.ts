module playerModifiers
{
  export interface IPlayerModifier
  {
    type: string;
    title: string;
    description: string;
    effects?:
    {
      targets: string[];
      addedProfit?: number;
      multiplier?: number;
      buildCost?: number;
    }[];
    uniqueEffect?: (any) => void;
    dynamicEffect?: {[target: string]: (any) => any;};
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
    title: "Hardly working",
    description: "+0.2$ / click",
    cost: 50,
    unlockConditions:["default"],
    effects:
    [
      {
        targets: ["click"],
        addedProfit: 0.2
      }
    ]
  }
  export var clickModifier2: IPlayerModifier =
  {
    type: "clickModifier2",
    title: "Working hard",
    description: "+0.5$ / click",
    cost: 200,
    unlockConditions:
    [
      {
        type: "clicks",
        value: 20
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
    title: "Rolled up sleeves",
    description: "clicks * 1.2",
    cost: 1000,
    unlockConditions:
    [
      {
        type: "clicks",
        value: 100
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
    title: "A little bit of elbow grease",
    description: "clicks * 1.2",
    cost: 5000,
    unlockConditions:
    [
      {
        type: "clicks",
        value: 400
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
  export var clickModifier5: IPlayerModifier =
  {
    type: "clickModifier5",
    title: "A lot more elbow grease",
    description: "clicks * 1.5",
    cost: 25000,
    unlockConditions:
    [
      {
        type: "clicks",
        value: 800
      },
      {
        type: "money",
        value: 10000
      }
    ],
    effects:
    [
      {
        targets: ["click"],
        multiplier: 1.5
      }
    ]
  }
  export var parkingModifier1: IPlayerModifier =
  {
    type: "parkingModifier1",
    title: "Boom gates",
    description: "Parking +0.1$ /s",
    cost: 50,
    unlockConditions:
    [
      {
        type: "parkinglot",
        value: 1
      }
    ],
    effects:
    [
      {
        targets: ["parking"],
        addedProfit: 0.1
      }
    ]
  }
  export var parkingModifier2: IPlayerModifier =
  {
    type: "parkingModifier2",
    title: "Parking space effeciency",
    description: "Parking profits * 1.2",
    cost: 500,
    unlockConditions:
    [
      {
        type: "parkinglot",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["parking"],
        multiplier: 1.2
      }
    ]
  }
  export var parkingModifier3: IPlayerModifier =
  {
    type: "parkingModifier3",
    title: "Valet service",
    //description: "Hire a professional Parker",
    description: "Parking profits * 1.2",
    cost: 2000,
    unlockConditions:
    [
      {
        type: "parkinglot",
        value: 10
      }
    ],
    effects:
    [
      {
        targets: ["parking"],
        multiplier: 1.2
      }
    ]
  }
  export var convenienceModifier1: IPlayerModifier =
  {
    type: "convenienceModifier1",
    title: "Bigger soda cups",
    description: "Convenience stores +0.5$ /s",
    cost: 300,
    unlockConditions:
    [
      {
        type: "conveniencestore",
        value: 1
      }
    ],
    effects:
    [
      {
        targets: ["shopping"],
        addedProfit: 0.5
      }
    ]
  }
  export var convenienceModifier2: IPlayerModifier =
  {
    type: "convenienceModifier2",
    title: "Hot dog meat efficiency",
    description: "You don't want to know (+1$/s)",
    cost: 1500,
    unlockConditions:
    [
      {
        type: "conveniencestore",
        value: 3
      }
    ],
    effects:
    [
      {
        targets: ["shopping"],
        addedProfit: 1
      }
    ]
  }
  export var convenienceModifier3: IPlayerModifier =
  {
    type: "convenienceModifier3",
    title: "Lottery tickets",
    description: "Convenience store profits * 1.2",
    cost: 5000,
    unlockConditions:
    [
      {
        type: "conveniencestore",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["shopping"],
        multiplier: 1.2
      }
    ]
  }
  export var apartmentModifier1: IPlayerModifier =
  {
    type: "apartmentModifier1",
    title: "Central heating",
    description: "Apartments +2$ /s",
    cost: 1500,
    unlockConditions:
    [
      {
        type: "house1",
        value: 1
      }
    ],
    effects:
    [
      {
        targets: ["apartment"],
        addedProfit: 2
      }
    ]
  }
  export var apartmentModifier2: IPlayerModifier =
  {
    type: "apartmentModifier2",
    title: "Air conditioning",
    description: "Apartments +4$ /s",
    cost: 5000,
    unlockConditions:
    [
      {
        type: "house1",
        value: 3
      }
    ],
    effects:
    [
      {
        targets: ["apartment"],
        addedProfit: 4
      }
    ]
  }
  export var apartmentModifier3: IPlayerModifier =
  {
    type: "apartmentModifier3",
    title: "Soundproof Walls",
    description: "Apartment profits * 1.2",
    cost: 15000,
    unlockConditions:
    [
      {
        type: "house1",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["apartment"],
        multiplier: 1.2
      }
    ]
  }
  export var officeModifier1: IPlayerModifier =
  {
    type: "officeModifier1",
    title: "Swingline Staplers",
    description: "Offices +4$ /s",
    cost: 5000,
    unlockConditions:
    [
      {
        type: "smalloffice",
        value: 1
      }
    ],
    effects:
    [
      {
        targets: ["office"],
        addedProfit: 4
      }
    ]
  }
  export var officeModifier2: IPlayerModifier =
  {
    type: "officeModifier2",
    title: "Ass-resistant photocopiers",
    description: "Offices +6$ /s",
    cost: 15000,
    unlockConditions:
    [
      {
        type: "smalloffice",
        value: 3
      }
    ],
    effects:
    [
      {
        targets: ["office"],
        addedProfit: 6
      }
    ]
  }
  export var officeModifier3: IPlayerModifier =
  {
    type: "officeModifier3",
    title: "Ass-seeking photocopiers",
    description: "office profits * 1.2",
    cost: 50000,
    unlockConditions:
    [
      {
        type: "smalloffice",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["office"],
        multiplier: 1.2
      }
    ]
  }
  export var factoryModifier1: IPlayerModifier =
  {
    type: "factoryModifier1",
    title: "Steam powered factories",
    description: "Factories +4$ /s",
    cost: 50000,
    unlockConditions:
    [
      {
        type: "factory",
        value: 1
      }
    ],
    effects:
    [
      {
        targets: ["factory"],
        addedProfit: 20
      }
    ]
  }
  export var factoryModifier2: IPlayerModifier =
  {
    type: "factoryModifier2",
    title: "Electricity powered factories",
    description: "Factories +6$ /s",
    cost: 150000,
    unlockConditions:
    [
      {
        type: "factory",
        value: 3
      }
    ],
    effects:
    [
      {
        targets: ["factory"],
        addedProfit: 50
      }
    ]
  }
  export var factoryModifier3: IPlayerModifier =
  {
    type: "factoryModifier3",
    title: "Baby animal powered factories",
    description: "Factory profits * 1.2",
    cost: 500000,
    unlockConditions:
    [
      {
        type: "factory",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["factory"],
        multiplier: 1.5
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