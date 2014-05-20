/// <reference path="../src/js/arraylogic.d.ts" />
var cellModifiers;
(function (cellModifiers) {
    function niceEnviroment(range, strength) {
        if (typeof range === "undefined") { range = 1; }
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "niceEnviroment",
            translate: "Nice enviroment",
            range: range,
            strength: strength,
            targets: ["apartment"],
            effect: {
                multiplier: 0.25
            }
        });
    }
    cellModifiers.niceEnviroment = niceEnviroment;

    function crowded(range, strength) {
        if (typeof range === "undefined") { range = 1; }
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "crowded",
            translate: "Crowded",
            range: range,
            strength: strength,
            targets: ["apartment"],
            effect: {
                addedProfit: -0.1,
                multiplier: -0.15
            }
        });
    }
    cellModifiers.crowded = crowded;

    function population(range, strength) {
        if (typeof range === "undefined") { range = 1; }
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "population",
            translate: "Nearby customers",
            range: range,
            strength: strength,
            targets: ["fastfood"],
            effect: {
                addedProfit: 0.1
            },
            scaling: function (strength) {
                return strength;
            }
        });
    }
    cellModifiers.population = population;

    function fastfoodCompetition(range, strength) {
        if (typeof range === "undefined") { range = 1; }
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "fastfoodCompetition",
            translate: "Competing restaurants",
            range: range,
            strength: strength,
            targets: ["fastfood"],
            effect: {
                addedProfit: -0.2,
                multiplier: -0.35
            }
        });
    }
    cellModifiers.fastfoodCompetition = fastfoodCompetition;
})(cellModifiers || (cellModifiers = {}));
//# sourceMappingURL=cellmodifiers.js.map
