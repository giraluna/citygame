/// <reference path="../lib/pixi.d.ts" />
///
/// <reference path="js/eventlistener.d.ts" />
///
var Highlighter = (function () {
    function Highlighter() {
        this.currHighlighted = [];
        this.blinkGroups = {};
        this.idGenerator = 0;
        this.blinkIntervals = {};
    }
    Highlighter.prototype.tintSprites = function (sprites, color) {
        for (var i = 0; i < sprites.length; i++) {
            var _sprite = sprites[i];
            _sprite.tint = color;
            this.currHighlighted.push(sprites[i]);
        }
    };
    Highlighter.prototype.clearSprites = function () {
        for (var i = 0; i < this.currHighlighted.length; i++) {
            var _sprite = this.currHighlighted[i];
            _sprite.tint = 0xFFFFFF;
        }
        this.currHighlighted = [];
    };
    Highlighter.prototype.tintCells = function (cells, color) {
        var _sprites = [];
        for (var i = 0; i < cells.length; i++) {
            _sprites.push(cells[i].sprite);
            if (cells[i].content !== undefined) {
                _sprites.push(cells[i].content.sprite);
            }
        }
        this.tintSprites(_sprites, color);
    };
    Highlighter.prototype.tintByBlinkKey = function (key, color) {
        var cells = [];
        for (var cell in this.blinkGroups[key]) {
            cells = cells.concat(this.blinkGroups[key][cell]);
        }
        this.tintCells(cells, color);
    };

    Highlighter.prototype.blinkCells = function (cells, color, delay, groupKey, id) {
        var id = id || "" + this.idGenerator++;

        // create new group if it doesn't exist
        if (!this.blinkGroups[groupKey])
            this.blinkGroups[groupKey] = {};

        // add new cells to group
        this.blinkGroups[groupKey][id] = cells;

        // return if interval is already active
        if (this.blinkIntervals[groupKey])
            return groupKey;

        var blinkFunctions = [this.tintByBlinkKey.bind(this, groupKey, color), this.clearSprites.bind(this)];
        var blinkCellsFN = function () {
            blinkFunctions[0].call();
            blinkFunctions[blinkFunctions.length - 1] = blinkFunctions.shift();
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });
        };

        this.blinkIntervals[groupKey] = window.setInterval(blinkCellsFN, delay);

        return id;
    };

    Highlighter.prototype.removeSingleBlink = function (group, id) {
        delete this.blinkGroups[group][id];
        if (Object.keys(this.blinkGroups[group]).length <= 0) {
            this.stopBlink(group);
        }
    };

    Highlighter.prototype.stopBlink = function (group) {
        window.clearTimeout(this.blinkIntervals[group]);
        delete this.blinkIntervals[group];

        this.clearSprites();
        this.blinkGroups[group] = [];
        eventManager.dispatchEvent({ type: "updateWorld", content: "" });
    };

    Highlighter.prototype.stopAllBlinks = function () {
        for (var timeout in this.blinkIntervals) {
            this.stopBlink(timeout);
        }
    };
    return Highlighter;
})();
//# sourceMappingURL=spritehighlighter.js.map
