/// <reference path="../src/js/arraylogic.d.ts" />
var cellModifiers;
(function (cellModifiers) {
    function testModifier(range, strength) {
        if (typeof range === "undefined") { range = 1; }
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "testModifier",
            range: range,
            strength: strength,
            targets: ["apartment"],
            effect: cellModifiers.effects.testEffect
        });
    }
    cellModifiers.testModifier = testModifier;

    cellModifiers.effects = {
        testEffect: {
            addedProfit: 10,
            multiplier: 0.25
        }
    };
})(cellModifiers || (cellModifiers = {}));
//# sourceMappingURL=cellmodifiers.js.map
