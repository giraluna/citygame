/// <reference path="../src/js/arraylogic.d.ts" />
var cellModifiers;
(function (cellModifiers) {
    function niceEnviroment(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "niceEnviroment",
            title: "Nice enviroment",
            range: range,
            strength: strength,
            targets: ["apartment"],
            effect: {
                multiplier: 0.1
            },
            landValue: {
                radius: 4,
                multiplier: 0.1,
                scalingFN: function (strength) {
                    return 1 + Math.log(strength / 2);
                }
            }
        });
    }
    cellModifiers.niceEnviroment = niceEnviroment;

    function crowded(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "crowded",
            title: "Crowded",
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
            title: "Nearby customers",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping"],
            effect: {
                addedProfit: 0.1
            },
            scaling: function (strength) {
                return strength;
            },
            landValue: {
                radius: 4,
                multiplier: 0.01
            }
        });
    }
    cellModifiers.population = population;

    function fastfoodCompetition(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "fastfoodCompetition",
            title: "Competing restaurants",
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
            title: "Competing stores",
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
            title: "Nearby stores",
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
            title: "Nearby station",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping", "office", "apartment"],
            effect: {
                addedProfit: 0.5,
                multiplier: 0.2
            },
            landValue: {
                radius: 20,
                multiplier: 0.05,
                falloffFN: function (distance, invertedDistance, invertedDistanceRatio) {
                    return invertedDistance * invertedDistanceRatio;
                }
            }
        });
    }
    cellModifiers.nearbyStation = nearbyStation;

    function parkingCompetition(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "parkingCompetition",
            title: "Competing stores",
            range: range,
            strength: strength,
            targets: ["parking"],
            effect: {
                addedProfit: -0.075,
                multiplier: -0.15
            }
        });
    }
    cellModifiers.parkingCompetition = parkingCompetition;

    function nearbyParking(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyParking",
            title: "Nearby parking",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping"],
            effect: {
                addedProfit: 0.1
            }
        });
    }
    cellModifiers.nearbyParking = nearbyParking;

    function nearbyFactory(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyFactory",
            title: "Nearby Factory",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping", "apartment", "office"],
            effect: {
                addedProfit: -0.2,
                multiplier: -0.2
            },
            scaling: function (strength) {
                return strength;
            },
            landValue: {
                radius: 5,
                multiplier: -0.1,
                falloffFN: function (distance, invertedDistance, invertedDistanceRatio) {
                    return invertedDistance * invertedDistanceRatio / 2;
                }
            }
        });
    }
    cellModifiers.nearbyFactory = nearbyFactory;
})(cellModifiers || (cellModifiers = {}));
//# sourceMappingURL=cellmodifiers.js.map
