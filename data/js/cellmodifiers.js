/// <reference path="../src/js/arraylogic.d.ts" />
var cellModifiers;
(function (cellModifiers) {
    function niceEnviroment(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "niceEnviroment",
            translate: "Nice enviroment",
            range: range,
            strength: strength,
            targets: ["apartment"],
            effect: {
                multiplier: 0.1
            },
            landValue: {
                valueChange: 2,
                multiplier: 0.1
            }
        });
    }
    cellModifiers.niceEnviroment = niceEnviroment;

    function crowded(range, strength) {
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
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "population",
            translate: "Nearby customers",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping"],
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
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "fastfoodCompetition",
            translate: "Competing restaurants",
            range: range,
            strength: strength,
            targets: ["fastfood"],
            effect: {
                addedProfit: -0.15,
                multiplier: -0.25
            }
        });
    }
    cellModifiers.fastfoodCompetition = fastfoodCompetition;

    function shoppingCompetition(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "shoppingCompetition",
            translate: "Competing stores",
            range: range,
            strength: strength,
            targets: ["shopping"],
            effect: {
                addedProfit: -0.075,
                multiplier: -0.15
            }
        });
    }
    cellModifiers.shoppingCompetition = shoppingCompetition;

    function nearbyShopping(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyShopping",
            translate: "Nearby stores",
            range: range,
            strength: strength,
            targets: ["fastfood"],
            effect: {
                addedProfit: 0.2
            }
        });
    }
    cellModifiers.nearbyShopping = nearbyShopping;

    function nearbyStation(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyStation",
            translate: "Nearby station",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping", "office", "apartment"],
            effect: {
                addedProfit: 0.5,
                multiplier: 0.2
            },
            landValue: {
                valueChange: 2,
                multiplier: 0.2
            }
        });
    }
    cellModifiers.nearbyStation = nearbyStation;
})(cellModifiers || (cellModifiers = {}));
//# sourceMappingURL=cellmodifiers.js.map
