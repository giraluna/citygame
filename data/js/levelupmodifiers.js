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
                level: 5
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
                level: 10
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
                level: 20
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
                level: 5
            }
        ],
        dynamicEffect: {
            "parkinglot": function (player) {
                console.log(player);
                console.log(player.amountBuiltPerType["parkinglot"]);
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

    levelUpModifiers.allModifiers = (function () {
        var all = [];
        for (var _mod in playerModifiers) {
            if (playerModifiers[_mod].type) {
                all.push(playerModifiers[_mod]);
            }
        }
        return all;
    })();
})(levelUpModifiers || (levelUpModifiers = {}));
//# sourceMappingURL=levelupmodifiers.js.map
