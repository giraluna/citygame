var playerModifiers;
(function (playerModifiers) {
    playerModifiers.testModifier = {
        type: "testModifier",
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
        title: "clickModifier1",
        description: "0.1 / click",
        cost: 50,
        effects: [
            {
                targets: ["click"],
                addedProfit: 0.1
            }
        ]
    };
    playerModifiers.clickModifier2 = {
        type: "clickModifier2",
        title: "clickModifier2",
        description: "0.5 / click",
        cost: 200,
        effects: [
            {
                targets: ["click"],
                addedProfit: 0.5
            }
        ]
    };
    playerModifiers.clickModifier3 = {
        type: "clickModifier3",
        title: "clickModifier3",
        description: "clicks * 1.2",
        cost: 1000,
        effects: [
            {
                targets: ["click"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.clickModifier4 = {
        type: "clickModifier4",
        title: "clickModifier4",
        description: "clicks * 1.2",
        cost: 5000,
        effects: [
            {
                targets: ["click"],
                multiplier: 1.2
            }
        ]
    };
})(playerModifiers || (playerModifiers = {}));
//# sourceMappingURL=playermodifiers.js.map
