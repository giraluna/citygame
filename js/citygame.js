/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />
/// <reference path="../js/ui.d.ts" />
/// <reference path="../js/loader.d.ts" />
///
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/systems.d.ts" />
///
/// <reference path="../js/utility.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

cg = JSON.parse(JSON.stringify(cg)); //dumb

var container;
var SCREEN_WIDTH = 720, SCREEN_HEIGHT = 480, TILE_WIDTH = 64, TILE_HEIGHT = 32, TILES = 32, WORLD_WIDTH = TILES * TILE_WIDTH, WORLD_HEIGHT = TILES * TILE_HEIGHT, ZOOM_LEVELS = [1];

var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(template) {
        var _texture = PIXI.Texture.fromFrame(template.frame);
        _super.call(this, _texture); //pixi caches and reuses the texture as needed

        this.type = template.type;
        this.anchor = arrayToPoint(template.anchor);

        if (template.interactive === true) {
            this.interactive = true;
            this.hitArea = arrayToPolygon(template.hitArea);
        }
    }
    return Sprite;
})(PIXI.Sprite);

var GroundSprite = (function (_super) {
    __extends(GroundSprite, _super);
    function GroundSprite(type, cell) {
        this.cell = cell;
        _super.call(this, type);
    }
    return GroundSprite;
})(Sprite);

var ContentSprite = (function (_super) {
    __extends(ContentSprite, _super);
    function ContentSprite(type, content) {
        this.content = content;
        _super.call(this, type);
    }
    return ContentSprite;
})(Sprite);

var Content = (function () {
    function Content(cell, type, data) {
        this.cell = cell;
        this.type = type;
        this.baseType = type["baseType"] || undefined;
        this.categoryType = type["categoryType"] || undefined;

        this.init(type);

        if (data) {
            this.applyData(data);
        }
    }
    Content.prototype.init = function (type) {
        var _s = this.sprite = new ContentSprite(type, this);
        var cellSprite = this.cell.sprite;
        var gridPos = this.cell.gridPos;
        _s.position = this.cell.sprite.position.clone();
        game.layers["content"]._addChildAt(_s, gridPos[0] + gridPos[1]);
    };
    Content.prototype.applyData = function (data) {
        for (var key in data) {
            this[key] = data[key];
        }
    };
    return Content;
})();

var Cell = (function () {
    function Cell(gridPos, type) {
        this.gridPos = gridPos;
        this.type = type;

        this.init(type);
    }
    Cell.prototype.init = function (type) {
        var _s = this.sprite = new GroundSprite(type, this);
        this.buildable = type["buildable"];
    };
    Cell.prototype.getScreenPos = function (container) {
        var wt = container.worldTransform;
        var zoom = wt.a;
        var offset = [wt.tx + WORLD_WIDTH / 2 * zoom, wt.ty + TILE_HEIGHT / 2 * zoom];

        return getIsoCoord(this.gridPos[0], this.gridPos[1], TILE_WIDTH * zoom, TILE_HEIGHT * zoom, offset);
    };
    Cell.prototype.getNeighbors = function (diagonal) {
        if (typeof diagonal === "undefined") { diagonal = false; }
        var neighbors = {
            n: undefined,
            e: undefined,
            s: undefined,
            w: undefined,
            ne: undefined,
            nw: undefined,
            se: undefined,
            sw: undefined
        };
        var hasNeighbor = {
            n: undefined,
            e: undefined,
            s: undefined,
            w: undefined
        };
        var cells = game.board.cells;
        var size = game.board.width;
        var x = this.gridPos[0];
        var y = this.gridPos[1];

        hasNeighbor.s = (y + 1 < size) ? true : false;
        hasNeighbor.e = (x + 1 < size) ? true : false;
        hasNeighbor.n = (y - 1 >= 0) ? true : false;
        hasNeighbor.w = (x - 1 >= 0) ? true : false;

        neighbors.s = hasNeighbor["s"] ? cells[x][y + 1] : undefined;
        neighbors.e = hasNeighbor["e"] ? cells[x + 1][y] : undefined;
        neighbors.n = hasNeighbor["n"] ? cells[x][y - 1] : undefined;
        neighbors.w = hasNeighbor["w"] ? cells[x - 1][y] : undefined;

        if (diagonal === true) {
            neighbors.ne = (hasNeighbor["n"] && hasNeighbor["e"]) ? cells[x + 1][y - 1] : undefined;
            neighbors.nw = (hasNeighbor["n"] && hasNeighbor["w"]) ? cells[x - 1][y - 1] : undefined;
            neighbors.se = (hasNeighbor["s"] && hasNeighbor["e"]) ? cells[x + 1][y + 1] : undefined;
            neighbors.sw = (hasNeighbor["s"] && hasNeighbor["w"]) ? cells[x - 1][y + 1] : undefined;
        }

        return neighbors;
    };
    Cell.prototype.getArea = function (size, anchor) {
        if (typeof anchor === "undefined") { anchor = "center"; }
        var gridPos = this.gridPos;

        var start = [gridPos[0], gridPos[1]];
        var end = [gridPos[0], gridPos[1]];
        var boardSize = game.board.width;

        var adjust = [[0, 0], [0, 0]];

        if (anchor === "center") {
            adjust = [[-1, -1], [1, 1]];
        }
        ;
        if (anchor === "ne") {
            adjust[1] = [-1, 1];
        }
        ;
        if (anchor === "se") {
            adjust[1] = [-1, -1];
        }
        ;
        if (anchor === "sw") {
            adjust[1] = [1, -1];
        }
        ;
        if (anchor === "nw") {
            adjust[1] = [1, 1];
        }
        ;

        for (var i = 0; i < size - 1; i++) {
            start[0] += adjust[0][0];
            start[1] += adjust[0][1];
            end[0] += adjust[1][0];
            end[1] += adjust[1][1];
        }
        var rect = rectSelect(start, end);
        return game.board.getCells(rect);
    };
    Cell.prototype.replace = function (type) {
        var _texture = type["frame"];
        this.sprite.setTexture(PIXI.Texture.fromFrame(_texture));
        this.sprite.type = this.type = type;
        this.buildable = type["buildable"];
        if (this.content && this.content.baseType === "plant") {
            this.addPlant();
        } else if (this.content) {
            if (!this.checkBuildable(this.content.baseType)) {
                this.changeContent("none");
            } else {
                this.changeContent(this.content.type);
            }
        }
    };
    Cell.prototype.changeContent = function (type, update, data) {
        if (typeof update === "undefined") { update = true; }
        var baseType = type["baseType"] ? type["baseType"] : "none";
        var buildable = this.checkBuildable(baseType);
        var sameTypeExclusion = this.checkSameTypeExclusion(baseType);
        var toAdd = (type !== "none" && buildable !== false && !sameTypeExclusion);
        var toRemove = (type === "none" || (!sameTypeExclusion && toAdd));

        if (toRemove) {
            this.removeContent();
        }

        if (toAdd) {
            this.content = new Content(this, type, data);
        }
        if (update) {
            this.updateCell();
        }
    };
    Cell.prototype.checkSameTypeExclusion = function (baseType) {
        var contentbaseType = this.content ? this.content["baseType"] : "none";
        if (contentbaseType == baseType && baseType === "building") {
            return true;
        } else {
            return false;
        }
    };
    Cell.prototype.checkBuildable = function (baseType) {
        if (this.buildable === false) {
            if (baseType == "plant" || baseType == "road") {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    Cell.prototype.addPlant = function () {
        var type = this.type["type"];
        var plants = cg["content"]["plants"][type];

        this.changeContent(getRandomProperty(plants));
    };
    Cell.prototype.updateCell = function () {
        getRoadConnections(this, 1);
    };
    Cell.prototype.removeContent = function () {
        if (this.content === undefined) {
            return;
        }

        game.layers["content"]._removeChildAt(this.content.sprite, this.gridPos[0] + this.gridPos[1]);
        this.content = undefined;
    };
    return Cell;
})();

var Board = (function () {
    function Board(width, height) {
        if (typeof width === "undefined") { width = TILES; }
        if (typeof height === "undefined") { height = TILES; }
        this.width = width;
        this.height = height;
        this.cells = [];

        this.init();
    }
    Board.prototype.init = function () {
        for (var i = 0; i < this.width; i++) {
            this.cells[i] = [];
        }
    };

    /*makeEmptyMap()
    {
    for (var i = 0; i < this.width; i++)
    {
    for (var j = 0; j < this.height; j++)
    {
    var cellType = "grass";
    var cell = this.cells[i][j] = new Cell([i, j], cellType);
    var sprite = cell.sprite;
    sprite.position = arrayToPoint( getIsoCoord(i, j,
    TILE_WIDTH, TILE_HEIGHT,
    [WORLD_WIDTH/2, TILE_HEIGHT]) );
    game.layers["ground"].addChild(sprite);
    }
    }
    }*/
    Board.prototype.makeMap = function (data) {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (data) {
                    var dataCell = data[i][j] || undefined;
                }
                var cellType = dataCell ? dataCell["type"] : cg["terrain"]["grass"];
                var cell = this.cells[i][j] = new Cell([i, j], cellType);
                cell.buildable = dataCell ? dataCell.buildable : true;

                var sprite = cell.sprite;
                sprite.position = arrayToPoint(getIsoCoord(i, j, TILE_WIDTH, TILE_HEIGHT, [WORLD_WIDTH / 2, TILE_HEIGHT]));
                game.layers["ground"].addChild(sprite);
                if (data && dataCell.content) {
                    cell.changeContent(dataCell.content.type, dataCell.content.data);
                }
            }
        }
    };

    Board.prototype.getCell = function (arr) {
        return this.cells[arr[0]][arr[1]];
    };
    Board.prototype.getCells = function (arr) {
        return getFrom2dArray(this.cells, arr);
    };
    return Board;
})();

var WorldRenderer = (function () {
    function WorldRenderer(width, height) {
        this.layers = {};
        this.zoomLevel = ZOOM_LEVELS[0];
        this.initContainers(width, height);
        this.initLayers();
    }
    WorldRenderer.prototype.addEventListeners = function (listener) {
        this.listener = listener;
        var self = this;
        listener.addEventListener("changeZoomLevel", function (event) {
            self.changeZoomLevel(event.content.zoomLevel);
        });
        listener.addEventListener("updateWorld", function (event) {
            self.render();
        });
    };
    WorldRenderer.prototype.initContainers = function (width, height) {
        this.renderTexture = new PIXI.RenderTexture(width, height, game.renderer, PIXI.scaleModes.NEAREST);

        var _ws = this.worldSprite = new PIXI.Sprite(this.renderTexture);

        _ws.hitArea = arrayToPolygon(rectToIso(_ws.width, _ws.height));
        _ws.interactive = true;

        for (var i = 0; i < ZOOM_LEVELS.length; i++) {
            var zoomStr = "zoom" + ZOOM_LEVELS[i];
            var zoomLayer = this.layers[zoomStr] = {};

            var main = zoomLayer["main"] = new PIXI.DisplayObjectContainer();
        }

        // TEMP
        var self = this;
        _ws.mousedown = function (event) {
            game.mouseEventHandler.mouseDown(event, "world");
        };
        _ws.mousemove = function (event) {
            game.mouseEventHandler.mouseMove(event, "world");
        };
        _ws.mouseup = function (event) {
            game.mouseEventHandler.mouseUp(event, "world");
        };
    };
    WorldRenderer.prototype.initLayers = function () {
        for (var i = 0; i < ZOOM_LEVELS.length; i++) {
            var zoomStr = "zoom" + ZOOM_LEVELS[i];
            var zoomLayer = this.layers[zoomStr];
            var main = zoomLayer["main"];

            var ground = zoomLayer["ground"] = new PIXI.DisplayObjectContainer();
            var content = zoomLayer["content"] = new SortedDisplayObjectContainer(TILES * 2);

            main.addChild(ground);
            main.addChild(content);
        }
    };
    WorldRenderer.prototype.changeZoomLevel = function (level) {
        this.zoomLevel = level;
        this.render();
    };
    WorldRenderer.prototype.render = function () {
        var zoomStr = "zoom" + this.zoomLevel;
        var activeMainLayer = this.layers[zoomStr]["main"];
        this.renderTexture.render(activeMainLayer);
    };
    return WorldRenderer;
})();

var Game = (function () {
    function Game() {
        this.tools = {};
        this.layers = {};
    }
    Game.prototype.init = function () {
        this.resize();

        this.eventListener = new PIXI.EventTarget();

        this.initContainers();
        this.initTools();
        this.changeTool("grass");
        this.bindElements();

        this.board = new Board(TILES, TILES);
        this.board.makeMap();

        this.highlighter = new Highlighter();

        this.mouseEventHandler = new MouseEventHandler();
        this.mouseEventHandler.scroller = new Scroller(this.layers["main"], 0.5);

        this.uiDrawer = new UIDrawer();

        this.systemsManager = new SystemsManager(1000);

        this.render();
        this.updateWorld();
    };
    Game.prototype.initContainers = function () {
        var _stage = this.stage = new PIXI.Stage(0xFFFFFF);
        var _renderer = this.renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, null, false, true);

        var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
        _main.position.set(SCREEN_WIDTH / 2 - WORLD_WIDTH / 2, SCREEN_HEIGHT / 2 - WORLD_HEIGHT / 2);
        _stage.addChild(_main);

        var _tooltips = this.layers["tooltips"] = new PIXI.DisplayObjectContainer();
        _stage.addChild(_tooltips);

        this.worldRenderer = new WorldRenderer(WORLD_WIDTH, WORLD_HEIGHT);
        this.worldRenderer.addEventListeners(this.eventListener);
        _main.addChild(this.worldRenderer.worldSprite);

        this.initLayers();

        var _game = this;

        _stage.mousedown = function (event) {
            _game.mouseEventHandler.mouseDown(event, "stage");
        };
        _stage.mousemove = function (event) {
            _game.mouseEventHandler.mouseMove(event, "stage");
        };
        _stage.mouseup = function (event) {
            _game.mouseEventHandler.mouseUp(event, "stage");
        };
    };
    Game.prototype.initLayers = function () {
        this.layers["ground"] = this.worldRenderer.layers["zoom1"]["ground"];
        this.layers["content"] = this.worldRenderer.layers["zoom1"]["content"];
        this.updateWorld();
    };
    Game.prototype.initTools = function () {
        this.tools.water = new WaterTool();
        this.tools.grass = new GrassTool();
        this.tools.sand = new SandTool();
        this.tools.snow = new SnowTool();
        this.tools.remove = new RemoveTool();
        this.tools.plant = new PlantTool();
        this.tools.house = new HouseTool();
        this.tools.road = new RoadTool();
    };

    Game.prototype.bindElements = function () {
        var self = this;

        //zoom
        var zoomBtn = document.getElementById("zoomBtn");
        zoomBtn.addEventListener("click", function () {
            var zoomAmount = document.getElementById("zoom-amount")["value"];
            game.mouseEventHandler.scroller.zoom(zoomAmount);
        });

        for (var tool in this.tools) {
            var btn = document.getElementById("" + tool + "Btn");
            (function addBtnFn(btn, tool) {
                btn.addEventListener("click", function () {
                    self.changeTool([tool]);
                });
            })(btn, tool);
        }

        //save & load
        var saveBtn = document.getElementById("saveBtn");
        var loadBtn = document.getElementById("loadBtn");
        saveBtn.addEventListener("click", function () {
            self.saveBoard();
        });
        loadBtn.addEventListener("click", function () {
            self.loadBoard();
        });

        //renderer
        this.bindRenderer();

        //resize
        window.addEventListener('resize', game.resize, false);
    };
    Game.prototype.bindRenderer = function () {
        var _canvas = document.getElementById("pixi-container");
        _canvas.appendChild(this.renderer.view);
    };
    Game.prototype.updateWorld = function () {
        this.eventListener.dispatchEvent({ type: "updateWorld", content: "" });
    };
    Game.prototype.resize = function () {
        var container = window.getComputedStyle(document.getElementById("pixi-container"), null);
        SCREEN_WIDTH = parseInt(container.width);
        SCREEN_HEIGHT = parseInt(container.height);
        if (game.renderer) {
            game.renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        }
    };

    Game.prototype.changeTool = function (tool) {
        this.activeTool = this.tools[tool];
    };
    Game.prototype.saveBoard = function () {
        var data = JSON.stringify(this.board, function replacerFN(key, value) {
            var replaced = {};
            if (typeof (value) === "object") {
                switch (key) {
                    case "content":
                        replaced = {
                            "type": this.content.type,
                            "id": this.content.id
                        };
                        return replaced;

                    case "sprite":
                        return this.sprite.type;

                    default:
                        return value;
                }
            }
            return value;
        });
        localStorage.setItem("board", data);
    };
    Game.prototype.loadBoard = function () {
        this.resetLayers();
        var parsed = JSON.parse(localStorage.getItem("board"));
        var board = this.board = new Board(parsed["width"], parsed["height"]);
        board.makeMap(parsed["cells"]);
    };
    Game.prototype.render = function () {
        this.renderer.render(this.stage);

        TWEEN.update();

        this.systemsManager.update();
        requestAnimFrame(this.render.bind(this));
    };
    Game.prototype.resetLayers = function () {
        this.worldRenderer.initLayers();
    };
    return Game;
})();

var SortedDisplayObjectContainer = (function (_super) {
    __extends(SortedDisplayObjectContainer, _super);
    // arr[1] = index 1
    // when adding new displayobject increment following indexes
    function SortedDisplayObjectContainer(layers) {
        this._sortingIndexes = new Array(layers);
        _super.call(this);
        this.init();
    }
    SortedDisplayObjectContainer.prototype.init = function () {
        for (var i = 0; i < this._sortingIndexes.length; i++) {
            this._sortingIndexes[i] = 0;
        }
        ;
    };
    SortedDisplayObjectContainer.prototype.incrementIndexes = function (start) {
        for (var i = start + 1; i < this._sortingIndexes.length; i++) {
            this._sortingIndexes[i]++;
        }
    };
    SortedDisplayObjectContainer.prototype.decrementIndexes = function (start) {
        for (var i = start + 1; i < this._sortingIndexes.length; i++) {
            this._sortingIndexes[i]--;
        }
    };

    SortedDisplayObjectContainer.prototype._addChildAt = function (element, index) {
        _super.prototype.addChildAt.call(this, element, this._sortingIndexes[index]);
        this.incrementIndexes(index);
    };
    SortedDisplayObjectContainer.prototype._removeChildAt = function (element, index) {
        _super.prototype.removeChild.call(this, element);
        this.decrementIndexes(index);
    };
    return SortedDisplayObjectContainer;
})(PIXI.DisplayObjectContainer);

var Scroller = (function () {
    function Scroller(container, bound) {
        this.bounds = {};
        this.currZoom = 1;
        this.container = container;
        this.bounds.min = bound; // sets clamp limit to percentage of screen from 0.0 to 1.0
        this.bounds.max = Number((1 - bound).toFixed(1));
        this.setBounds();
        this.zoomField = document.getElementById("zoom-amount");
    }
    Scroller.prototype.startScroll = function (mousePos) {
        this.setBounds();
        this.startClick = mousePos;
        this.startPos = [this.container.position.x, this.container.position.y];
    };
    Scroller.prototype.end = function () {
        this.startPos = undefined;
    };
    Scroller.prototype.setBounds = function () {
        var rect = this.container.getLocalBounds();
        this.width = SCREEN_WIDTH;
        this.height = SCREEN_HEIGHT;
        this.bounds = {
            xMin: (this.width * this.bounds.min) - rect.width * this.container.scale.x,
            xMax: (this.width * this.bounds.max),
            yMin: (this.height * this.bounds.min) - rect.height * this.container.scale.y,
            yMax: (this.height * this.bounds.max),
            min: this.bounds.min,
            max: this.bounds.max
        };
    };
    Scroller.prototype.getDelta = function (currPos) {
        var x = this.startClick[0] - currPos[0];
        var y = this.startClick[1] - currPos[1];
        return [-x, -y];
    };
    Scroller.prototype.move = function (currPos) {
        var delta = this.getDelta(currPos);
        this.container.position.x = this.startPos[0] + delta[0];
        this.container.position.y = this.startPos[1] + delta[1];
        this.clampEdges();
    };
    Scroller.prototype.zoom = function (zoomAmount) {
        if (zoomAmount > 1) {
            //zoomAmount = 1;
        }

        var container = this.container;
        var oldZoom = this.currZoom;
        var zoomDelta = oldZoom - zoomAmount;
        var rect = container.getLocalBounds();

        //var centerX = SCREEN_WIDTH / 2 - rect.width / 2 * zoomAmount;
        //var centerY = SCREEN_HEIGHT / 2 - rect.height / 2 * zoomAmount;
        //these 2 get position of screen center in relation to the container
        //0: far left 1: far right
        var xRatio = 1 - ((container.x - SCREEN_WIDTH / 2) / rect.width / oldZoom + 1);
        var yRatio = 1 - ((container.y - SCREEN_HEIGHT / 2) / rect.height / oldZoom + 1);

        var xDelta = rect.width * xRatio * zoomDelta;
        var yDelta = rect.height * yRatio * zoomDelta;
        container.position.x += xDelta;
        container.position.y += yDelta;
        container.scale.set(zoomAmount, zoomAmount);
        this.zoomField.value = this.currZoom = zoomAmount;
    };
    Scroller.prototype.deltaZoom = function (delta, scale) {
        if (delta === 0) {
            return;
        }

        //var scaledDelta = absDelta + scale / absDelta;
        var direction = delta < 0 ? "out" : "in";
        var adjDelta = 1 + Math.abs(delta) * scale;
        if (direction === "out") {
            this.zoom(this.currZoom / adjDelta);
        } else {
            this.zoom(this.currZoom * adjDelta);
        }
    };
    Scroller.prototype.clampEdges = function () {
        var x = this.container.position.x;
        var y = this.container.position.y;

        //horizontal
        //left edge
        if (x < this.bounds.xMin) {
            x = this.bounds.xMin;
        } else if (x > this.bounds.xMax) {
            x = this.bounds.xMax;
        }

        //vertical
        //top
        if (y < this.bounds.yMin) {
            y = this.bounds.yMin;
        } else if (y > this.bounds.yMax) {
            y = this.bounds.yMax;
        }

        this.container.position.set(x, y);
    };
    return Scroller;
})();

var MouseEventHandler = (function () {
    function MouseEventHandler() {
        this.currAction = undefined;
        window.oncontextmenu = function (event) {
            var eventTarget = event.target;
            if (eventTarget.localName !== "canvas")
                return;
            event.preventDefault();
            event.stopPropagation();
        };
    }
    MouseEventHandler.prototype.mouseDown = function (event, targetType) {
        if (event.originalEvent.button === 2 && this.currAction !== undefined) {
            this.currAction = undefined;
            this.startPoint = undefined;
            this.scroller.end();
            game.highlighter.clearSprites();
            game.uiDrawer.removeActive();
            game.updateWorld();
        } else if (event.originalEvent.ctrlKey || event.originalEvent.metaKey || event.originalEvent.button === 2) {
            this.startScroll(event);
        } else if (event.originalEvent.shiftKey) {
            this.startZoom(event);
        } else if (targetType === "world") {
            this.startCellAction(event);
        }
    };

    MouseEventHandler.prototype.mouseMove = function (event, targetType) {
        if (targetType === "stage" && (this.currAction === "zoom" || this.currAction === "scroll")) {
            this.stageMove(event);
        } else if (targetType === "world" && this.currAction === "cellAction") {
            this.worldMove(event);
        } else if (targetType === "world" && this.currAction === undefined) {
            this.hover(event);
            console.log(event.target);
        }
    };
    MouseEventHandler.prototype.mouseUp = function (event, targetType) {
        if (this.currAction === undefined)
            return;
        else if (targetType === "stage" && (this.currAction === "zoom" || this.currAction === "scroll")) {
            this.stageEnd(event);
        } else if (targetType === "world" && this.currAction === "cellAction") {
            this.worldEnd(event);
        }
    };

    MouseEventHandler.prototype.startScroll = function (event) {
        this.currAction = "scroll";
        this.startPoint = [event.global.x, event.global.y];
        this.scroller.startScroll(this.startPoint);
    };
    MouseEventHandler.prototype.startZoom = function (event) {
        this.currAction = "zoom";
        this.startPoint = this.currPoint = [event.global.x, event.global.y];
    };
    MouseEventHandler.prototype.stageMove = function (event) {
        if (this.currAction === "scroll") {
            this.scroller.move([event.global.x, event.global.y]);
        } else if (this.currAction === "zoom") {
            var delta = event.global.x + this.currPoint[1] - this.currPoint[0] - event.global.y;
            this.scroller.deltaZoom(delta, 0.005);
            this.currPoint = [event.global.x, event.global.y];
        }
    };
    MouseEventHandler.prototype.stageEnd = function (event) {
        if (this.currAction === "scroll") {
            this.scroller.end();
            this.startPoint = undefined;
            this.currAction = undefined;
        }
        if (this.currAction === "zoom") {
            this.startPoint = undefined;
            this.currAction = undefined;
        }
    };

    MouseEventHandler.prototype.startCellAction = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        this.currAction = "cellAction";
        this.startCell = gridPos;
    };
    MouseEventHandler.prototype.worldMove = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        if (!this.currCell || gridPos[0] !== this.currCell[0] || gridPos[1] !== this.currCell[1]) {
            this.currCell = gridPos;
            var selectedCells = game.board.getCells(game.activeTool.selectType(this.startCell, this.currCell));

            game.highlighter.clearSprites();
            game.highlighter.tintCells(selectedCells, game.activeTool.tintColor);
            game.updateWorld();
        }
    };
    MouseEventHandler.prototype.worldEnd = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        this.currCell = gridPos;
        var selectedCells = game.board.getCells(game.activeTool.selectType(this.startCell, this.currCell));

        game.activeTool.activate(selectedCells);

        game.highlighter.clearSprites();
        this.currAction = undefined;
        game.updateWorld();

        // temp
        var cell = game.board.getCell(this.currCell);
        var neighs = cell.getNeighbors();
        game.uiDrawer.makeCellPopup(cell, event.target);
        for (var neigh in neighs) {
            if (neighs[neigh]) {
                game.uiDrawer.makeCellPopup(neighs[neigh], event.target);
            }
        }
    };
    MouseEventHandler.prototype.hover = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        if (!this.hoverCell)
            this.hoverCell = gridPos;
        if (gridPos[0] !== this.hoverCell[0] || gridPos[1] !== this.hoverCell[1]) {
            this.hoverCell = gridPos;
            game.uiDrawer.removeActive();
            game.uiDrawer.makeCellTooltip(event, game.board.getCell(gridPos), event.target);
        }
    };
    return MouseEventHandler;
})();

var UIDrawer = (function () {
    function UIDrawer() {
        this.fonts = {};
        this.styles = {};
        this.layer = game.layers["tooltips"];
        this.init();
    }
    UIDrawer.prototype.init = function () {
        this.fonts = {
            base: {
                font: "18px Snippet",
                fill: "#444444",
                align: "left"
            },
            black: {
                font: "bold 20pt Arial",
                fill: "000000",
                align: "left"
            }
        };
        this.styles["base"] = {
            lineStyle: {
                width: 2,
                color: 0x587982,
                alpha: 1
            },
            fillStyle: {
                color: 0xE8FBFF,
                alpha: 0.8
            }
        };
    };
    UIDrawer.prototype.removeActive = function () {
        if (this.active) {
            this.active.remove();
            this.active = undefined;
        }
    };

    UIDrawer.prototype.makeCellTooltip = function (event, cell, container) {
        var screenPos = cell.getScreenPos(container);
        var cellX = screenPos[0];
        var cellY = screenPos[1];

        var screenX = event.global.x;
        var screenY = event.global.y;

        var text = cell.content ? cell.content.type["type"] : cell.type["type"];
        var font = this.fonts["base"];

        var textObject = new PIXI.Text(text, font);

        var tipDir, tipPos;

        // change slant of the tip based on screen position
        // 100 pix buffer is arbitrary for now
        if (screenX + textObject.width + 100 > SCREEN_WIDTH) {
            tipDir = "left";
            tipPos = 0.75;
        } else {
            tipDir = "right";
            tipPos = 0.25;
        }

        // same for vertical pos
        var pointing = (screenY - textObject.height - 100 < 0) ? "up" : "down";

        var x = cellX;
        var y = (cell.content && pointing === "down") ? cellY - cell.content.sprite.height * cell.content.sprite.worldTransform.a / 2 : cellY;

        var uiObj = this.active = new UIObject(this.layer).delay(500).lifeTime(-1);

        var toolTip = makeToolTip({
            style: this.styles["base"],
            autoSize: true,
            tipPos: tipPos,
            tipWidth: 10,
            tipHeight: 20,
            tipDir: tipDir,
            pointing: pointing,
            padding: [10, 10]
        }, textObject);
        uiObj.position.set(x, y);

        uiObj.addChild(toolTip);
        uiObj.start();

        return uiObj;
    };
    UIDrawer.prototype.makeCellPopup = function (cell, container) {
        var pos = cell.getScreenPos(container);
        var content = new PIXI.Text("+1", this.fonts["black"]);

        this.makeFadeyPopup([pos[0], pos[1]], [0, -20], 2000, content);
    };
    UIDrawer.prototype.makeFadeyPopup = function (pos, drift, lifeTime, content) {
        var tween = new TWEEN.Tween({
            alpha: 1,
            x: pos[0],
            y: pos[1]
        });

        var uiObj = new UIObject(this.layer).lifeTime(lifeTime).onAdded(function () {
            tween.start();
        }).onComplete(function () {
            TWEEN.remove(tween);
        });

        tween.to({
            alpha: 0,
            x: pos[0] + drift[0],
            y: pos[1] + drift[1]
        }, lifeTime).onUpdate(function () {
            uiObj.alpha = this.alpha;
            uiObj.position.set(this.x, this.y);
        });

        uiObj.position.set(pos[0], pos[1]);

        if (content.width) {
            content.position.x -= content.width / 2;
            content.position.y -= content.height / 2;
        }

        uiObj.addChild(content);

        uiObj.start();
    };

    UIDrawer.prototype.clearLayer = function () {
        for (var i = this.layer.children.length - 1; i >= 0; i--) {
            this.layer.removeChild(this.layer.children[i]);
        }
    };
    return UIDrawer;
})();

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

var WaterTool = (function () {
    function WaterTool() {
        this.selectType = manhattanSelect;
        this.tintColor = 0x4444FF;
    }
    WaterTool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            target[i].replace(cg["terrain"]["water"]);
        }
        ;
    };
    return WaterTool;
})();

var GrassTool = (function () {
    function GrassTool() {
        this.selectType = rectSelect;
        this.tintColor = 0x617A4E;
    }
    GrassTool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            target[i].replace(cg["terrain"]["grass"]);
        }
    };
    return GrassTool;
})();

var SandTool = (function () {
    function SandTool() {
        this.selectType = rectSelect;
        this.tintColor = 0xE2BF93;
    }
    SandTool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            target[i].replace(cg["terrain"]["sand"]);
        }
    };
    return SandTool;
})();

var SnowTool = (function () {
    function SnowTool() {
        this.selectType = rectSelect;
        this.tintColor = 0xBBDFD7;
    }
    SnowTool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            target[i].replace(cg["terrain"]["snow"]);
        }
    };
    return SnowTool;
})();
var RemoveTool = (function () {
    function RemoveTool() {
        this.selectType = rectSelect;
        this.tintColor = 0xFF5555;
    }
    RemoveTool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            target[i].changeContent("none");
        }
    };
    return RemoveTool;
})();

var PlantTool = (function () {
    function PlantTool() {
        this.selectType = rectSelect;
        this.tintColor = 0x338833;
    }
    PlantTool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            target[i].addPlant();
        }
    };
    return PlantTool;
})();

var HouseTool = (function () {
    function HouseTool() {
        this.selectType = rectSelect;
        this.tintColor = 0x696969;
    }
    HouseTool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            target[i].changeContent(getRandomProperty(cg["content"]["buildings"]));
        }
    };
    return HouseTool;
})();
var RoadTool = (function () {
    function RoadTool() {
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
    }
    RoadTool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            target[i].changeContent(cg["content"]["roads"]["road_nesw"]);
        }
    };
    return RoadTool;
})();
function getRoadConnections(target, depth) {
    var connections = {};
    var dir = "";
    var neighbors = target.getNeighbors(false);
    for (var cell in neighbors) {
        if (neighbors[cell] && neighbors[cell].content && neighbors[cell].content.baseType === "road") {
            connections[cell] = true;
        }
    }

    if (depth > 0) {
        for (var connection in connections) {
            getRoadConnections(neighbors[connection], depth - 1);
        }
    }

    for (var connection in connections) {
        dir += connection;
    }
    if (dir === "") {
        return null;
    } else if (dir === "n" || dir === "s" || dir === "ns") {
        dir = "v";
    } else if (dir === "e" || dir === "w" || dir === "ew") {
        dir = "h";
    }
    if (target.content && target.content.baseType === "road") {
        var finalRoad = cg["content"]["roads"]["road_" + dir];
        target.changeContent(finalRoad, false);
    }
}

function rectSelect(a, b) {
    var cells = [];
    var xLen = Math.abs(a[0] - b[0]);
    var yLen = Math.abs(a[1] - b[1]);
    var xDir = (b[0] < a[0]) ? -1 : 1;
    var yDir = (b[1] < a[1]) ? -1 : 1;
    var x, y;
    for (var i = 0; i <= xLen; i++) {
        x = a[0] + i * xDir;
        for (var j = 0; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([x, y]);
        }
    }
    return cells;
}

function manhattanSelect(a, b) {
    var xLen = Math.abs(a[0] - b[0]);
    var yLen = Math.abs(a[1] - b[1]);
    var xDir = (b[0] < a[0]) ? -1 : 1;
    var yDir = (b[1] < a[1]) ? -1 : 1;
    var y, x;
    var cells = [];
    if (xLen >= yLen) {
        for (var i = 0; i <= xLen; i++) {
            x = a[0] + i * xDir;
            cells.push([x, a[1]]);
        }
        for (var j = 1; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([b[0], y]);
        }
    } else {
        for (var j = 0; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([a[0], y]);
        }
        for (var i = 1; i <= xLen; i++) {
            x = a[0] + i * xDir;
            cells.push([x, b[1]]);
        }
    }
    return cells;
}
function arrayToPolygon(points) {
    var _points = [];
    for (var i = 0; i < points.length; i++) {
        _points.push(new PIXI.Point(points[i][0], points[i][1]));
    }
    return new PIXI.Polygon(_points);
}

function arrayToPoint(point) {
    return new PIXI.Point(point[0], point[1]);
}

function pineapple() {
    cg["content"]["buildings"]["pineapple"] = {
        "type": "pineapple",
        "baseType": "building",
        "width": 64,
        "height": 128,
        "anchor": [0.5, 1.25],
        "frame": "pineapple2.png"
    };
}

var game = new Game();
var loader = new Loader(game);

game.uiDrawer.makeFadeyPopup([SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2], [0, 0], 5000, new PIXI.Text("ctrl+click to scroll\nshift+click to zoom", {
    font: "bold 50px Snippet",
    fill: "#222222",
    align: "center"
}));
//# sourceMappingURL=citygame.js.map
