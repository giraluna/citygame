/// <reference path="../lib/pixi.d.ts" />
///
/// <reference path="js/eventlistener.d.ts" />
///
var Highlighter = (function () {
    function Highlighter() {
        this.currHighlighted = [];
        this.blinkGroups = {};
        this.intervalIdGenerator = 0;
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
        console.log(this.currHighlighted);
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

    Highlighter.prototype.blinkCells = function (cells, color, delay, key) {
        var key = key || "" + this.intervalIdGenerator++;

        // create new group if it doesn't exist
        if (!this.blinkGroups[key])
            this.blinkGroups[key] = [];

        // add new cells to group
        var toBlink = this.blinkGroups[key].concat(cells);

        // return if interval is already active
        if (this.blinkIntervals[key])
            return key;

        var blinkFunctions = [this.tintCells.bind(this, toBlink, color), this.clearSprites.bind(this)];
        var blinkCellsFN = function () {
            blinkFunctions[0].call();
            blinkFunctions[blinkFunctions.length - 1] = blinkFunctions.shift();
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });
        };

        this.blinkIntervals[key] = window.setInterval(blinkCellsFN, delay);

        return key;
    };

    Highlighter.prototype.stopBlink = function (key) {
        window.clearTimeout(this.blinkIntervals[key]);
        delete this.blinkIntervals[key];

        this.clearSprites();
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
