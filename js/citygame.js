/// <reference path="../js/lib/pixi.d.ts" />
/// <reference path="../js/lib/tween.js.d.ts" />
/// <reference path="../js/ui.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

cg = JSON.parse(JSON.stringify(cg)); //dumb

var container;
var SCREEN_WIDTH, SCREEN_HEIGHT, TILE_WIDTH, TILE_HEIGHT, TILES, WORLD_WIDTH, WORLD_HEIGHT;
SCREEN_WIDTH = 940;
SCREEN_HEIGHT = 480;
TILE_WIDTH = 64;
TILE_HEIGHT = 32;
TILES = 30;
WORLD_WIDTH = TILES * TILE_WIDTH;
WORLD_HEIGHT = TILES * TILE_HEIGHT;

var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(template) {
        var _texture = PIXI.Texture.fromImage(template.texture, false, 1);
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
        this.type2 = type["type2"] || undefined;

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
        game.layers["content"].addChildAt(_s, gridPos[0] + gridPos[1]);
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

        _s.mousedown = function (event) {
            game.mouseEventHandler.cellDown(event);
        };
        _s.mouseover = function (event) {
            game.mouseEventHandler.cellOver(event);
        };
        _s.mouseup = function (event) {
            game.mouseEventHandler.cellUp(event);
        };
    };
    Cell.prototype.getNeighbors = function () {
        var neighbors = {
            n: undefined,
            e: undefined,
            s: undefined,
            w: undefined
        };
        var cells = game.board.cells;
        var size = game.board.width;
        var x = this.gridPos[0];
        var y = this.gridPos[1];

        neighbors.s = (y + 1 < size) ? cells[x][y + 1] : undefined;
        neighbors.e = (x + 1 < size) ? cells[x + 1][y] : undefined;
        neighbors.n = (-1 < y - 1) ? cells[x][y - 1] : undefined;
        neighbors.w = (-1 < x - 1) ? cells[x - 1][y] : undefined;

        return neighbors;
    };
    Cell.prototype.replace = function (type) {
        var _texture = type["texture"];
        this.sprite.setTexture(PIXI.Texture.fromImage(_texture));
        this.sprite.type = this.type = type;
        this.buildable = type["buildable"];
        if (this.content && this.content.type2 === "plant") {
            this.addPlant();
        } else if (this.content) {
            if (!this.checkBuildable(this.content.type2)) {
                this.changeContent("none");
            } else {
                this.changeContent(this.content.type);
            }
        }
    };
    Cell.prototype.changeContent = function (type, update, data) {
        if (typeof update === "undefined") { update = true; }
        var type2 = type["type2"] ? type["type2"] : "none";
        var buildable = this.checkBuildable(type2);
        var sameTypeExclusion = this.checkSameTypeExclusion(type2);
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
    Cell.prototype.checkSameTypeExclusion = function (type2) {
        var contentType2 = this.content ? this.content["type2"] : "none";
        if (contentType2 == type2 && type2 === "building") {
            return true;
        } else {
            return false;
        }
    };
    Cell.prototype.checkBuildable = function (type2) {
        if (this.buildable === false) {
            if (type2 == "plant" || type2 == "road") {
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
        game.layers["content"].removeChildAt(this.content.sprite, this.gridPos[0] + this.gridPos[1]);
        this.content = undefined;
    };
    return Cell;
})();

var Board = (function () {
    function Board(width, height) {
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

var Game = (function () {
    function Game() {
        this.tools = {};
        this.layers = {};
    }
    Game.prototype.init = function () {
        this.initContainers();
        this.initTools();
        this.changeTool("grass");
        this.bindElements();

        this.board = new Board(TILES, TILES);
        this.board.makeMap();

        this.highlighter = new Highlighter();

        this.mouseEventHandler = new MouseEventHandler();
        this.mouseEventHandler.scroller = new Scroller(this.layers["main"], SCREEN_WIDTH, SCREEN_HEIGHT, 0.5);

        this.uiDrawer = new UIDrawer();

        this.render();
    };
    Game.prototype.initContainers = function () {
        var _stage = this.stage = new PIXI.Stage(0xFFFFFF);
        var _renderer = this.renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, null, false, true);

        var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
        _main.position.set(SCREEN_WIDTH / 2 - WORLD_WIDTH / 2, SCREEN_HEIGHT / 2 - WORLD_HEIGHT / 2);
        _stage.addChild(_main);

        var _tooltips = this.layers["tooltips"] = new PIXI.DisplayObjectContainer();
        _stage.addChild(_tooltips);
        this.initLayers();

        var _game = this;

        _stage.mousedown = function (event) {
            if (event.originalEvent.ctrlKey === true) {
                _game.mouseEventHandler.scrollStart(event);
            }
            if (event.originalEvent.shiftKey === true) {
                _game.mouseEventHandler.zoomStart(event);
            }
        };
        _stage.mousemove = function (event) {
            _game.mouseEventHandler.stageMove(event);
        };
        _stage.mouseup = function (event) {
            _game.mouseEventHandler.stageEnd(event);
        };
    };
    Game.prototype.initLayers = function () {
        var _main = this.layers["main"];
        var _ground = this.layers["ground"] = new PIXI.DisplayObjectContainer();
        _ground.interactive = true;
        _main.addChild(_ground);
        var _content = this.layers["content"] = new SortedDisplayObjectContainer(TILES * 2);
        _main.addChild(_content);
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
    };
    Game.prototype.bindRenderer = function () {
        var _canvas = document.getElementById("pixi-container");
        _canvas.appendChild(this.renderer.view);
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
        var compressed = LZString.compressToUTF16(data);
        localStorage.setItem("board", compressed);
    };
    Game.prototype.loadBoard = function () {
        this.resetLayers();

        //var parsed = JSON.parse(this.savedBoard);
        var decompressed = LZString.decompressFromUTF16(localStorage.getItem("board"));
        var parsed = JSON.parse(decompressed);
        var board = this.board = new Board(parsed["width"], parsed["height"]);
        board.makeMap(parsed["cells"]);
    };
    Game.prototype.render = function () {
        TWEEN.update();
        this.renderer.render(this.stage);
        requestAnimFrame(this.render.bind(this));
    };
    Game.prototype.resetLayers = function () {
        var main = this.layers["main"];
        for (var layer in this.layers) {
            if (layer !== "main" && layer !== "tooltips") {
                var _l = this.layers[layer];
                main.removeChild(_l);
                this.layers[layer] = undefined;
                this.initLayers();
            }
        }
    };
    return Game;
})();

var SortedDisplayObjectContainer = (function (_super) {
    __extends(SortedDisplayObjectContainer, _super);
    // arr[1] = index 1
    // when adding new displayobject increment following indexes
    function SortedDisplayObjectContainer(layers) {
        this.indexes = new Array(layers);
        _super.call(this);
        this.init();
    }
    SortedDisplayObjectContainer.prototype.init = function () {
        for (var i = 0; i < this.indexes.length; i++) {
            this.indexes[i] = 0;
        }
        ;
    };
    SortedDisplayObjectContainer.prototype.incrementIndexes = function (start) {
        for (var i = start + 1; i < this.indexes.length; i++) {
            this.indexes[i]++;
        }
    };
    SortedDisplayObjectContainer.prototype.decrementIndexes = function (start) {
        for (var i = start + 1; i < this.indexes.length; i++) {
            this.indexes[i]--;
        }
    };

    SortedDisplayObjectContainer.prototype.addChildAt = function (element, index) {
        _super.prototype.addChildAt.call(this, element, this.indexes[index]);
        this.incrementIndexes(index);
    };
    SortedDisplayObjectContainer.prototype.removeChildAt = function (element, index) {
        _super.prototype.removeChild.call(this, element);
        this.decrementIndexes(index);
    };
    return SortedDisplayObjectContainer;
})(PIXI.DisplayObjectContainer);

var Scroller = (function () {
    function Scroller(container, width, height, bound) {
        this.bounds = {};
        this.currZoom = 1;
        this.container = container;
        this.width = width;
        this.height = height;
        this.bounds.min = bound; // sets clamp limit to percentage of screen from 0.0 to 1.0
        this.bounds.max = fround(1 - bound);
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
    }
    MouseEventHandler.prototype.scrollStart = function (event) {
        if (this.currAction === undefined) {
            this.startPoint = [event.global.x, event.global.y];
            this.currAction = "scroll";
            this.scroller.startScroll(this.startPoint);
            event.originalEvent.stopPropagation();
        }
    };
    MouseEventHandler.prototype.zoomStart = function (event) {
        if (this.currAction === undefined) {
            this.startPoint = this.currPoint = [event.global.x, event.global.y];
            this.currAction = "zoom";
            event.originalEvent.stopPropagation();
        }
    };
    MouseEventHandler.prototype.stageMove = function (event) {
        if (this.currAction === "scroll") {
            this.scroller.move([event.global.x, event.global.y]);
            event.originalEvent.stopPropagation();
        } else if (this.currAction === "zoom") {
            var delta = event.global.x + this.currPoint[1] - this.currPoint[0] - event.global.y;
            this.scroller.deltaZoom(delta, 0.005);
            this.currPoint = [event.global.x, event.global.y];
            event.originalEvent.stopPropagation();
        }
    };
    MouseEventHandler.prototype.stageEnd = function (event) {
        if (this.currAction === "scroll") {
            this.scroller.end();
            event.originalEvent.stopPropagation();
            this.startPoint = undefined;
            this.currAction = undefined;
        }
        if (this.currAction === "zoom") {
            event.originalEvent.stopPropagation();
            this.startPoint = undefined;
            this.currAction = undefined;
        }
    };
    MouseEventHandler.prototype.cellDown = function (event) {
        var cell = event.target["cell"];
        var pos = cell.gridPos;
        if (this.currAction === undefined) {
            this.currAction = "cellAction";
            this.startCell = pos;
        }
    };
    MouseEventHandler.prototype.cellOver = function (event) {
        var cell = event.target["cell"];
        var pos = cell.gridPos;
        if (this.currAction === "cellAction") {
            this.currCell = pos;
            var selectedCells = game.board.getCells(game.activeTool.selectType(this.startCell, this.currCell));

            game.highlighter.clearSprites();
            game.highlighter.tintCells(selectedCells, game.activeTool.tintColor);
        } else if (this.currAction === undefined) {
            var _text = game.uiDrawer.addFadeyText("Tile Position: " + pos + "\n" + "Ground Type: " + cell.type["type"], "base", 2000, 500);
            var temp = cell.sprite.worldTransform;
            _text.position.set(temp.tx, temp.ty - cell.sprite.height / 2);
        }
    };
    MouseEventHandler.prototype.cellUp = function (event) {
        var cell = event.target["cell"];
        var pos = cell.gridPos;
        if (this.currAction === "cellAction") {
            this.currCell = pos;
            var selectedCells = game.board.getCells(game.activeTool.selectType(this.startCell, this.currCell));
            game.activeTool.activate(selectedCells);
            game.highlighter.clearSprites();
            this.currAction = undefined;
        }
    };
    return MouseEventHandler;
})();

var UIDrawer = (function () {
    function UIDrawer() {
        this.fonts = {};
        this.layer = game.layers["tooltips"];
        this.init();
    }
    UIDrawer.prototype.init = function () {
        this.registerFont("base", {
            font: "30px Snippet",
            fill: "#444444",
            align: "left",
            size: 30
        });
    };

    UIDrawer.prototype.registerFont = function (name, fontObject) {
        this.fonts[name] = fontObject;
    };

    UIDrawer.prototype.addText = function (text, font) {
        if (this.active) {
            this.active.remove();
            this.active = undefined;
        }
        var container = this.active = new ToolTip(this.layer, 500, -1, {
            lineStyle: {
                width: 1,
                color: 0x587982,
                alpha: 1
            },
            fillStyle: {
                color: 0xE8FBFF,
                alpha: 0.8
            },
            autoSize: true,
            width: 200,
            height: 100,
            tipPos: 0.25,
            tipWidth: 10,
            tipHeight: 50,
            text: {
                text: text,
                font: this.fonts[font],
                padding: [10, 10]
            }
        });
        return container;
    };
    UIDrawer.prototype.removeObject = function (uiObject) {
        //this.layer.removeChild( uiObject );
    };
    UIDrawer.prototype.addFadeyText = function (text, font, timeout, delay) {
        var uiObject = this.addText(text, font);
        return uiObject;
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
            //target[i].changeContent("house");
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
    var neighbors = target.getNeighbors();
    for (var cell in neighbors) {
        if (neighbors[cell] && neighbors[cell].content && neighbors[cell].content.type2 === "road") {
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
    if (target.content && target.content.type2 === "road") {
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

function getFrom2dArray(target, arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(target[arr[i][0]][arr[i][1]]);
    }
    ;
    return result;
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

function getIsoCoord(x, y, width, height, offset) {
    var _w2 = width / 2;
    var _h2 = height / 2;
    var _isoX = (x - y) * _w2;
    var _isoY = (x + y) * _h2;
    if (offset) {
        _isoX += offset[0];
        _isoY += offset[1];
    }
    return [_isoX, _isoY];
}

function fround(x) {
    var f32 = new Float32Array(1);
    return f32[0] = x, f32[0];
}

function getRandomProperty(target) {
    var _targetKeys = Object.keys(target);
    var _rnd = Math.floor(Math.random() * (_targetKeys.length));
    var _rndProp = target[_targetKeys[_rnd]];
    return _rndProp;
}

var game = new Game();

document.addEventListener('DOMContentLoaded', function () {
    /* check center
    var stage = game.stage;
    var gfx = new PIXI.Graphics();
    gfx.beginFill();
    gfx.drawEllipse(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 3, 3);
    gfx.endFill();
    stage.addChild(gfx);
    */
    // temp
    // Load fonts
    WebFontConfig = {
        google: {
            families: ['Snippet', 'Arvo:700italic', 'Podkova:700']
        },
        active: function () {
            // do something
            game.init();
        }
    };
    (function () {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = true;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();
    // end temp
});

function pineapple() {
    cg["content"]["buildings"]["pineapple"] = {
        "type": "pineapple",
        "type2": "building",
        "width": 64,
        "height": 128,
        "anchor": [0.5, 1.25],
        "texture": "img\/pineapple2.png"
    };
}
//# sourceMappingURL=citygame.js.map
