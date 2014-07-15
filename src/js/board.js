/// <reference path="js/utility.d.ts" />
/// <reference path="js/sorteddisplaycontainer.d.ts" />
/// <reference path="js/mapgeneration.d.ts" />
/// <reference path="js/citygeneration.d.ts" />
///
/// <reference path="../lib/pixi.d.ts" />
var idGenerator = idGenerator || {};
idGenerator.board = 0;

var Board = (function () {
    function Board(props) {
        this.mapGenInfo = {};
        this.layers = {};
        this.id = props.id !== undefined ? props.id : idGenerator.board++;
        this.name = "City " + this.id;

        this.width = props.width;
        this.height = props.height || props.width;

        this.totalSize = this.width * this.height;

        this.initLayers();

        this.population = props.population || randInt(this.totalSize / 15, this.totalSize / 10);

        this.cells = mapGeneration.makeBlankCells({
            width: this.width,
            height: this.height
        });

        if (props.savedCells) {
            mapGeneration.convertCells(this.cells, this, true);
            mapGeneration.readSavedMap({
                board: this,
                savedCells: props.savedCells
            });
        } else {
            this.generateMap();
            this.generateCity();
        }
    }
    Board.prototype.generateMap = function () {
        var startTime = window.performance ? window.performance.now() : Date.now();

        var coasts = this.mapGenInfo.coasts = mapGeneration.generateCellNoise({
            width: this.width,
            mapHeight: this.height,
            amountWeights: [1, 0.5, 0.4, 0],
            variation: 0.5,
            yFalloff: 0.14,
            xCutoff: 0.3,
            xFalloff: 0.1,
            xFalloffPerY: 0.3,
            landThreshhold: 0.4
        });
        mapGeneration.applyCoastsToCells({
            cells: this.cells,
            primaryType: "grass",
            subType: "water",
            coasts: coasts
        });

        var rivers = this.mapGenInfo.rivers = mapGeneration.makeRivers(coasts, 0.7, {
            width: this.width / 4,
            mapHeight: this.height,
            depth: this.height,
            variation: 0.000001,
            baseVariation: [0.8, 1],
            yFalloff: 0.00001,
            xCutoff: 0.7,
            xFalloff: 0.6,
            xFalloffPerY: 0.4,
            landThreshhold: 0.2
        }, [this.width / 2 - this.width / 8, 0]);

        this.cells = mapGeneration.smoothCells(this.cells, 0.6, 1, 4);
        this.cells = mapGeneration.smoothCells(this.cells, 0.6, 2, 2);
        this.cells = mapGeneration.smoothCells(this.cells, 0.7, 3, 1);

        if (rivers) {
            mapGeneration.applyCoastsToCells({
                cells: this.cells,
                primaryType: "water",
                subType: "grass",
                coasts: rivers
            });
        }

        this.cells = mapGeneration.smoothCells(this.cells, 0.5, 1, 2);

        mapGeneration.convertCells(this.cells, this, false);

        var finishTime = window.performance ? window.performance.now() : Date.now();
        var elapsed = finishTime - startTime;
        console.log("map gen in " + Math.round(elapsed) + " ms");
    };

    Board.prototype.generateCity = function () {
        this.mapGenInfo.mainStationPos = cityGeneration.placeBuilding(this, "smallstation", 0.4, [{ flags: ["water"], radius: 4 }]);
        cityGeneration.placeStationRoads(this);
        cityGeneration.placeMainSubwayLines(this);
        cityGeneration.placeInitialHousing(this);
    };

    Board.prototype.getCell = function (arr) {
        if (this.cells[arr[0]] && this.cells[arr[1]]) {
            return this.cells[arr[0]][arr[1]];
        } else
            return false;
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
    Board.prototype.initLayers = function () {
        for (var i = 1; i <= 1; i++) {
            var zoomStr = "zoom" + i;

            var zoomLayer = this.layers[zoomStr] = {};

            zoomLayer["undergroundContent"] = new SortedDisplayObjectContainer(this.totalSize * 2);
            zoomLayer["ground"] = new PIXI.DisplayObjectContainer();
            zoomLayer["landValueOverlay"] = new PIXI.DisplayObjectContainer();
            zoomLayer["cellOverlay"] = new SortedDisplayObjectContainer(this.totalSize * 2);
            zoomLayer["content"] = new SortedDisplayObjectContainer(this.totalSize * 2);
        }
    };
    Board.prototype.addSpriteToLayer = function (layerToAddTo, spriteToAdd, gridPos) {
        for (var zoomLevel in this.layers) {
            var layer = this.layers[zoomLevel][layerToAddTo];

            if (layer._addChildAt) {
                layer._addChildAt(spriteToAdd, gridPos[0] + gridPos[1]);
            } else {
                layer.addChild(spriteToAdd);
            }
        }
    };
    Board.prototype.removeSpriteFromLayer = function (layerToRemoveFrom, spriteToRemove, gridPos) {
        for (var zoomLevel in this.layers) {
            var layer = this.layers[zoomLevel][layerToRemoveFrom];

            if (layer._removeChildAt) {
                layer._removeChildAt(spriteToRemove, gridPos[0] + gridPos[1]);
            } else {
                layer.removeChild(spriteToRemove);
            }
        }
    };
    return Board;
})();
//# sourceMappingURL=board.js.map
