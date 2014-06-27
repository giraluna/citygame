/// <reference path="../lib/pixi.d.ts" />
function getFrom2dArray(target, arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if ((arr[i] !== undefined) && (arr[i][0] >= 0 && arr[i][0] < target.length) && (arr[i][1] >= 0 && arr[i][1] < target.length)) {
            result.push(target[arr[i][0]][arr[i][1]]);
        }
    }
    ;
    return result;
}

function getRandomKey(target) {
    var _targetKeys = Object.keys(target);
    var _rnd = Math.floor(Math.random() * (_targetKeys.length));
    return _targetKeys[_rnd];
}

function getRandomProperty(target) {
    var _rndProp = target[getRandomKey(target)];
    return _rndProp;
}

function getRandomArrayItem(target) {
    var _rnd = Math.floor(Math.random() * (target.length));
    return target[_rnd];
}

function setDeepProperties(baseObj, target, props) {
    if (target.length <= 0) {
        for (var prop in props) {
            baseObj[prop] = props[prop];
        }
        return baseObj;
    } else {
        var targetProp = target.shift();

        if (!baseObj.hasOwnProperty(targetProp)) {
            baseObj[targetProp] = {};
        }
        var newBaseObj = baseObj[targetProp];

        return setDeepProperties(newBaseObj, target, props);
    }
}

function deepDestroy(object) {
    if (object.texture) {
        if (object.texture.baseTexture.source._pixiId) {
            PIXI.Texture.removeTextureFromCache(object.texture.baseTexture.source._pixiId);
        }
        object.texture.destroy(true);
    }

    if (!object.children || object.children.length <= 0) {
        return;
    } else {
        for (var i = 0; i < object.children.length; i++) {
            deepDestroy(object.children[i]);
        }
    }
}

function rectToIso(width, height) {
    var top = [width / 2, 0];
    var right = [width, height / 2];
    var bot = [width / 2, height];
    var left = [0, height / 2];

    return [top, right, bot, left];
}

function getOrthoCoord(click, tileSize, worldSize) {
    var tileX = click[0] / tileSize[0] + click[1] / tileSize[1] - worldSize[0] / 2;
    var tileY = click[1] / tileSize[1] - click[0] / tileSize[0] + worldSize[1] / 2;

    return [Math.floor(tileX), Math.floor(tileY)];
}

function getIsoCoord(x, y, width, height, offset) {
    var _w2 = width / 2;
    var _h2 = height / 2;
    var _isoX = (x - y) * _w2;
    var _isoY = (x + y) * _h2;
    if (offset) {
        _isoX += offset[0];
        _isoY += offset[1];
    }
    return [_isoX, _isoY];
}

function getTileScreenPosition(x, y, tileSize, worldSize, container) {
    var wt = container.worldTransform;
    var zoom = wt.a;
    var offset = [
        wt.tx + worldSize[0] / 2 * zoom,
        wt.ty + tileSize[1] / 2 * zoom];
    tileSize[0] *= zoom;
    tileSize[1] *= zoom;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

function rollDice(dice, sides) {
    var total = 0;
    for (var i = 0; i < dice; i++) {
        total += randInt(1, sides);
    }
    return total;
}

function spritesheetToImages(sheetData, baseUrl) {
    var sheetImg = new Image();
    sheetImg.src = baseUrl + sheetData.meta.image;

    var frames = {};

    (function splitSpritesheetFN() {
        for (var sprite in sheetData.frames) {
            var frame = sheetData.frames[sprite].frame;
            var newFrame = frames[sprite] = new Image(frame.w, frame.h);

            var canvas = document.createElement("canvas");
            canvas.width = frame.w;
            canvas.height = frame.h;
            var context = canvas.getContext("2d");

            context.drawImage(sheetImg, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);

            newFrame.src = canvas.toDataURL();
            frames[sprite] = newFrame;
        }
    }());

    return frames;
}

function addClickAndTouchEventListener(target, callback) {
    function execClickCallback(e) {
        e.preventDefault();
        callback.call();
    }
    target.addEventListener("click", execClickCallback);
    target.addEventListener("touchend", execClickCallback);
}

/**
* http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
*
* Converts an HSL color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes h, s, and l are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   Number  h       The hue
* @param   Number  s       The saturation
* @param   Number  l       The lightness
* @return  Array           The RGB representation
*/
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r, g, b];
}

function hslToHex(h, s, l) {
    return PIXI.rgb2hex(hslToRgb(h, s, l));
}

function getNeighbors(targetArray, gridPos, diagonal) {
    if (typeof diagonal === "undefined") { diagonal = false; }
    var neighbors = {
        n: undefined,
        e: undefined,
        s: undefined,
        w: undefined,
        ne: undefined,
        nw: undefined,
        se: undefined,
        sw: undefined
    };
    var hasNeighbor = {
        n: undefined,
        e: undefined,
        s: undefined,
        w: undefined
    };
    var cells = targetArray;
    var sizeX = targetArray.length;
    var sizeY = targetArray[0].length;
    var x = gridPos[0];
    var y = gridPos[1];

    hasNeighbor.s = (y + 1 < sizeY) ? true : false;
    hasNeighbor.e = (x + 1 < sizeX) ? true : false;
    hasNeighbor.n = (y - 1 >= 0) ? true : false;
    hasNeighbor.w = (x - 1 >= 0) ? true : false;

    neighbors.s = hasNeighbor["s"] ? cells[x][y + 1] : undefined;
    neighbors.e = hasNeighbor["e"] ? cells[x + 1][y] : undefined;
    neighbors.n = hasNeighbor["n"] ? cells[x][y - 1] : undefined;
    neighbors.w = hasNeighbor["w"] ? cells[x - 1][y] : undefined;

    if (diagonal === true) {
        neighbors.ne = (hasNeighbor["n"] && hasNeighbor["e"]) ? cells[x + 1][y - 1] : undefined;
        neighbors.nw = (hasNeighbor["n"] && hasNeighbor["w"]) ? cells[x - 1][y - 1] : undefined;
        neighbors.se = (hasNeighbor["s"] && hasNeighbor["e"]) ? cells[x + 1][y + 1] : undefined;
        neighbors.sw = (hasNeighbor["s"] && hasNeighbor["w"]) ? cells[x - 1][y + 1] : undefined;
    }

    return neighbors;
}

// TODO really stupid and inefficient
function getDistanceFromCell(cells, center, maxDistance, diagonal) {
    if (typeof diagonal === "undefined") { diagonal = false; }
    maxDistance++;

    var toAnalyze = [];
    var indexedDistances = {};
    for (var i = 0; i < center.length; i++) {
        indexedDistances[center[i].gridPos] = {
            item: center[i],
            distance: 1,
            invertedDistance: maxDistance,
            invertedDistanceRatio: 1
        };
        toAnalyze.push(center[i]);
    }

    while (toAnalyze.length > 0) {
        var current = toAnalyze.shift();
        var neighbors;
        if (current.getNeighbors !== undefined) {
            neighbors = current.getNeighbors(diagonal);
        } else {
            neighbors = getNeighbors(cells, current.gridPos, diagonal);
        }

        for (var direction in neighbors) {
            var neigh = neighbors[direction];
            if (neigh !== undefined && indexedDistances[neigh.gridPos] === undefined) {
                var weight = 1;
                if (diagonal && ["ne", "nw", "se", "sw"].indexOf(direction) !== -1) {
                    weight = 1.375;
                }

                var dist = indexedDistances[current.gridPos].distance + weight;
                if (dist > maxDistance) {
                    break;
                }

                indexedDistances[neigh.gridPos] = {
                    item: neigh,
                    distance: dist,
                    invertedDistance: maxDistance + 1 - dist,
                    invertedDistanceRatio: (maxDistance + 1 - dist) / maxDistance
                };
                toAnalyze.push(neigh);
            }
        }
    }
    return indexedDistances;
}

function getArea(props) {
    var targetArray = props.targetArray;

    var centerSize = props.centerSize || [1, 1];

    var start = props.start;
    var end = [start[0] + centerSize[0] - 1, start[1] + centerSize[1] - 1];

    var size = props.size;
    var anchor = props.anchor || "center";
    var excludeStart = props.excludeStart || false;

    var newStart = start.slice(0);
    var newEnd = end.slice(0);

    var adjust = [[0, 0], [0, 0]];

    if (anchor === "center") {
        adjust = [[-1, -1], [1, 1]];
    }
    ;
    if (anchor === "ne") {
        adjust[1] = [-1, 1];
    }
    ;
    if (anchor === "se") {
        adjust[1] = [-1, -1];
    }
    ;
    if (anchor === "sw") {
        adjust[1] = [1, -1];
    }
    ;
    if (anchor === "nw") {
        adjust[1] = [1, 1];
    }
    ;

    for (var i = 0; i < size; i++) {
        newStart[0] += adjust[0][0];
        newStart[1] += adjust[0][1];
        newEnd[0] += adjust[1][0];
        newEnd[1] += adjust[1][1];
    }
    var rect = rectSelect(newStart, newEnd);

    if (excludeStart) {
        rect = rect.filter(function (pos) {
            if (!(pos[0] >= start[0] && pos[0] <= end[0] && pos[1] >= start[1] && pos[1] <= end[1])) {
                return pos;
            }
        });
    }

    return getFrom2dArray(targetArray, rect);
}

function singleSelect(a, b) {
    return [b];
}

function rectSelect(a, b) {
    var cells = [];
    var xLen = Math.abs(a[0] - b[0]);
    var yLen = Math.abs(a[1] - b[1]);
    var xDir = (b[0] < a[0]) ? -1 : 1;
    var yDir = (b[1] < a[1]) ? -1 : 1;
    var x, y;
    for (var i = 0; i <= xLen; i++) {
        x = a[0] + i * xDir;
        for (var j = 0; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([x, y]);
        }
    }
    return cells;
}

function manhattanSelect(a, b) {
    var xLen = Math.abs(a[0] - b[0]);
    var yLen = Math.abs(a[1] - b[1]);
    var xDir = (b[0] < a[0]) ? -1 : 1;
    var yDir = (b[1] < a[1]) ? -1 : 1;
    var y, x;
    var cells = [];
    if (xLen >= yLen) {
        for (var i = 0; i <= xLen; i++) {
            x = a[0] + i * xDir;
            cells.push([x, a[1]]);
        }
        for (var j = 1; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([b[0], y]);
        }
    } else {
        for (var j = 0; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([a[0], y]);
        }
        for (var i = 1; i <= xLen; i++) {
            x = a[0] + i * xDir;
            cells.push([x, b[1]]);
        }
    }
    return cells;
}
function arrayToPolygon(points) {
    var _points = [];
    for (var i = 0; i < points.length; i++) {
        _points.push(new PIXI.Point(points[i][0], points[i][1]));
    }
    return new PIXI.Polygon(_points);
}

function arrayToPoint(point) {
    return new PIXI.Point(point[0], point[1]);
}

function getReverseDir(dir) {
    switch (dir) {
        case "n": {
            return "s";
        }
        case "s": {
            return "n";
        }
        case "e": {
            return "w";
        }
        case "w": {
            return "e";
        }
        case "ne": {
            return "sw";
        }
        case "nw": {
            return "se";
        }
        case "se": {
            return "nw";
        }
        case "sw": {
            return "ne";
        }
    }
}

// https://github.com/Icehawk78/FrozenCookies/blob/master/fc_main.js#L132
// license?: https://github.com/Icehawk78/FrozenCookies/issues/45
function formatEveryThirdPower(notations) {
    return function (value) {
        var base = 0, notationValue = '';
        if (value >= 1000000 && isFinite(value)) {
            value /= 1000;
            while (Math.round(value) >= 1000) {
                value /= 1000;
                base++;
            }
            if (base > notations.length) {
                return 'Infinity';
            } else {
                notationValue = notations[base];
            }
        }
        return ((Math.round(value * 1000) / 1000).toFixed(2)) + notationValue;
    };
}

function rawFormatter(value) {
    return Math.round((value * 1000) / 1000);
}

var numberFormatters = [
    rawFormatter,
    formatEveryThirdPower([
        '',
        '',
        ' billion',
        ' trillion',
        ' quadrillion',
        ' quintillion',
        ' sextillion',
        ' septillion',
        ' octillion',
        ' nonillion',
        ' decillion'
    ]),
    formatEveryThirdPower([
        '',
        ' M',
        ' B',
        ' T',
        ' Qa',
        ' Qi',
        ' Sx',
        ' Sp',
        ' Oc',
        ' No',
        ' De'
    ])
];

function beautify(value, formatterIndex) {
    if (typeof formatterIndex === "undefined") { formatterIndex = 0; }
    var negative = (value < 0);
    value = Math.abs(value);
    var formatter = numberFormatters[formatterIndex];
    var output = formatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return negative ? '-' + output : output;
}
//# sourceMappingURL=utility.js.map
