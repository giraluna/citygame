module playerModifiers
{
  export interface IPlayerModifier
  {
    type: string;
    title: string;
    description: any; //string or array
    effects?:
    {
      targets: string[];
      addedProfit?: number;
      multiplier?: number;
      buildCost?:
      {
        multiplier?: number;
        addedCost?: number;
      };
    }[];
    onAdd?:
    {
      oneTime: boolean;
      effect: (any) => void;
    };
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
    unlockConditions:
    [
      {
        type: "level",
        value: 1
      }
    ],
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
    description: "Clicking profit * 1.2",
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
    description: "Clicking profit * 1.2",
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
    description: "Clicking profit * 1.5",
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
    title: "Parking elevators",
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
  export var parkingModifier4: IPlayerModifier =
  {
    type: "parkingModifier4",
    title: "Parking hyperspace efficiency",
    description: "Parking profits * 1.5",
    cost: 10000,
    unlockConditions:
    [
      {
        type: "parkinglot",
        value: 15
      }
    ],
    effects:
    [
      {
        targets: ["parking"],
        multiplier: 1.5
      }
    ]
  }
  export var convenienceModifier1: IPlayerModifier =
  {
    type: "convenienceModifier1",
    title: "Newspaper stands",
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
    title: "Mystery meat hot dogs",
    description: "Convenience stores +1$ /s",
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
  export var fastFoodModifier1: IPlayerModifier =
  {
    type: "fastFoodModifier1",
    title: "Jumbo-size fries",
    description: "Fast food restaurants +1.5$ /s",
    cost: 700,
    unlockConditions:
    [
      {
        type: "fastfood",
        value: 1
      }
    ],
    effects:
    [
      {
        targets: ["fastfood"],
        addedProfit: 1.5
      }
    ]
  }
  export var fastFoodModifier2: IPlayerModifier =
  {
    type: "fastFoodModifier2",
    title: "Jumbo-size soda cups",
    description: "Fast food restaurants +4$ /s",
    cost: 2500,
    unlockConditions:
    [
      {
        type: "fastfood",
        value: 3
      }
    ],
    effects:
    [
      {
        targets: ["fastfood"],
        addedProfit: 4
      }
    ]
  }
  export var fastFoodModifier3: IPlayerModifier =
  {
    type: "fastFoodModifier3",
    title: "Jumbo-size diet soda cups",
    description: "Fast food restaurant profits * 1.3",
    cost: 7500,
    unlockConditions:
    [
      {
        type: "fastfood",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["fastfood"],
        multiplier: 1.3
      }
    ]
  }
  export var apartmentModifier1: IPlayerModifier =
  {
    type: "apartmentModifier1",
    title: "Central heating",
    description: "Apartments +4$ /s",
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
        addedProfit: 4
      }
    ]
  }
  export var apartmentModifier2: IPlayerModifier =
  {
    type: "apartmentModifier2",
    title: "Air conditioning",
    description: "Apartments +8$ /s",
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
        addedProfit: 8
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
    title: "Red staplers",
    description: "Offices +8$ /s",
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
        addedProfit: 8
      }
    ]
  }
  export var officeModifier2: IPlayerModifier =
  {
    type: "officeModifier2",
    title: "Ass-resistant photocopiers",
    description: "office profits * 1.2",
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
        multiplier: 1.2
      }
    ]
  }
  export var officeModifier3: IPlayerModifier =
  {
    type: "officeModifier3",
    title: "Ass-seeking photocopiers",
    description: "office profits * 1.5",
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
        multiplier: 1.5
      }
    ]
  }
  export var factoryModifier1: IPlayerModifier =
  {
    type: "factoryModifier1",
    title: "Steam powered factories",
    description: "Factories +15$ /s",
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
        addedProfit: 15
      }
    ]
  }
  export var factoryModifier2: IPlayerModifier =
  {
    type: "factoryModifier2",
    title: "Electricity powered factories",
    description: "Factories +30$ /s",
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
        addedProfit: 30
      }
    ]
  }
  export var factoryModifier3: IPlayerModifier =
  {
    type: "factoryModifier3",
    title: "Baby animal powered factories",
    description: "Factory profits * 1.5",
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
  export var hotelModifier1: IPlayerModifier =
  {
    type: "hotelModifier1",
    title: "Heated swimming pool",
    description: "Hotels +30$ /s",
    cost: 200000,
    unlockConditions:
    [
      {
        type: "hotel",
        value: 1
      }
    ],
    effects:
    [
      {
        targets: ["hotel"],
        addedProfit: 30
      }
    ]
  }
  export var hotelModifier2: IPlayerModifier =
  {
    type: "hotelModifier2",
    title: "Imported cleaning staff",
    description: "Building hotels is 15% cheaper",
    cost: 400000,
    unlockConditions:
    [
      {
        type: "hotel",
        value: 3
      }
    ],
    effects:
    [
      {
        targets: ["hotel"],
        buildCost:
        {
          multiplier: 0.85
        }
      }
    ]
  }
  export var hotelModifier3: IPlayerModifier =
  {
    type: "hotelModifier3",
    title: "Swim-up bar",
    description: "hotel profits * 1.5",
    cost: 500000,
    unlockConditions:
    [
      {
        type: "hotel",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["hotel"],
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

          if (!base[condition.type][condition.value])
          {
            base[condition.type][condition.value] = [];
          }

          base[condition.type][condition.value].push(modifier);
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