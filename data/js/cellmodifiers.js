/// <reference path="../src/js/arraylogic.d.ts" />
var cellModifiers;
(function (cellModifiers) {
    function testModifier(range, strength) {
        if (typeof range === "undefined") { range = 1; }
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "testModifier",
            translate: "Nice enviroment",
            range: range,
            strength: strength,
            targets: ["apartment"],
            effect: cellModifiers.effects.testEffect
        });
    }
    cellModifiers.testModifier = testModifier;

    function testModifier2(range, strength) {
        if (typeof range === "undefined") { range = 1; }
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "testModifier2",
            translate: "Overcrowding",
            range: range,
            strength: strength,
            targets: ["apartment"],
            effect: cellModifiers.effects.testEffect2
        });
    }
    cellModifiers.testModifier2 = testModifier2;

    cellModifiers.effects = {
        testEffect: {
            multiplier: 0.25
        },
        testEffect2: {
            addedProfit: -0.1,
            multiplier: -0.15
        }
    };
})(cellModifiers || (cellModifiers = {}));
//# sourceMappingURL=cellmodifiers.js.map
