/// <reference path="../lib/pixi.d.ts" />
///
/// <reference path="js/eventlistener.d.ts" />
///
var Highlighter = (function () {
    function Highlighter() {
        this.currHighlighted = [];
        this.currTransparent = [];
    }
    Highlighter.prototype.tintSprites = function (sprites, color, shouldGroup) {
        if (typeof shouldGroup === "undefined") { shouldGroup = true; }
        for (var i = 0; i < sprites.length; i++) {
            var _sprite = sprites[i];
            _sprite.tint = color;

            if (shouldGroup)
                this.currHighlighted.push(sprites[i]);
        }
    };
    Highlighter.prototype.clearSprites = function (shouldClear) {
        if (typeof shouldClear === "undefined") { shouldClear = true; }
        for (var i = 0; i < this.currHighlighted.length; i++) {
            var _sprite = this.currHighlighted[i];
            _sprite.tint = 0xFFFFFF;
        }
        if (shouldClear)
            this.clearHighlighted();
    };
    Highlighter.prototype.clearHighlighted = function () {
        this.currHighlighted = [];
    };
    Highlighter.prototype.tintCells = function (cells, color, shouldGroup) {
        if (typeof shouldGroup === "undefined") { shouldGroup = true; }
        var _sprites = [];
        for (var i = 0; i < cells.length; i++) {
            _sprites.push(cells[i].sprite);
            if (cells[i].content !== undefined) {
                _sprites = _sprites.concat(cells[i].content.sprites);
            }
        }
        this.tintSprites(_sprites, color, shouldGroup);
    };
    Highlighter.prototype.alphaBuildings = function (cells, value) {
        var _sprites = [];
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].content !== undefined) {
                var content = cells[i].content;
                for (var j = 0; j < content.sprites.length; j++) {
                    var sprite = content.sprites[j];
                    if (sprite.height < 53)
                        continue;
                    sprite.alpha = value;
                    this.currTransparent.push(sprite);
                }
            }
        }
    };
    Highlighter.prototype.clearAlpha = function () {
        for (var i = 0; i < this.currTransparent.length; i++) {
            this.currTransparent[i].alpha = 1;
        }
        this.currTransparent = [];
    };
    return Highlighter;
})();
//# sourceMappingURL=spritehighlighter.js.map
