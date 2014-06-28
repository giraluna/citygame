var playerModifiers;
(function (playerModifiers) {
    playerModifiers.testModifier = {
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

    playerModifiers.prestigeDefault = {
        type: "prestigeDefault",
        title: "Default prestige modifier",
        description: "1% total profit per prestige",
        dynamicEffect: {
            "prestige": function (player) {
                player.addSpecialModifier({
                    type: "prestigeDefault",
                    title: "Default prestige modifier",
                    description: "1% total profit per prestige",
                    effects: [
                        {
                            targets: ["global"],
                            multiplier: 1 + player.prestige * 0.01
                        }
                    ]
                });
            }
        }
    };

    playerModifiers.clickModifier1 = {
        type: "clickModifier1",
        title: "Hardly working",
        description: "+0.2$ / click",
        cost: 50,
        unlockConditions: [
            {
                type: "level",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["click"],
                addedProfit: 0.2
            }
        ]
    };
    playerModifiers.clickModifier2 = {
        type: "clickModifier2",
        title: "Working hard",
        description: "+0.5$ / click",
        cost: 200,
        unlockConditions: [
            {
                type: "clicks",
                value: 20
            }
        ],
        effects: [
            {
                targets: ["click"],
                addedProfit: 0.5
            }
        ]
    };
    playerModifiers.clickModifier3 = {
        type: "clickModifier3",
        title: "Rolled up sleeves",
        description: "Clicking profit * 1.2",
        cost: 1000,
        unlockConditions: [
            {
                type: "clicks",
                value: 100
            },
            {
                type: "money",
                value: 250
            }
        ],
        effects: [
            {
                targets: ["click"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.clickModifier4 = {
        type: "clickModifier4",
        title: "A little bit of elbow grease",
        description: "Clicking profit * 1.2",
        cost: 5000,
        unlockConditions: [
            {
                type: "clicks",
                value: 400
            },
            {
                type: "money",
                value: 2000
            }
        ],
        effects: [
            {
                targets: ["click"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.clickModifier5 = {
        type: "clickModifier5",
        title: "A lot more elbow grease",
        description: "Clicking profit * 1.5",
        cost: 25000,
        unlockConditions: [
            {
                type: "clicks",
                value: 800
            },
            {
                type: "money",
                value: 10000
            }
        ],
        effects: [
            {
                targets: ["click"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.parkingModifier1 = {
        type: "parkingModifier1",
        title: "Boom gates",
        description: "Parking +0.1$ /s",
        cost: 50,
        unlockConditions: [
            {
                type: "parking",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["parking"],
                addedProfit: 0.1
            }
        ]
    };
    playerModifiers.parkingModifier2 = {
        type: "parkingModifier2",
        title: "Parking space effeciency",
        description: "Parking profits * 1.2",
        cost: 500,
        unlockConditions: [
            {
                type: "parking",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["parking"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.parkingModifier3 = {
        type: "parkingModifier3",
        title: "Parking elevators",
        description: "Parking profits * 1.2",
        cost: 2000,
        unlockConditions: [
            {
                type: "parking",
                value: 10
            }
        ],
        effects: [
            {
                targets: ["parking"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.parkingModifier4 = {
        type: "parkingModifier4",
        title: "Parking hyperspace efficiency",
        description: "Parking profits * 1.5",
        cost: 10000,
        unlockConditions: [
            {
                type: "parking",
                value: 15
            }
        ],
        effects: [
            {
                targets: ["parking"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.convenienceModifier1 = {
        type: "convenienceModifier1",
        title: "Newspaper stands",
        description: "Convenience stores +0.5$ /s",
        cost: 300,
        unlockConditions: [
            {
                type: "shopping",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["shopping"],
                addedProfit: 0.5
            }
        ]
    };
    playerModifiers.convenienceModifier2 = {
        type: "convenienceModifier2",
        title: "Lottery tickets",
        description: "Convenience stores +1$ /s",
        cost: 1500,
        unlockConditions: [
            {
                type: "shopping",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["shopping"],
                addedProfit: 1
            }
        ]
    };
    playerModifiers.convenienceModifier3 = {
        type: "convenienceModifier3",
        title: "Liquor license",
        description: "Convenience store profits * 1.2",
        cost: 5000,
        unlockConditions: [
            {
                type: "shopping",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["shopping"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.fastFoodModifier1 = {
        type: "fastFoodModifier1",
        title: "Jumbo-size fries",
        description: "Fast food restaurants +1.5$ /s",
        cost: 700,
        unlockConditions: [
            {
                type: "fastfood",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                addedProfit: 1.5
            }
        ]
    };
    playerModifiers.fastFoodModifier2 = {
        type: "fastFoodModifier2",
        title: "Jumbo-size soda cups",
        description: "Fast food restaurants +4$ /s",
        cost: 2500,
        unlockConditions: [
            {
                type: "fastfood",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                addedProfit: 4
            }
        ]
    };
    playerModifiers.fastFoodModifier3 = {
        type: "fastFoodModifier3",
        title: "Jumbo-size diet soda cups",
        description: "Fast food restaurant profits * 1.3",
        cost: 7500,
        unlockConditions: [
            {
                type: "fastfood",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                multiplier: 1.3
            }
        ]
    };
    playerModifiers.apartmentModifier1 = {
        type: "apartmentModifier1",
        title: "Central heating",
        description: "Apartments +4$ /s",
        cost: 1500,
        unlockConditions: [
            {
                type: "apartment",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                addedProfit: 4
            }
        ]
    };
    playerModifiers.apartmentModifier2 = {
        type: "apartmentModifier2",
        title: "Air conditioning",
        description: "Apartments +8$ /s",
        cost: 5000,
        unlockConditions: [
            {
                type: "apartment",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                addedProfit: 8
            }
        ]
    };
    playerModifiers.apartmentModifier3 = {
        type: "apartmentModifier3",
        title: "Soundproof Walls",
        description: "Apartment profits * 1.2",
        cost: 15000,
        unlockConditions: [
            {
                type: "apartment",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.officeModifier1 = {
        type: "officeModifier1",
        title: "Red staplers",
        description: "Offices +8$ /s",
        cost: 5000,
        unlockConditions: [
            {
                type: "office",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["office"],
                addedProfit: 8
            }
        ]
    };
    playerModifiers.officeModifier2 = {
        type: "officeModifier2",
        title: "Ass-resistant photocopiers",
        description: "office profits * 1.2",
        cost: 15000,
        unlockConditions: [
            {
                type: "office",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["office"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.officeModifier3 = {
        type: "officeModifier3",
        title: "Ass-seeking photocopiers",
        description: "office profits * 1.5",
        cost: 50000,
        unlockConditions: [
            {
                type: "office",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["office"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.factoryModifier1 = {
        type: "factoryModifier1",
        title: "Steam powered factories",
        description: "Factories +15$ /s",
        cost: 50000,
        unlockConditions: [
            {
                type: "factory",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["factory"],
                addedProfit: 15
            }
        ]
    };
    playerModifiers.factoryModifier2 = {
        type: "factoryModifier2",
        title: "Electricity powered factories",
        description: "Factories +30$ /s",
        cost: 150000,
        unlockConditions: [
            {
                type: "factory",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["factory"],
                addedProfit: 30
            }
        ]
    };
    playerModifiers.factoryModifier3 = {
        type: "factoryModifier3",
        title: "Baby animal powered factories",
        description: "Factory profits * 1.5",
        cost: 500000,
        unlockConditions: [
            {
                type: "factory",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["factory"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.hotelModifier1 = {
        type: "hotelModifier1",
        title: "Heated swimming pool",
        description: "Hotels +30$ /s",
        cost: 200000,
        unlockConditions: [
            {
                type: "hotel",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                addedProfit: 30
            }
        ]
    };
    playerModifiers.hotelModifier2 = {
        type: "hotelModifier2",
        title: "Imported cleaning staff",
        description: "Building hotels is 15% cheaper",
        cost: 400000,
        unlockConditions: [
            {
                type: "hotel",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                buildCost: {
                    multiplier: 0.85
                }
            }
        ]
    };
    playerModifiers.hotelModifier3 = {
        type: "hotelModifier3",
        title: "Swim-up bar",
        description: "hotel profits * 1.5",
        cost: 500000,
        unlockConditions: [
            {
                type: "hotel",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                multiplier: 1.5
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
    playerModifiers.modifiersByUnlock = (function () {
        var base = {};

        for (var _mod in playerModifiers) {
            var modifier = playerModifiers[_mod];
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

    playerModifiers.allModifiers = (function () {
        var all = [];
        for (var _mod in playerModifiers) {
            if (playerModifiers[_mod].type) {
                all.push(playerModifiers[_mod]);
            }
        }
        return all;
    })();
})(playerModifiers || (playerModifiers = {}));
//# sourceMappingURL=playermodifiers.js.map
