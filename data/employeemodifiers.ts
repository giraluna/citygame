/// <reference path="js/playermodifiers.d.ts" />

module employeeModifiers
{

  export var fastFoodTrait1: playerModifiers.IPlayerModifier =
  {
    type: "fastFoodTrait1",
    title: "Burger flipping mastery",
    description: "Fast food profits +15%",
    unlockConditions:
    [
      {
        type: "skillTotal",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["fastfood"],
        multiplier: 1.15
      }
    ]
  }

  export var factoryBuildingsTrait1: playerModifiers.IPlayerModifier =
  {
    type: "factoryBuildingsTrait1",
    title: "Logistics expert",
    description: "All buildings 1% cheaper per factory",
    unlockConditions:
    [
      {
        type: "skillTotal",
        value: 40
      }
    ],
    dynamicEffect:
    {
      "factory": function(player)
      {
        player.addSpecialModifier(
        {
          type: "factoryBuildingsTrait1",
          title: "Logistics expert",
          description: "All buildings 1% cheaper per factory",
          effects:
          [
            {
              targets: ["global"],
              buildCost:
              {
                multiplier: 1 - 0.01 * player.amountBuiltPerCategory["factory"]
              }
            }
          ]
        });
      }
    }
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

    for (var _mod in employeeModifiers)
    {
      var modifier = employeeModifiers[_mod]
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
    for (var _mod in employeeModifiers)
    {
      if (employeeModifiers[_mod].type)
      {
        all.push(employeeModifiers[_mod]);
      }
    }
    return all;
  })();
}