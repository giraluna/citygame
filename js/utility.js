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

function arrayLogic(logic, array1, array2) {
    var regexes = {
        and: /(and)|&/i,
        not: /(not)|!/i,
        or: /(or)|\^/i
    };

    var mode;
    for (var re in regexes) {
        if (regexes[re].test(logic))
            mode = re;
    }
    if (!mode)
        throw new Error("faulty parameter: " + logic);
    switch (mode) {
        case "and": {
            return arrayLogic.and(array1, array2);
        }
        case "not": {
            return arrayLogic.not(array1, array2);
        }
        case "or": {
            return arrayLogic.or(array1, array2);
        }
    }
}

arrayLogic.and = function (array1, array2) {
    if (!arrayLogic.inputIsValid(array1, array2)) {
        return undefined;
    }
    var matchFound;
    for (var i = 0; i < array1.length; i++) {
        matchFound = false;
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] === array2[j]) {
                matchFound = true;
                break;
            }
        }
    }
    return matchFound;
};

arrayLogic.or = function (array1, array2) {
    if (!arrayLogic.inputIsValid(array1, array2)) {
        return undefined;
    }
    var matchFound;
    for (var i = 0; i < array1.length; i++) {
        matchFound = false;
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] === array2[j]) {
                return !matchFound;
            }
        }
    }
    return matchFound;
};

arrayLogic.not = function (array1, array2) {
    return !arrayLogic.or(array1, array2);
};

arrayLogic.inputIsValid = function (array1, array2) {
    for (var i = 0; i < arguments.length; i++) {
        if (!arguments[i] || !(arguments[i] instanceof Array) || arguments[i].length === 0) {
            return false;
        }
    }
    return true;
};
//# sourceMappingURL=utility.js.map
