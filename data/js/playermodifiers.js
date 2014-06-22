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

    playerModifiers.clickModifier1 = {
        type: "clickModifier1",
        title: "Hardly working",
        description: "+0.2$ / click",
        cost: 50,
        unlockConditions: ["default"],
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
        description: "clicks * 1.2",
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
        description: "clicks * 1.2",
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
        description: "clicks * 1.5",
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
                type: "parkinglot",
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
                type: "parkinglot",
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
        title: "Valet service",
        //description: "Hire a professional Parker",
        description: "Parking profits * 1.2",
        cost: 2000,
        unlockConditions: [
            {
                type: "parkinglot",
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
    playerModifiers.convenienceModifier1 = {
        type: "convenienceModifier1",
        title: "Bigger soda cups",
        description: "Convenience stores +0.5$ /s",
        cost: 300,
        unlockConditions: [
            {
                type: "conveniencestore",
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
        title: "Hot dog meat efficiency",
        description: "You don't want to know (+1$/s)",
        cost: 1500,
        unlockConditions: [
            {
                type: "conveniencestore",
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
        title: "Lottery tickets",
        description: "Convenience store profits * 1.2",
        cost: 5000,
        unlockConditions: [
            {
                type: "conveniencestore",
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
    playerModifiers.apartmentModifier1 = {
        type: "apartmentModifier1",
        title: "Central heating",
        description: "Apartments +2$ /s",
        cost: 1500,
        unlockConditions: [
            {
                type: "house1",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                addedProfit: 2
            }
        ]
    };
    playerModifiers.apartmentModifier2 = {
        type: "apartmentModifier2",
        title: "Air conditioning",
        description: "Apartments +4$ /s",
        cost: 5000,
        unlockConditions: [
            {
                type: "house1",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                addedProfit: 4
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
                type: "house1",
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
        title: "Swingline Staplers",
        description: "Offices +4$ /s",
        cost: 5000,
        unlockConditions: [
            {
                type: "smalloffice",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["office"],
                addedProfit: 4
            }
        ]
    };
    playerModifiers.officeModifier2 = {
        type: "officeModifier2",
        title: "Ass-resistant photocopiers",
        description: "Offices +6$ /s",
        cost: 15000,
        unlockConditions: [
            {
                type: "smalloffice",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["office"],
                addedProfit: 6
            }
        ]
    };
    playerModifiers.officeModifier3 = {
        type: "officeModifier3",
        title: "Ass-seeking photocopiers",
        description: "office profits * 1.2",
        cost: 50000,
        unlockConditions: [
            {
                type: "smalloffice",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["office"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.factoryModifier1 = {
        type: "factoryModifier1",
        title: "Steam powered factories",
        description: "Factories +4$ /s",
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
                addedProfit: 20
            }
        ]
    };
    playerModifiers.factoryModifier2 = {
        type: "factoryModifier2",
        title: "Electricity powered factories",
        description: "Factories +6$ /s",
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
                addedProfit: 50
            }
        ]
    };
    playerModifiers.factoryModifier3 = {
        type: "factoryModifier3",
        title: "Baby animal powered factories",
        description: "Factory profits * 1.2",
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
