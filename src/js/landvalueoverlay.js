/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/utility.d.ts" />
function makeLandValueOverlay(board) {
    var cellsToOverlay = [];
    var minValue, maxValue;
    var colorIndexes = {};

    function getRelativeValue(val) {
        return (val - minValue) / (maxValue - minValue);
    }

    for (var i = 0; i < board.width; i++) {
        for (var j = 0; j < board.height; j++) {
            var cell = board.cells[i][j];
            if (cell.type.type !== "water") {
                if (!minValue) {
                    minValue = maxValue = cell.landValue;
                } else {
                    if (cell.landValue < minValue)
                        minValue = cell.landValue;
                    else if (cell.landValue > maxValue)
                        maxValue = cell.landValue;
                }

                cellsToOverlay.push({
                    value: cell.landValue,
                    sprite: cell.sprite
                });
            }
        }
    }

    var container = new PIXI.DisplayObjectContainer();

    for (var i = 0; i < cellsToOverlay.length; i++) {
        var cell = cellsToOverlay[i];

        if (!colorIndexes[cell.value]) {
            var hue = 100 - 100 * getRelativeValue(cell.value);

            colorIndexes[cell.value] = hslToHex(hue / 360, 1, 0.5);
        }

        var color = colorIndexes[cell.value];

        var _s = PIXI.Sprite.fromFrame("blank.png");
        _s.position = cell.sprite.position.clone();
        _s.anchor = cell.sprite.anchor.clone();
        _s.tint = color;

        container.addChild(_s);
    }

    return container;
}
//# sourceMappingURL=landvalueoverlay.js.map
