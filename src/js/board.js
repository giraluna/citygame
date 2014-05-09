/// <reference path="js/utility.d.ts" />
/// <reference path="js/mapgeneration.d.ts" />
var Board = (function () {
    function Board(props) {
        this.width = props.width;
        this.height = props.height || props.width;

        this.cells = mapGeneration.makeBlankMap({
            width: this.width,
            height: this.height,
            board: this
        });

        if (props.savedCells) {
            mapGeneration.readSavedMap({
                board: this,
                savedCells: props.savedCells
            });
        }
    }
    Board.prototype.getCell = function (arr) {
        return this.cells[arr[0]][arr[1]];
    };
    Board.prototype.getCells = function (arr) {
        return getFrom2dArray(this.cells, arr);
    };
    Board.prototype.destroy = function () {
        for (var i = 0; i < this.cells.length; i++) {
            for (var j = 0; j < this.cells[i].length; j++) {
                this.cells[i][j] = null;
            }
        }
    };
    return Board;
})();
//# sourceMappingURL=board.js.map
