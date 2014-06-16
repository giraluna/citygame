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
})(playerModifiers || (playerModifiers = {}));
//# sourceMappingURL=playermodifiers.js.map
