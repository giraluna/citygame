/// <reference path="js/playermodifiers.d.ts" />
var levelUpModifiers;
(function (levelUpModifiers) {
    levelUpModifiers.testModifier = {
        type: "testModifier",
        title: "testing",
        description: "test",
        effects: [
            {
                targets: ["global"],
                addedProfit: 50
            },
            {
                targets: ["fastfood"],
                multiplier: 4
            }
        ]
    };

    levelUpModifiers.fundingBoost1 = {
        type: "fundingBoost1",
        title: "Starting capital",
        description: "+200$",
        unlockConditions: [
            {
                type: "level",
                value: 5
            }
        ],
        uniqueEffect: function (player) {
            player.addMoney(200);
        }
    };

    levelUpModifiers.fundingBoost2 = {
        type: "fundingBoost2",
        title: "More starting capital",
        description: "+500$",
        unlockConditions: [
            {
                type: "level",
                value: 10
            }
        ],
        uniqueEffect: function (player) {
            player.addMoney(500);
        }
    };

    levelUpModifiers.fundingBoost3 = {
        type: "fundingBoost3",
        title: "External investors",
        description: "+2000$",
        unlockConditions: [
            {
                type: "level",
                value: 20
            }
        ],
        uniqueEffect: function (player) {
            player.addMoney(2000);
        }
    };

    levelUpModifiers.clicksPerParking = {
        type: "clicksPerParking",
        title: "Clicks per parking",
        description: "+0.2 / click for every parking lot",
        unlockConditions: [
            {
                type: "level",
                value: 5
            }
        ],
        dynamicEffect: {
            "parkinglot": function (player) {
                player.addSpecialModifier({
                    type: "clicksPerParking",
                    title: "Clicks per parking",
                    description: "+0.2 / click for every parking lot",
                    effects: [
                        {
                            targets: ["click"],
                            addedProfit: player.amountBuiltPerType["parkinglot"] * 0.2
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.modifiersByUnlock = (function () {
        var base = {};

        for (var _mod in levelUpModifiers) {
            var modifier = levelUpModifiers[_mod];
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

    levelUpModifiers.allModifiers = (function () {
        var all = [];
        for (var _mod in levelUpModifiers) {
            if (levelUpModifiers[_mod].type) {
                all.push(levelUpModifiers[_mod]);
            }
        }
        return all;
    })();
})(levelUpModifiers || (levelUpModifiers = {}));
//# sourceMappingURL=levelupmodifiers.js.map
