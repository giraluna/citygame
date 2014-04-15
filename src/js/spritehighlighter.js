/// <reference path="../lib/pixi.d.ts" />
///
var Highlighter = (function () {
    function Highlighter() {
        this.currHighlighted = [];
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
    return Highlighter;
})();
//# sourceMappingURL=spritehighlighter.js.map
