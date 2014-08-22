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

  export var prestigeDefault: IPlayerModifier =
  {
    type: "prestigeDefault",
    title: "Default prestige modifier",
    description: "1% total profit per prestige",
    dynamicEffect:
    {
      "prestige": function(player)
      {
        player.addSpecialModifier(
        {
          type: "prestigeDefault",
          title: "Default prestige modifier",
          description: "0.5% total profit per prestige",
          effects:
          [
            {
              targets: ["global"],
              multiplier: 1 + player.prestige * 0.005
            }
          ]
        });
      }
    }
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
        value: 200
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
    description: "Clicking profit +20%",
    cost: 1000,
    unlockConditions:
    [
      {
        type: "clicks",
        value: 400
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
    description: "Clicking profit +20%",
    cost: 5000,
    unlockConditions:
    [
      {
        type: "clicks",
        value: 600
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
    description: "Clicking profit +50%",
    cost: 25000,
    unlockConditions:
    [
      {
        type: "clicks",
        value: 900
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
  export var clickModifier6: IPlayerModifier =
  {
    type: "clickModifier6",
    title: "Way too much elbow grease",
    description: "Clicking profit +50%",
    cost: 100000,
    unlockConditions:
    [
      {
        type: "clicks",
        value: 1200
      },
      {
        type: "money",
        value: 50000
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
        type: "parking",
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
    description: "Parking profits +20%",
    cost: 500,
    unlockConditions:
    [
      {
        type: "parking",
        value: 3
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
    description: "Parking profits +20%",
    cost: 2000,
    unlockConditions:
    [
      {
        type: "parking",
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
  export var parkingModifier4: IPlayerModifier =
  {
    type: "parkingModifier4",
    title: "Parking hyperspace efficiency",
    description: "Parking profits +50%",
    cost: 10000,
    unlockConditions:
    [
      {
        type: "parking",
        value: 10
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
  export var parkingModifier5: IPlayerModifier =
  {
    type: "parkingModifier5",
    title: "Street parking meters",
    description: "Parking profits +50%",
    cost: 50000,
    unlockConditions:
    [
      {
        type: "parking",
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
    description: "Retail buildings +0.5$ /s",
    cost: 300,
    unlockConditions:
    [
      {
        type: "shopping",
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
    title: "Lottery tickets",
    description: "Retail buildings +2$ /s",
    cost: 1500,
    unlockConditions:
    [
      {
        type: "shopping",
        value: 3
      }
    ],
    effects:
    [
      {
        targets: ["shopping"],
        addedProfit: 2
      }
    ]
  }
  export var convenienceModifier3: IPlayerModifier =
  {
    type: "convenienceModifier3",
    title: "Liquor license",
    description: "Retail profits +30%",
    cost: 10000,
    unlockConditions:
    [
      {
        type: "shopping",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["shopping"],
        multiplier: 1.3
      }
    ]
  }
  export var convenienceModifier4: IPlayerModifier =
  {
    type: "convenienceModifier4",
    title: "Loss leaders",
    description: "Retail profits + 50%",
    cost: 1000000,
    unlockConditions:
    [
      {
        type: "shopping",
        value: 10
      }
    ],
    effects:
    [
      {
        targets: ["shopping"],
        multiplier: 1.5
      }
    ]
  }
  export var convenienceModifier5: IPlayerModifier =
  {
    type: "convenienceModifier5",
    title: "Market saturation",
    description: "Retail profits + 50% - 1% per retail building",
    cost: 5000000,
    unlockConditions:
    [
      {
        type: "shopping",
        value: 15
      }
    ],
    effects:
    [
      {
        targets: ["shopping"],
        multiplier: 1.5
      }
    ],
    dynamicEffect:
    {
      "shopping": function(player)
      {
        player.addSpecialModifier(
        {
          type: "convenienceModifier5",
          title: "Market saturation",
          description: "Retail profits + 50% - 1% per retail building",
          effects:
          [
            {
              targets: ["shopping"],
              multiplier: 1 - (player.amountBuiltPerCategory["shopping"] * 0.01)
            }
          ]
        });
      }
    }
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
    description: "Fast food restaurant profits +30%",
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
  export var fastFoodModifier4: IPlayerModifier =
  {
    type: "fastFoodModifier4",
    title: "Jumbo-size set meals",
    description: "Fast food restaurant profits + 50%",
    cost: 35000,
    unlockConditions:
    [
      {
        type: "fastfood",
        value: 10
      }
    ],
    effects:
    [
      {
        targets: ["fastfood"],
        multiplier: 1.5
      }
    ]
  }
  export var fastFoodModifier5: IPlayerModifier =
  {
    type: "fastFoodModifier5",
    title: "Chocolate chip cookies",
    description: "Fast food restaurant profits + 33%\nClicking profit +2% per restaurant",
    cost: 150000,
    unlockConditions:
    [
      {
        type: "fastfood",
        value: 15
      }
    ],
    effects:
    [
      {
        targets: ["fastfood"],
        multiplier: 1.33
      }
    ],
    dynamicEffect:
    {
      "fastfood": function(player)
      {
        player.addSpecialModifier(
        {
          type: "fastFoodModifier5",
          title: "Chocolate chip cookies",
          description: "Fast food restaurant profits + 33%\nClicking profit +2% per restaurant",
          effects:
          [
            {
              targets: ["click"],
              multiplier: 1 + (player.amountBuiltPerCategory["fastfood"] * 0.02)
            }
          ]
        });
      }
    }
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
        type: "apartment",
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
        type: "apartment",
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
    description: "Apartment profits +20%",
    cost: 15000,
    unlockConditions:
    [
      {
        type: "apartment",
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
  export var apartmentModifier4: IPlayerModifier =
  {
    type: "apartmentModifier4",
    title: "Fitness centers",
    description: "Apartment profits + 50%",
    cost: 75000,
    unlockConditions:
    [
      {
        type: "apartment",
        value: 10
      }
    ],
    effects:
    [
      {
        targets: ["apartment"],
        multiplier: 1.5
      }
    ]
  }
  export var apartmentModifier5: IPlayerModifier =
  {
    type: "apartmentModifier5",
    title: "Modular apartment buildings",
    description: "Apartment building cost -33%",
    cost: 250000,
    unlockConditions:
    [
      {
        type: "apartment",
        value: 15
      }
    ],
    effects:
    [
      {
        targets: ["apartment"],
        buildCost:
        {
          multiplier: 0.67
        }
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
        type: "office",
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
    description: "Office profits +20%",
    cost: 15000,
    unlockConditions:
    [
      {
        type: "office",
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
    description: "Office profits + 50%",
    cost: 50000,
    unlockConditions:
    [
      {
        type: "office",
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
  export var officeModifier4: IPlayerModifier =
  {
    type: "officeModifier4",
    title: "Middle management",
    description: "Office profits + 50%",
    cost: 250000,
    unlockConditions:
    [
      {
        type: "office",
        value: 10
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
  export var officeModifier5: IPlayerModifier =
  {
    type: "officeModifier5",
    title: "Corporate real estate",
    description: "Office profits + 25%\nBuying plots 2% cheaper per office",
    cost: 750000,
    unlockConditions:
    [
      {
        type: "office",
        value: 15
      }
    ],
    effects:
    [
      {
        targets: ["office"],
        multiplier: 1.25
      }
    ],
    dynamicEffect:
    {
      "office": function(player)
      {
        player.addSpecialModifier(
        {
          type: "officeModifier5",
          title: "Corporate real estate",
          description: "Office profits + 25%\nBuying plots 2% cheaper per office",
          effects:
          [
            {
              targets: ["global"],
              buyCost:
              {
                multiplier: 1 - player.amountBuiltPerCategory["office"] * 0.02
              }
            }
          ]
        });
      }
    }
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
    description: "Factories +40$ /s",
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
        addedProfit: 40
      }
    ]
  }
  export var factoryModifier3: IPlayerModifier =
  {
    type: "factoryModifier3",
    title: "Baby animal powered factories",
    description: "Factory profits + 50%",
    cost: 350000,
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
  export var factoryModifier4: IPlayerModifier =
  {
    type: "factoryModifier4",
    title: "Lubricated crankshafts",
    description: "Factory profits + 50%",
    cost: 600000,
    unlockConditions:
    [
      {
        type: "factory",
        value: 7
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
  export var factoryModifier5: IPlayerModifier =
  {
    type: "factoryModifier5",
    title: "OSHA regulations",
    description: "Factory profits + 50%\nFactory build cost +15%",
    cost: 1500000,
    unlockConditions:
    [
      {
        type: "factory",
        value: 12
      }
    ],
    effects:
    [
      {
        targets: ["factory"],
        multiplier: 1.5,
        buildCost:
        {
          multiplier: 1.15
        }
      }
    ]
  }
  export var hotelModifier1: IPlayerModifier =
  {
    type: "hotelModifier1",
    title: "Heated swimming pool",
    description: "Hotels +30$ /s",
    cost: 750000,
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
    cost: 1500000,
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
    description: "Hotel profits +33%",
    cost: 3000000,
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
        multiplier: 1.33
      }
    ]
  }
  export var hotelModifier4: IPlayerModifier =
  {
    type: "hotelModifier4",
    title: "Guided tours",
    description: "Hotel profits +50%",
    cost: 6000000,
    unlockConditions:
    [
      {
        type: "hotel",
        value: 7
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
  export var hotelModifier5: IPlayerModifier =
  {
    type: "hotelModifier5",
    title: "Tourist pricing",
    description: "Hotel profits +50%\ŋGlobal profit -5%",
    cost: 12000000,
    unlockConditions:
    [
      {
        type: "hotel",
        value: 12
      }
    ],
    effects:
    [
      {
        targets: ["hotel"],
        multiplier: 1.5
      },
      {
        targets: ["global"],
        multiplier: 0.95
      }
    ]
  }

  export var stadiumModifier1: IPlayerModifier =
  {
    type: "stadiumModifier1",
    title: "Expanded seating",
    description: "Stadiums +100$ /s",
    cost: 2000000,
    unlockConditions:
    [
      {
        type: "stadium",
        value: 1
      }
    ],
    effects:
    [
      {
        targets: ["stadium"],
        addedProfit: 100
      }
    ]
  }
  export var stadiumModifier2: IPlayerModifier =
  {
    type: "stadiumModifier2",
    title: "VIP boxes",
    description: "Stadium profits +33%",
    cost: 4000000,
    unlockConditions:
    [
      {
        type: "stadium",
        value: 3
      }
    ],
    effects:
    [
      {
        targets: ["stadium"],
        multiplier: 1.33
      }
    ]
  }
  export var stadiumModifier3: IPlayerModifier =
  {
    type: "stadiumModifier3",
    title: "Team merchandise",
    description: "Stadium profits +50%\nShopping profits +20%",
    cost: 8000000,
    unlockConditions:
    [
      {
        type: "stadium",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["stadium"],
        multiplier: 1.5
      },
      {
        targets: ["shopping"],
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