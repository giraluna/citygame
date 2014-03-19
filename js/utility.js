/// <reference path="../lib/pixi.d.ts" />
function getFrom2dArray(target, arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if ((arr[i][0] >= 0 && arr[i][0] < target.length) && (arr[i][1] >= 0 && arr[i][1] < target.length)) {
            result.push(target[arr[i][0]][arr[i][1]]);
        }
    }
    ;
    return result;
}

function getRandomProperty(target) {
    var _targetKeys = Object.keys(target);
    var _rnd = Math.floor(Math.random() * (_targetKeys.length));
    var _rndProp = target[_targetKeys[_rnd]];
    return _rndProp;
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
//# sourceMappingURL=utility.js.map
