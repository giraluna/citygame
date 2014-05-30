/// <reference path="../data/js/cg.d.ts" />
/// <reference path="js/utility.d.ts" />
/**
* add base land value
*
*
*/
var mapGeneration;
(function (mapGeneration) {
    function makeBlankMap(props) {
        props.height = props.height || props.width;

        var cells = [];

        // TODO circular reference
        var _ = window;
        var Cell = _.Cell;

        for (var i = 0; i < props.width; i++) {
            cells[i] = [];
            for (var j = 0; j < props.height; j++) {
                cells[i][j] = new Cell([i, j], cg["terrain"]["grass"], props.board);
            }
        }

        return cells;
    }
    mapGeneration.makeBlankMap = makeBlankMap;

    function readSavedMap(props) {
        var cells = props.board.cells;
        var typeIndexes = {};

        function getIndexedType(typeName) {
            if (!typeIndexes[typeName]) {
                typeIndexes[typeName] = findType(typeName);
            }

            return typeIndexes[typeName];
        }

        for (var i = 0; i < props.board.width; i++) {
            for (var j = 0; j < props.board.height; j++) {
                var cell = cells[i][j];
                var savedCell = props.savedCells[i][j];

                cell.replace(getIndexedType(savedCell.type));

                if (savedCell.content) {
                    cell.changeContent(getIndexedType(savedCell.content.type), true, savedCell.player);
                }
                if (savedCell.undergroundContent) {
                    cell.changeUndergroundContent(cg["content"]["tubes"]["tube_nesw"]);
                }
                if (savedCell.player) {
                    savedCell.player.addCell(cell);
                }
            }
        }
    }
    mapGeneration.readSavedMap = readSavedMap;

    function makeCoasts(props) {
        props.mapHeight = props.mapHeight || props.mapWidth;

        var coasts = (function getcoastDirectionsFN(props) {
            if (props.coasts) {
                return props.coasts;
            } else {
                var amountOfCoasts = props.amount;
                var directionOfCoasts = {
                    n: { hasCoast: false },
                    e: { hasCoast: false },
                    s: { hasCoast: false },
                    w: { hasCoast: false }
                };

                if (amountOfCoasts === undefined) {
                    var amountOfCoasts = 0;
                    var amountWeights = props.amountWeights || [0.5, 0.5, 0.5, 0];

                    for (var i = 0; i < amountWeights.length; i++) {
                        if (1 - Math.random() > amountWeights[i]) {
                            amountOfCoasts++;
                        } else
                            break;
                    }
                }
                if (amountOfCoasts === 0) {
                    for (var dir in directionOfCoasts) {
                        directionOfCoasts[dir].hasCoast = false;
                    }
                } else if (amountOfCoasts === 4) {
                    for (var dir in directionOfCoasts) {
                        directionOfCoasts[dir].hasCoast = true;
                    }
                } else {
                    var primaryCoast = getRandomKey(directionOfCoasts);
                    directionOfCoasts[primaryCoast].hasCoast = true;

                    var dirKeys = Object.keys(directionOfCoasts);

                    var primaryIndex = dirKeys.indexOf(primaryCoast);

                    var nextIndexOffset = Math.round(Math.random()) * 2 - 1;

                    for (var i = 1; i < amountOfCoasts; i++) {
                        var nextIndex = (primaryIndex + nextIndexOffset) % dirKeys.length;
                        if (nextIndex < 0)
                            nextIndex += dirKeys.length;

                        var nextKey = dirKeys[nextIndex];
                        directionOfCoasts[nextKey].hasCoast = true;
                        nextIndexOffset *= -1;
                    }
                }
                ;

                return directionOfCoasts;
            }
        })(props);

        for (var _dir in coasts) {
            var dir = coasts[_dir];
            if (dir.hasCoast) {
                var isHorizontal = (_dir === "n" || _dir === "s");
                var x = isHorizontal ? props.mapWidth : props.mapHeight;
                var y = isHorizontal ? props.mapHeight : props.mapWidth;

                dir.depth = dir.depth || props.depth || Math.floor(y / 5);
                dir.variation = dir.variation || props.variation || 0.05;
                dir.falloff = dir.falloff || props.falloff || 0.40;
                dir.falloffType = dir.falloffType || props.falloffType || "logarithmic";
                dir.landThreshhold = dir.landThreshhold || props.landThreshhold || 0.20;
            }

            var finalCoast = dir.finalCoast = [];

            for (var i = 0; i < dir.depth; i++) {
                finalCoast[i] = [];

                var falloff;

                switch (dir.falloffType) {
                    case "linear": {
                        falloff = 1 - dir.falloff * i;
                        break;
                    }
                    case "logarithmic": {
                        falloff = 1 - Math.log(1 + dir.falloff * i);
                        break;
                    }
                }
                for (var j = 0; j < x; j++) {
                    var n = (Math.random() + randRange(-dir.variation, dir.variation)) * falloff;
                    finalCoast[i][j] = n;
                }
            }
            ;
        }
        ;
        return coasts;
    }
    mapGeneration.makeCoasts = makeCoasts;

    function applyCoastsToBoard(props) {
        props.coastProps = props.coastProps || {};
        props.coastProps.mapWidth = props.board.width;
        props.coastProps.mapHeight = props.board.height;
        var coasts = makeCoasts(props.coastProps);

        for (var _dir in coasts) {
            var coast = coasts[_dir];
            if (coast.hasCoast) {
                switch (_dir) {
                    case "n":
                    case "w": {
                        coast.finalCoast = coast.finalCoast.reverse();
                        break;
                    }
                }
                ;

                switch (_dir) {
                    case "e":
                    case "w": {
                        var rotated = [];
                        for (var i = 0; i < coast.finalCoast.length; i++) {
                            for (var j = 0; j < coast.finalCoast[i].length; j++) {
                                if (!rotated[j])
                                    rotated[j] = [];
                                rotated[j][i] = coast.finalCoast[i][j];
                            }
                        }
                        coast.finalCoast = rotated;
                        break;
                    }
                }
                ;
                switch (_dir) {
                    case "w": {
                        coast.startPoint = [0, 0];
                        break;
                    }
                    case "n": {
                        coast.startPoint = [0, 0];
                        break;
                    }
                    case "e": {
                        coast.startPoint = [props.board.cells.length - coast.depth, 0];
                        break;
                    }
                    case "s": {
                        //coast.startPoint = [0, 0];
                        coast.startPoint = [0, props.board.cells.length - coast.depth];
                        break;
                    }
                }

                var typeIndexes = {};

                function getIndexedType(typeName) {
                    if (!typeIndexes[typeName]) {
                        typeIndexes[typeName] = findType(typeName);
                    }

                    return typeIndexes[typeName];
                }

                for (var i = 0; i < coast.finalCoast.length; i++) {
                    for (var j = 0; j < coast.finalCoast[i].length; j++) {
                        var x = coast.startPoint[0] + j;
                        var y = coast.startPoint[1] + i;
                        if (x > props.board.cells.length)
                            return;
                        if (y > props.board.cells.length)
                            return;

                        var type = (coast.finalCoast[i][j] > coast.landThreshhold) ? "grass" : "water";

                        props.board.cells[x][y].replace(getIndexedType(type));
                    }
                }
            }
        }
    }
    mapGeneration.applyCoastsToBoard = applyCoastsToBoard;
})(mapGeneration || (mapGeneration = {}));

function drawCoastInConsole(coast) {
    for (var i = 0; i < coast.finalCoast.length; i++) {
        var line = "" + i;
        var args = [""];
        for (var j = 0; j < coast.finalCoast[i].length; j++) {
            var c = (coast.finalCoast[i][j] > coast.landThreshhold) ? "#0F0" : "#00F";
            line += "%c    ";
            args.push("background: " + c);
        }
        args[0] = line;
        console.log.apply(console, args);
    }
    ;
}
//# sourceMappingURL=mapgeneration.js.map
