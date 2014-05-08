/// <reference path="../data/js/cg.d.ts" />
/**
* add base land value
* add random modifier of land value to tiles
* create water
*   coasts
*     amount
*     directions
*     types
*       coast
*       bay
*       broken
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
        for (var i = 0; i < props.board.width; i++) {
            for (var j = 0; j < props.board.height; j++) {
                cells[i][j].replace(props.savedCells[i][j].type);

                if (props.savedCells[i][j].content) {
                    cells[i][j].changeContent(props.savedCells[i][j].content.type, true, props.savedCells[i][j].content.player);
                }
            }
        }
    }
    mapGeneration.readSavedMap = readSavedMap;
})(mapGeneration || (mapGeneration = {}));
//# sourceMappingURL=mapgeneration.js.map
