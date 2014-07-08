/// <reference path="js/playermodifiers.d.ts" />

module employeeModifiers
{

  export var fastFoodTrait1: playerModifiers.IPlayerModifier =
  {
    type: "fastFoodTrait1",
    title: "Burger flipping mastery",
    description: "Fast food profits +15%",
    effects:
    [
      {
        targets: ["fastfood"],
        multiplier: 1.15
      }
    ]
  }

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
}