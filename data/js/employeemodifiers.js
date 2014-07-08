/// <reference path="js/playermodifiers.d.ts" />
var employeeModifiers;
(function (employeeModifiers) {
    employeeModifiers.fastFoodTrait1 = {
        type: "fastFoodTrait1",
        title: "Burger flipping mastery",
        description: "Fast food profits +15%",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                multiplier: 1.15
            }
        ]
    };

    employeeModifiers.clicksPerShoppingTrait1 = {
        type: "clicksPerShoppingTrait1",
        title: "Product location manager",
        description: "Clicking profit +5% per retail building",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 10
            }
        ],
        dynamicEffect: {
            "shopping": function (player) {
                player.addSpecialModifier({
                    type: "clicksPerShoppingTrait1",
                    title: "Product location manager",
                    description: "Clicking profit +5% per retail building",
                    effects: [
                        {
                            targets: ["click"],
                            multiplier: 1 + player.amountBuiltPerCategory["shopping"] * 0.05
                        }
                    ]
                });
            }
        }
    };

    employeeModifiers.apartmentTrait1 = {
        type: "apartmentTrait1",
        title: "Landlord",
        description: "Apartment profits +20%",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 20
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                multiplier: 1.20
            }
        ]
    };

    employeeModifiers.apartmentFactoriesTrait1 = {
        type: "apartmentFactoriesTrait1",
        title: "Union leader",
        description: "Factory profits +5% per apartment and vice versa.\nFactory & apartment cost +25%",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 40
            }
        ],
        effects: [
            {
                targets: ["factory", "apartment"],
                buildCost: {
                    multiplier: 1.25
                }
            }
        ],
        dynamicEffect: {
            "apartment": function (player) {
                player.addSpecialModifier({
                    type: "apartmentFactoriesTrait1_a",
                    title: "Union leader A",
                    description: "Factory profits +5% per apartment.",
                    effects: [
                        {
                            targets: ["factory"],
                            multiplier: 1 + 0.05 * player.amountBuiltPerCategory["apartment"]
                        }
                    ]
                });
            },
            "factory": function (player) {
                player.addSpecialModifier({
                    type: "apartmentFactoriesTrait1_b",
                    title: "Union leader B",
                    description: "Apartment profits +5% per factory.",
                    effects: [
                        {
                            targets: ["apartment"],
                            multiplier: 1 + 0.05 * player.amountBuiltPerCategory["factory"]
                        }
                    ]
                });
            }
        }
    };

    employeeModifiers.factoryBuildingsTrait1 = {
        type: "factoryBuildingsTrait1",
        title: "Industry connections",
        description: "All buildings 1% cheaper per factory",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 40
            }
        ],
        dynamicEffect: {
            "factory": function (player) {
                player.addSpecialModifier({
                    type: "factoryBuildingsTrait1",
                    title: "Industry connections",
                    description: "All buildings 1% cheaper per factory",
                    effects: [
                        {
                            targets: ["global"],
                            buildCost: {
                                multiplier: 1 - 0.01 * player.amountBuiltPerCategory["factory"]
                            }
                        }
                    ]
                });
            }
        }
    };

    employeeModifiers.hotelShoppingTrait1 = {
        type: "hotelShoppingTrait1",
        title: "Shopping tourism promoter",
        description: "Retail profits +5% per hotel",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 50
            }
        ],
        dynamicEffect: {
            "hotel": function (player) {
                player.addSpecialModifier({
                    type: "hotelShoppingTrait1",
                    title: "Shopping tourism promoter",
                    description: "Retail profits +5% per hotel",
                    effects: [
                        {
                            targets: ["global"],
                            multiplier: 1 + 0.05 * player.amountBuiltPerCategory["hotel"]
                        }
                    ]
                });
            }
        }
    };

    employeeModifiers.hotelTrait1 = {
        type: "hotelTrait1",
        title: "Concierge",
        description: "Hotel profits +10%",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 50
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                multiplier: 1.10
            }
        ]
    };

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
    employeeModifiers.modifiersByUnlock = (function () {
        var base = {};

        for (var _mod in employeeModifiers) {
            var modifier = employeeModifiers[_mod];
            if (modifier.unlockConditions) {
                for (var i = 0; i < modifier.unlockConditions.length; i++) {
                    var condition = modifier.unlockConditions[i];

                    if (condition === "default") {
                        if (!base.default)
                            base.default = [];
                        base.default.push(modifier);
                        continue;
                    }

                    if (!base[condition.type])
                        base[condition.type] = {};

                    if (!base[condition.type][condition.value]) {
                        base[condition.type][condition.value] = [];
                    }

                    base[condition.type][condition.value].push(modifier);
                }
            }
        }
        return base;
    })();

    employeeModifiers.allModifiers = (function () {
        var all = [];
        for (var _mod in employeeModifiers) {
            if (employeeModifiers[_mod].type) {
                all.push(employeeModifiers[_mod]);
            }
        }
        return all;
    })();
})(employeeModifiers || (employeeModifiers = {}));
//# sourceMappingURL=employeemodifiers.js.map
