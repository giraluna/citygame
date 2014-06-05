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

    function getPlacability(cell, type, exclusions, radius) {
        if (typeof radius === "undefined") { radius = 1; }
        var canPlace = true;

        if (exclusions) {
            var neighs = cell.getArea(radius);
            for (var i = 0; i < neighs.length; i++) {
                if (arrayLogic.or(exclusions, neighs[i].flags)) {
                    canPlace = false;
                    break;
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

    function placeStation(board, _stationType, includedArea) {
        var stationType = getIndexedType(_stationType);

        var invertedIncludedArea = 1 - includedArea;
        var horBorder = board.width / 2 * invertedIncludedArea;
        var vertBorder = board.height / 2 * invertedIncludedArea;
        var min = [horBorder, vertBorder];
        var max = [board.width - horBorder, board.height - vertBorder];

        var finalPosition;

        for (var i = 0; i < 100; i++) {
            if (finalPosition)
                break;

            var randX = randInt(min[0], max[0]);
            var randY = randInt(min[1], max[1]);

            var cell = board.getCell([randX, randY]);

            var canPlace = getPlacability(cell, stationType, ["water"], 3);

            if (canPlace) {
                finalPosition = [randX, randY];
                cell.changeContent(stationType);
            }
        }

        if (!finalPosition)
            throw new Error("Couldn't place station");
        else {
            cell.changeContent(stationType);
            return finalPosition;
        }
    }
    cityGeneration.placeStation = placeStation;

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

        var start = board.mapGenInfo.mainStationPos;

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
})(cityGeneration || (cityGeneration = {}));
//# sourceMappingURL=citygeneration.js.map
