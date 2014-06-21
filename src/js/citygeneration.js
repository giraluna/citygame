/// <reference path="../data/js/cg.d.ts" />
/// <reference path="js/utility.d.ts" />
/// <reference path="js/arraylogic.d.ts" />
var cityGeneration;
(function (cityGeneration) {
    var typeIndexes = {};
    function getIndexedType(typeName) {
        if (!typeIndexes[typeName]) {
            typeIndexes[typeName] = findType(typeName);
        }

        return typeIndexes[typeName];
    }

    function getPlacability(cell, type, exclusions) {
        var canPlace = true;

        if (exclusions) {
            for (var i = 0; i < exclusions.length; i++) {
                var excludedFlags = exclusions[i].flags;

                var neighs = cell.getArea({ size: exclusions[i].radius });

                for (var j = 0; j < neighs.length; j++) {
                    if (arrayLogic.or(excludedFlags, neighs[j].flags)) {
                        canPlace = false;
                        break;
                    } else if (neighs[j].content && arrayLogic.or(excludedFlags, neighs[j].content.flags)) {
                        canPlace = false;
                        break;
                    }
                }
            }
        }
        ;

        if (!cell.checkBuildable(type)) {
            canPlace = false;
        }
        ;

        return canPlace;
    }

    function placeBuilding(board, _buildingType, includedArea, exclusions) {
        var buildingType = getIndexedType(_buildingType);

        var invertedIncludedArea = 1 - includedArea;
        var horBorder = board.width / 2 * invertedIncludedArea;
        var vertBorder = board.height / 2 * invertedIncludedArea;
        var min = [horBorder, vertBorder];
        var max = [board.width - horBorder - 1, board.height - vertBorder - 1];

        var finalPosition;

        for (var i = 0; i < 100; i++) {
            var randX = randInt(min[0], max[0]);
            var randY = randInt(min[1], max[1]);

            var cell = board.getCell([randX, randY]);

            var canPlace = getPlacability(cell, buildingType, exclusions);

            if (canPlace) {
                finalPosition = [randX, randY];
                break;
            }
        }

        if (!finalPosition)
            throw new Error("Couldn't place building");
        else {
            cell.changeContent(buildingType);
            return finalPosition;
        }
    }
    cityGeneration.placeBuilding = placeBuilding;

    function placeMainSubwayLines(board) {
        var connectedToLand = [];

        for (var dir in board.mapGenInfo.coasts) {
            if (board.mapGenInfo.coasts[dir].hasCoast !== true) {
                connectedToLand.push(dir);
            }
        }
        if (connectedToLand.length < 1) {
            connectedToLand.push(getRandomArrayItem(["n", "e", "s", "w"]));
        }

        var start = board.mapGenInfo.mainStationPos.slice(0);

        for (var i = 0; i < connectedToLand.length; i++) {
            var dir = connectedToLand[i];
            var end;

            switch (dir) {
                case "w": {
                    end = [0, start[1]];
                    break;
                }
                case "n": {
                    end = [start[0], 0];
                    break;
                }
                case "e": {
                    end = [board.width - 1, start[1]];
                    break;
                }
                case "s": {
                    end = [start[0], board.height - 1];
                    break;
                }
            }

            var toChange = board.getCells(manhattanSelect(start, end));
            for (var j = 0; j < toChange.length; j++) {
                toChange[j].changeUndergroundContent(cg["content"]["tubes"]["tube_nesw"]);
            }
        }
    }
    cityGeneration.placeMainSubwayLines = placeMainSubwayLines;

    function placeStationRoads(board) {
        var connectedToLand = {};
        var hasConnection = false;

        for (var dir in board.mapGenInfo.coasts) {
            if (board.mapGenInfo.coasts[dir].hasCoast !== true) {
                connectedToLand[dir] = true;
                hasConnection = true;
            }
        }
        if (!hasConnection) {
            var randDir = getRandomArrayItem(["n", "e", "s", "w"]);
            connectedToLand[randDir] = true;
        }
        var start = board.mapGenInfo.mainStationPos.slice(0);

        var adjust = [0, 0];
        var adjustMappings = {
            n: [0, 1],
            s: [0, -1],
            e: [-1, 0],
            w: [1, 0]
        };

        var landDirs = Object.keys(connectedToLand);
        var horDirs = [];
        var verDirs = [];

        ["n", "s"].forEach(function (dir) {
            if (landDirs.indexOf(dir) !== -1)
                verDirs.push(dir);
        });
        ["e", "w"].forEach(function (dir) {
            if (landDirs.indexOf(dir) !== -1)
                horDirs.push(dir);
        });

        [horDirs, verDirs].forEach(function (dirSet) {
            if (dirSet.length === 1) {
                var side = landDirs.length > 1 ? 1 : 0;
                adjust[0] += adjustMappings[dirSet[0]][0] * side;
                adjust[1] += adjustMappings[dirSet[0]][1] * side;
            } else {
                var dirToModify = adjust[0] === 0 ? 0 : 1;
                adjust[dirToModify] += Math.round(Math.random()) * 2 - 1; //-1 or 1
            }
        });
        start[0] += adjust[0];
        start[1] += adjust[1];

        for (var dir in connectedToLand) {
            var end;

            switch (dir) {
                case "w": {
                    end = [0, start[1]];
                    break;
                }
                case "n": {
                    end = [start[0], 0];
                    break;
                }
                case "e": {
                    end = [board.width - 1, start[1]];
                    break;
                }
                case "s": {
                    end = [start[0], board.height - 1];
                    break;
                }
            }

            var toChange = board.getCells(manhattanSelect(start, end));
            for (var j = 0; j < toChange.length; j++) {
                toChange[j].changeContent(cg["content"]["roads"]["road_nesw"]);
            }
        }
    }
    cityGeneration.placeStationRoads = placeStationRoads;

    function placeInitialHousing(board) {
        var populationToPlace = board.population;

        // TODO
        var apartmentBuildings = [];
        for (var _b in cg.content.buildings) {
            if (cg.content.buildings[_b].categoryType === "apartment" && cg.content.buildings[_b].population === 5) {
                apartmentBuildings.push(_b);
            }
        }

        while (populationToPlace > 0) {
            var buildingToPlace = getRandomArrayItem(apartmentBuildings);

            placeBuilding(board, buildingToPlace, 0.9, [
                { radius: 1, flags: ["water"] }
            ]);
            populationToPlace -= getIndexedType(buildingToPlace).population;
        }
    }
    cityGeneration.placeInitialHousing = placeInitialHousing;
})(cityGeneration || (cityGeneration = {}));
//# sourceMappingURL=citygeneration.js.map
