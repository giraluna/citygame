/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />
///
/// <reference path="reactui/js/reactui.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
/// <reference path="../data/js/names.d.ts" />
///
/// <reference path="js/ui.d.ts" />
/// <reference path="js/loader.d.ts" />
///
/// <reference path="js/sorteddisplaycontainer.d.ts" />
/// <reference path="js/player.d.ts" />F
/// <reference path="js/systems.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spritehighlighter.d.ts" />
/// <reference path="js/keyboardinput.d.ts" />
/// <reference path="js/mapgeneration.d.ts" />
/// <reference path="js/board.d.ts" />
///
/// <reference path="js/landvalueoverlay.d.ts" />
///
/// <reference path="js/utility.d.ts" />
/// <reference path="js/arraylogic.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SCREEN_WIDTH = 720, SCREEN_HEIGHT = 480, TILE_WIDTH = 64, TILE_HEIGHT = 32, TILES = 32, WORLD_WIDTH = TILES * TILE_WIDTH, WORLD_HEIGHT = TILES * TILE_HEIGHT, ZOOM_LEVELS = [1], AMT_OF_BOARDS = 2;

var idGenerator = idGenerator || {};
idGenerator.content = 0;
idGenerator.player = 0;

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
    function Content(props) {
        this.baseProfit = 0;
        this.modifiers = {};
        this.modifiedProfit = 0;
        this.cells = props.cells;

        var minX, minY;
        for (var i = 0; i < this.cells.length; i++) {
            var pos = this.cells[i].gridPos;

            if (minY === undefined || pos[1] <= minY) {
                minY = pos[1];

                if (minX === undefined || pos[0] < minX) {
                    minX = pos[0];
                }
            }
        }

        // highest point arbitrarily assigned as root
        this.baseCell = this.cells[0].board.getCell([minX, minY]);
        this.size = props.type.size || [1, 1];

        var type = this.type = props.type;
        this.id = props.id || idGenerator.content++;

        this.baseType = type["baseType"] || undefined;
        this.categoryType = type["categoryType"] || undefined;
        this.flags = type["flags"] ? type["flags"].slice(0) : [];
        this.flags.push(this.baseType, this.categoryType);

        this.baseProfit = type.baseProfit || undefined;

        if (props.player) {
            props.player.addContent(this);
        }
        this.init(type, props.layer);
    }
    Content.prototype.init = function (type, layer) {
        if (typeof layer === "undefined") { layer = "content"; }
        // todo needs to be split into multiple sprites for
        // large content z depth to be right
        var _s = this.sprite = new ContentSprite(type, this);

        // sprites aligned at the lowest point
        var spriteOrigin = [this.baseCell.gridPos[0] + this.size[0] - 1, this.baseCell.gridPos[1] + this.size[1] - 1];

        _s.position = this.baseCell.board.getCell(spriteOrigin).sprite.position.clone();

        this.baseCell.board.addSpriteToLayer(layer, _s, this.baseCell.gridPos);
    };
    Content.prototype.applyModifiers = function () {
        var totals = {
            addedProfit: this.baseProfit,
            multiplier: 1
        };
        for (var _modifier in this.modifiers) {
            var modifier = this.modifiers[_modifier];
            for (var prop in modifier.effect) {
                totals[prop] += modifier.scaling(modifier.strength) * modifier.effect[prop];
            }
        }
        this.modifiedProfit = totals.addedProfit * totals.multiplier;
    };
    Content.prototype.remove = function () {
        if (this.player) {
            this.player.removeContent(this);
        }
        if (this.type.effects) {
            this.baseCell.removeAllPropagatedModifiers(this.type.translatedEffects);
        }

        this.baseCell.board.removeSpriteFromLayer("content", this.sprite, this.baseCell.gridPos);

        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].content = undefined;
        }
    };
    return Content;
})();

var Cell = (function () {
    function Cell(gridPos, type, board, autoInit) {
        if (typeof autoInit === "undefined") { autoInit = true; }
        this.modifiers = {};
        this.landValueModifiers = {};
        this.overlay = undefined;
        this.gridPos = gridPos;
        this.type = type;
        var distanceFromXCenter = Math.abs((board.width - 1) / 2 - gridPos[0]);
        var distanceFromYCenter = Math.abs((board.height - 1) / 2 - gridPos[1]);
        var meanDistance = (distanceFromYCenter + distanceFromXCenter) / 2;
        var maxDist = (board.width - 1 + board.height - 1) / 2;

        var relativeInverseDist = 1 - (meanDistance / maxDist);

        var baseVal = board.population / 4;

        this.baseLandValue = this.landValue = Math.round(baseVal + baseVal * relativeInverseDist * 0.5);

        this.board = board;
        this.flags = this.type["flags"].slice(0);

        if (autoInit)
            this.init();
    }
    Cell.prototype.init = function () {
        var _s = this.sprite = new GroundSprite(this.type, this);
        _s.position = arrayToPoint(getIsoCoord(this.gridPos[0], this.gridPos[1], TILE_WIDTH, TILE_HEIGHT, [WORLD_WIDTH / 2, TILE_HEIGHT]));
        this.board.addSpriteToLayer("ground", _s);

        if (this.type.effects) {
            this.propagateAllModifiers(this.type.translatedEffects);
        }
    };
    Cell.prototype.getScreenPos = function (container) {
        var wt = container.worldTransform;
        var zoom = wt.a;
        var offset = [wt.tx + WORLD_WIDTH / 2 * zoom, wt.ty + TILE_HEIGHT / 2 * zoom];

        return getIsoCoord(this.gridPos[0], this.gridPos[1], TILE_WIDTH * zoom, TILE_HEIGHT * zoom, offset);
    };
    Cell.prototype.getNeighbors = function (diagonal) {
        if (typeof diagonal === "undefined") { diagonal = false; }
        if (diagonal) {
            if (!this.neighborsWithDiagonals) {
                this.neighborsWithDiagonals = getNeighbors(this.board.cells, this.gridPos, diagonal);
            }
            return this.neighborsWithDiagonals;
        } else {
            if (!this.neighbors) {
                this.neighbors = getNeighbors(this.board.cells, this.gridPos, diagonal);
            }
            return this.neighbors;
        }
    };
    Cell.prototype.getArea = function (_props) {
        var props = Object.create(_props);

        props.targetArray = this.board.cells;
        props.start = this.gridPos;

        return getArea(props);
    };
    Cell.prototype.getDistances = function (radius) {
        return getDistanceFromCell(this.board.cells, [this], radius, true);
    };
    Cell.prototype.replace = function (type) {
        var _oldType = this.type;
        var _texture = type["frame"];
        this.sprite.setTexture(PIXI.Texture.fromFrame(_texture));
        this.sprite.type = this.type = type;
        this.flags = type["flags"].slice(0);
        if (this.content && this.content.baseType === "plant") {
            this.addPlant();
        } else if (this.content) {
            if (!this.checkBuildable(this.content.type, false)) {
                this.changeContent("none");
            } else {
                this.changeContent(this.content.type, false, this.content.player);
            }
        }

        if (_oldType.effects) {
            this.removeAllPropagatedModifiers(_oldType.translatedEffects);
        }
        if (type.effects) {
            this.propagateAllModifiers(type.translatedEffects);
        }
    };
    Cell.prototype.changeUndergroundContent = function (type, update) {
        if (typeof update === "undefined") { update = true; }
        if (this.undergroundContent) {
            this.board.removeSpriteFromLayer("undergroundContent", this.undergroundContent.sprite, this.gridPos);
            this.undergroundContent = undefined;
        }

        if (type) {
            this.undergroundContent = new Content({
                cells: [this],
                type: type,
                layer: "undergroundContent"
            });
        }

        if (update) {
            getTubeConnections(this, 1);
        }
    };
    Cell.prototype.changeContent = function (type, update, player) {
        if (typeof update === "undefined") { update = true; }
        var coversMultipleTiles = (type.size && (type.size[0] > 1 || type.size[1] > 1));

        var buildArea;
        if (coversMultipleTiles) {
            var endX = this.gridPos[0] + type.size[0] - 1;
            var endY = this.gridPos[1] + type.size[1] - 1;

            buildArea = this.board.getCells(rectSelect(this.gridPos, [endX, endY]));
        } else {
            buildArea = [this];
        }

        var buildable = true;
        for (var i = 0; i < buildArea.length; i++) {
            if (!buildArea[i].checkBuildable(type)) {
                buildable = false;
                break;
            }
        }
        if (coversMultipleTiles && buildArea.length !== type.size[0] * type.size[1])
            buildable = false;

        var toAdd = (type !== "none" && buildable !== false);
        var toRemove = (type === "none" || toAdd);

        if (toRemove) {
            for (var i = 0; i < buildArea.length; i++) {
                buildArea[i].removeContent();
            }
        }

        if (toAdd) {
            this.addContent(type, buildArea, player);
        }
        if (update) {
            for (var i = 0; i < buildArea.length; i++) {
                buildArea[i].updateCell();
            }
        }
    };
    Cell.prototype.checkBuildable = function (type, checkContent) {
        if (typeof checkContent === "undefined") { checkContent = true; }
        if (type === "none")
            return true;

        // implicitly true
        var canBuild = true;

        // check invalid
        if (type.canNotBuildOn) {
            // check if any flags in cell conflict with type.canNotBuildOn
            canBuild = arrayLogic.not(this.flags, type.canNotBuildOn);

            // same with content
            if (checkContent && canBuild !== false && this.content) {
                canBuild = arrayLogic.not(this.content.flags, type.canNotBuildOn);
            }
        }

        if (canBuild === false) {
            return false;
        } else {
            var valid = true;

            if (type.canBuildOn) {
                valid = arrayLogic.or(this.flags, type.canBuildOn);
                if (checkContent && !valid && this.content) {
                    valid = arrayLogic.or(this.content.flags, type.canBuildOn);
                }
            }
            return valid;
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
    Cell.prototype.addContent = function (type, cells, player) {
        var _c = new Content({
            cells: cells,
            type: type,
            player: player
        });
        for (var i = 0; i < cells.length; i++) {
            cells[i].content = _c;
            cells[i].applyModifiersToContent();
        }

        if (type.effects) {
            this.propagateAllModifiers(type.translatedEffects);
        }

        // todo
        if (type.underground) {
            for (var i = 0; i < cells.length; i++) {
                cells[i].changeUndergroundContent(cg.content.tubes[type.underground]);
            }
        }

        return this.content;
    };
    Cell.prototype.removeContent = function () {
        if (this.content === undefined) {
            return;
        } else
            this.content.remove();
    };
    Cell.prototype.addModifier = function (modifier) {
        if (!this.modifiers[modifier.type]) {
            this.modifiers[modifier.type] = Object.create(modifier);
        } else {
            this.modifiers[modifier.type].strength += modifier.strength;
        }
        ;

        // check to see if modifiers need to be updated
        if (this.content && (arrayLogic.or(modifier.targets, this.flags) || (this.content && arrayLogic.or(modifier.targets, this.content.flags)))) {
            this.applyModifiersToContent();
        }
    };
    Cell.prototype.removeModifier = function (modifier) {
        if (!this.modifiers[modifier.type])
            return;
        this.modifiers[modifier.type].strength -= modifier.strength;
        if (this.modifiers[modifier.type].strength <= 0) {
            delete this.modifiers[modifier.type];
        }

        if (this.content && (arrayLogic.or(modifier.targets, this.flags) || (this.content && arrayLogic.or(modifier.targets, this.content.flags)))) {
            this.applyModifiersToContent();
        }
    };
    Cell.prototype.propagateModifier = function (modifier) {
        var effectedCells = this.getArea({
            size: modifier.range,
            centerSize: modifier.center,
            excludeStart: true
        });

        for (var cell in effectedCells) {
            if (effectedCells[cell] !== this) {
                effectedCells[cell].addModifier(modifier);
            }
        }
        if (modifier.landValue)
            this.propagateLandValueModifier(modifier);
    };
    Cell.prototype.propagateAllModifiers = function (modifiers) {
        for (var i = 0; i < modifiers.length; i++) {
            this.propagateModifier(modifiers[i]);
        }
    };
    Cell.prototype.removePropagatedModifier = function (modifier) {
        var effectedCells = this.getArea({
            size: modifier.range,
            centerSize: modifier.center,
            excludeStart: true
        });

        for (var cell in effectedCells) {
            effectedCells[cell].removeModifier(modifier);
        }
        if (modifier.landValue)
            this.removePropagatedLandValueModifier(modifier);
    };
    Cell.prototype.removeAllPropagatedModifiers = function (modifiers) {
        for (var i = 0; i < modifiers.length; i++) {
            this.removePropagatedModifier(modifiers[i]);
        }
    };

    // todo: rework later to only update modifiers that have changed
    Cell.prototype.getValidModifiers = function () {
        if (!this.content)
            return;

        var validModifiers = {};
        for (var modifierType in this.modifiers) {
            var modifier = this.modifiers[modifierType];
            if (arrayLogic.or(modifier.targets, this.flags) || (arrayLogic.or(modifier.targets, this.content.flags))) {
                validModifiers[modifierType] = modifier;
            }
        }

        return validModifiers;
    };
    Cell.prototype.applyModifiersToContent = function () {
        if (!this.content)
            return;

        var modifiersToApply = this.getValidModifiers();

        this.content.modifiers = this.content.modifiers || {};
        for (var _mod in modifiersToApply) {
            var modifier = modifiersToApply[_mod];

            if (this.content.modifiers[_mod] && this.content.modifiers[_mod].strength < modifier.strength) {
                this.content.modifiers[_mod] = modifier;
            }
        }

        this.content.applyModifiers();
    };
    Cell.prototype.propagateLandValueModifier = function (modifier) {
        var effectedCells = this.getDistances(modifier.landValue.radius);

        var strengthIndexes = {};

        for (var _cell in effectedCells) {
            var invertedDistance = effectedCells[_cell].invertedDistance;
            var distance = effectedCells[_cell].distance;
            var strength;
            if (modifier.landValue.falloffFN) {
                if (!strengthIndexes[distance]) {
                    strengthIndexes[distance] = modifier.landValue.falloffFN(distance, invertedDistance, effectedCells[_cell].invertedDistanceRatio);
                }
                strength = strengthIndexes[distance];
            } else
                strength = invertedDistance;

            var cell = effectedCells[_cell].item;

            if (cell.landValueModifiers[modifier.type] === undefined) {
                cell.landValueModifiers[modifier.type] = {};

                cell.landValueModifiers[modifier.type].strength = 0;
                if (modifier.landValue.scalingFN) {
                    cell.landValueModifiers[modifier.type].scalingFN = modifier.landValue.scalingFN;
                }
                cell.landValueModifiers[modifier.type].effect = {};
                if (modifier.landValue.multiplier) {
                    cell.landValueModifiers[modifier.type].effect.multiplier = modifier.landValue.multiplier;
                }
                if (modifier.landValue.addedValue) {
                    cell.landValueModifiers[modifier.type].effect.addedValue = modifier.landValue.addedValue;
                }
            }

            cell.landValueModifiers[modifier.type].strength += strength;

            cell.updateLandValue();
        }
    };
    Cell.prototype.removePropagatedLandValueModifier = function (modifier) {
        var effectedCells = this.getDistances(modifier.landValue.radius);

        var strengthIndexes = {};

        for (var _cell in effectedCells) {
            var cell = effectedCells[_cell].item;

            if (!cell.landValueModifiers[modifier.type])
                continue;

            var invertedDistance = effectedCells[_cell].invertedDistance;
            var distance = effectedCells[_cell].distance;
            var strength;
            if (modifier.landValue.falloffFN) {
                if (!strengthIndexes[invertedDistance]) {
                    strengthIndexes[invertedDistance] = modifier.landValue.falloffFN(distance, invertedDistance, effectedCells[_cell].invertedDistanceRatio);
                }
                strength = strengthIndexes[invertedDistance];
            } else
                strength = invertedDistance;

            cell.landValueModifiers[modifier.type].strength -= strength;

            if (cell.landValueModifiers[modifier.type].strength <= 0) {
                delete cell.landValueModifiers[modifier.type];
            }

            cell.updateLandValue();
        }
    };
    Cell.prototype.updateLandValue = function () {
        if (this.type.type === "water") {
            this.landValue = 0;
            return;
        }
        ;
        var totals = {
            addedValue: 0,
            multiplier: 1
        };
        for (var _modifier in this.landValueModifiers) {
            var modifier = this.landValueModifiers[_modifier];

            var strength;
            if (modifier.scalingFN) {
                strength = modifier.scalingFN(modifier.strength);
            } else {
                strength = modifier.strength;
            }

            for (var prop in modifier.effect) {
                totals[prop] += modifier.effect[prop] * strength;
            }
        }

        this.landValue = Math.round((this.baseLandValue + totals.addedValue) * totals.multiplier);
    };
    Cell.prototype.addOverlay = function (color, depth) {
        if (typeof depth === "undefined") { depth = 1; }
        if (this.overlay) {
            this.board.removeSpriteFromLayer("cellOverlay", this.overlay, this.gridPos);
        }

        var neighbors = this.getNeighbors();
        var hitArea = this.type.hitArea;
        var linesToDraw = {
            n: true,
            e: true,
            s: true,
            w: true
        };
        for (var _dir in neighbors) {
            var neighborCell = neighbors[_dir];
            if (neighborCell !== undefined) {
                if (neighborCell.player && neighborCell.player.id === this.player.id) {
                    linesToDraw[_dir] = false;
                }
            }
        }

        var poly = this.type.hitArea;

        // loop back
        poly.push(poly[0]);

        var gfx = new PIXI.Graphics();
        gfx.lineStyle(3, color, 0.6);

        gfx.moveTo(poly[0][0], poly[0][1]);
        var nextIndex = 1;

        for (var _dir in linesToDraw) {
            var nextPoint = poly[nextIndex];

            if (linesToDraw[_dir] === true) {
                gfx.lineTo(nextPoint[0], nextPoint[1]);
            } else {
                gfx.moveTo(nextPoint[0], nextPoint[1]);
            }

            nextIndex++;
        }

        gfx.position = this.sprite.position.clone();
        this.board.addSpriteToLayer("cellOverlay", gfx, this.gridPos);

        this.overlay = gfx;

        var willUpdateNeighbors = false;

        if (depth > 0) {
            for (var _dir in linesToDraw) {
                if (linesToDraw[_dir] === false) {
                    willUpdateNeighbors = true;
                    neighbors[_dir].addOverlay(color, depth - 1);
                }
            }
        }

        if (willUpdateNeighbors === false) {
            game.updateWorld();
        }
    };
    return Cell;
})();

var WorldRenderer = (function () {
    function WorldRenderer(width, height) {
        this.layers = {};
        this.zoomLevel = ZOOM_LEVELS[0];
        this.mapmodes = {
            default: {
                layers: [
                    { type: "ground" },
                    { type: "cellOverlay" },
                    { type: "content" }
                ]
            },
            landValue: {
                layers: [
                    { type: "ground" },
                    { type: "landValueOverlay", alpha: 0.7 },
                    { type: "cellOverlay" },
                    { type: "content" }
                ]
            },
            underground: {
                layers: [
                    { type: "underground" },
                    { type: "undergroundContent" },
                    { type: "ground", alpha: 0.15 }
                ],
                properties: {
                    offsetY: 32
                }
            }
        };
        this.currentMapmode = "default";
        this.initContainers(width, height);
        this.initLayers();
        this.addEventListeners();
    }
    WorldRenderer.prototype.addEventListeners = function () {
        var self = this;
        eventManager.addEventListener("changeZoomLevel", function (event) {
            self.changeZoomLevel(event.content.zoomLevel);
        });
        eventManager.addEventListener("updateWorld", function (event) {
            self.render(event.content.clear);
        });

        var mapmodeSelect = document.getElementById("mapmode-select");
        mapmodeSelect.addEventListener("change", function (event) {
            self.setMapmode(mapmodeSelect.value);
        });

        eventManager.addEventListener("changeMapmode", function (event) {
            self.setMapmode(event.content);
            mapmodeSelect.value = event.content;
        });
        eventManager.addEventListener("updateLandValueMapmode", function (event) {
            if (self.currentMapmode !== "landValue")
                return;

            var zoomLayer = self.layers["zoom" + self.zoomLevel];
            zoomLayer.landValueOverlay = makeLandValueOverlay(game.activeBoard);
            self.changeMapmode("landValue");
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
            this.mapmodes[zoomStr] = {};

            var main = zoomLayer["main"] = new PIXI.DisplayObjectContainer();
        }

        var self = this;
        _ws.mousedown = _ws.touchstart = function (event) {
            game.mouseEventHandler.mouseDown(event, "world");
        };
        _ws.mousemove = _ws.touchmove = function (event) {
            game.mouseEventHandler.mouseMove(event, "world");
        };

        _ws.mouseup = _ws.touchend = function (event) {
            game.mouseEventHandler.mouseUp(event, "world");
        };
        _ws.mouseupoutside = _ws.touchendoutside = function (event) {
            game.mouseEventHandler.mouseUp(event, "world");
        };
    };
    WorldRenderer.prototype.initLayers = function () {
        for (var i = 0; i < ZOOM_LEVELS.length; i++) {
            var zoomStr = "zoom" + ZOOM_LEVELS[i];
            var zoomLayer = this.layers[zoomStr];
            var main = zoomLayer["main"];

            zoomLayer["underground"] = new PIXI.DisplayObjectContainer();
            zoomLayer["undergroundContent"] = new PIXI.DisplayObjectContainer();
            zoomLayer["ground"] = new PIXI.DisplayObjectContainer();
            zoomLayer["landValueOverlay"] = new PIXI.DisplayObjectContainer();
            zoomLayer["cellOverlay"] = new PIXI.DisplayObjectContainer();
            zoomLayer["content"] = new PIXI.DisplayObjectContainer();
        }
    };
    WorldRenderer.prototype.clearLayers = function () {
        for (var i = 0; i < ZOOM_LEVELS.length; i++) {
            var zoomStr = "zoom" + ZOOM_LEVELS[i];
            var zoomLayer = this.layers[zoomStr];
            var main = zoomLayer["main"];

            for (var layer in zoomLayer) {
                if (zoomLayer[layer].children.length > 0) {
                    zoomLayer[layer].removeChildren();
                }
            }

            if (main.children.length > 0)
                main.removeChildren();
        }
        //this.currentMapmode = undefined;
    };
    WorldRenderer.prototype.setBoard = function (board) {
        this.clearLayers();

        for (var zoomLevel in board.layers) {
            for (var layer in board.layers[zoomLevel]) {
                this.layers[zoomLevel][layer].addChild(board.layers[zoomLevel][layer]);
            }
        }

        this.setMapmode(this.currentMapmode);
    };
    WorldRenderer.prototype.changeZoomLevel = function (level) {
        this.zoomLevel = level;
        this.render();
    };
    WorldRenderer.prototype.setMapmode = function (newMapmode) {
        var zoomLayer = this.layers["zoom" + this.zoomLevel];
        switch (newMapmode) {
            case "default": {
                this.changeMapmode("default");
                return;
            }
            case "landValue": {
                zoomLayer.landValueOverlay = makeLandValueOverlay(game.activeBoard);

                this.changeMapmode("landValue");
                return;
            }
            case "underground": {
                if (zoomLayer.underground.children <= 0) {
                    for (var i = 0; i < zoomLayer.ground.children[0].children.length; i++) {
                        var currSprite = zoomLayer.ground.children[0].children[i];

                        var _s = PIXI.Sprite.fromFrame("underground.png");
                        _s.position = currSprite.position.clone();
                        _s.anchor = currSprite.anchor.clone();
                        zoomLayer.underground.addChild(_s);
                    }
                }
                this.changeMapmode("underground");
                return;
            }
        }
    };
    WorldRenderer.prototype.changeMapmode = function (newMapmode) {
        var zoomStr = "zoom" + this.zoomLevel;
        var zoomLayer = this.layers[zoomStr];

        if (zoomLayer.main.children.length > 0) {
            zoomLayer.main.removeChildren();
        }

        for (var i = 0; i < this.mapmodes[newMapmode].layers.length; i++) {
            var layerToAdd = this.mapmodes[newMapmode].layers[i];
            zoomLayer.main.addChild(zoomLayer[layerToAdd.type]);

            zoomLayer[layerToAdd.type].alpha = layerToAdd.alpha || 1;
        }

        var props = this.mapmodes[newMapmode].properties || {};

        this.worldSprite.y = props.offsetY || 0;

        this.currentMapmode = newMapmode;
        this.render();
    };
    WorldRenderer.prototype.render = function (clear) {
        if (typeof clear === "undefined") { clear = true; }
        var zoomStr = "zoom" + this.zoomLevel;
        var activeMainLayer = this.layers[zoomStr]["main"];
        this.renderTexture.render(activeMainLayer, null, clear);
    };
    return WorldRenderer;
})();

var Game = (function () {
    function Game() {
        this.boards = [];
        this.tools = {};
        this.layers = {};
        this.players = {};
        this.toolCache = {};
        this.editModes = [];
    }
    Game.prototype.init = function () {
        this.resize();

        this.initContainers();
        this.initTools();
        this.bindElements();
        this.changeTool("grass");

        for (var i = 0; i < AMT_OF_BOARDS; i++) {
            this.boards.push(new Board({ width: TILES }));
        }
        this.changeActiveBoard(0);
        this.updateBoardSelect();

        this.highlighter = new Highlighter();

        this.mouseEventHandler = new MouseEventHandler();
        this.mouseEventHandler.scroller = new Scroller(this.layers["main"], 0.5);

        this.keyboardEventHandler = new KeyboardEventHandler();

        this.uiDrawer = new UIDrawer();

        this.systemsManager = new SystemsManager(1000);
        var player = new Player(idGenerator.player++);
        player.addMoney(100);
        this.reactUI = new ReactUI(player, this.frameImages);
        this.players[player.id] = player;

        // TODO have content types register themselves
        var dailyProfitSystem = new ProfitSystem(1, this.systemsManager, this.players, ["fastfood", "shopping", "parking"]);
        var monthlyProfitSystem = new ProfitSystem(30, this.systemsManager, this.players, ["apartment"]);
        var quarterlyProfitSystem = new ProfitSystem(90, this.systemsManager, this.players, ["office"]);
        this.systemsManager.addSystem("dailyProfitSystem", dailyProfitSystem);
        this.systemsManager.addSystem("monthlyProfitSystem", monthlyProfitSystem);
        this.systemsManager.addSystem("quarterlyProfitSystem", quarterlyProfitSystem);

        this.systemsManager.addSystem("delayedAction", new DelayedActionSystem(1, this.systemsManager));

        var dateSystem = new DateSystem(1, this.systemsManager, document.getElementById("date"));
        this.systemsManager.addSystem("date", dateSystem);

        this.editModes = ["play", "edit-world"];
        this.switchEditingMode("play");

        this.resize();
        this.render();
        this.updateWorld();

        // TEMPORARY
        game.uiDrawer.makeFadeyPopup([SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2], [0, 0], 5000, new PIXI.Text("ctrl+click to scroll\nshift+click to zoom", {
            font: "bold 50px Arial",
            fill: "#222222",
            align: "center"
        }), TWEEN.Easing.Quartic.In);
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
        _main.addChild(this.worldRenderer.worldSprite);

        var _game = this;

        _stage.mousedown = _stage.touchstart = function (event) {
            _game.mouseEventHandler.mouseDown(event, "stage");
        };
        _stage.mousemove = _stage.touchmove = function (event) {
            _game.mouseEventHandler.mouseMove(event, "stage");
        };
        _stage.mouseup = _stage.touchend = function (event) {
            _game.mouseEventHandler.mouseUp(event, "stage");
        };
        _stage.mouseupoutside = _stage.touchendoutside = function (event) {
            game.mouseEventHandler.mouseUp(event, "stage");
        };
    };
    Game.prototype.initTools = function () {
        this.tools.nothing = new NothingTool();

        this.tools.water = new WaterTool();
        this.tools.grass = new GrassTool();
        this.tools.sand = new SandTool();
        this.tools.snow = new SnowTool();
        this.tools.remove = new RemoveTool();
        this.tools.plant = new PlantTool();
        this.tools.house = new HouseTool();
        this.tools.road = new RoadTool();
        this.tools.subway = new SubwayTool();

        this.tools.buy = new BuyTool();
        this.tools.build = new BuildTool();
    };

    Game.prototype.bindElements = function () {
        var self = this;

        //zoom
        var zoomBtn = document.getElementById("zoomBtn");
        addClickAndTouchEventListener(zoomBtn, function () {
            var zoomAmount = document.getElementById("zoom-amount")["value"];
            game.mouseEventHandler.scroller.zoom(zoomAmount);
        });

        for (var toolName in this.tools) {
            var btn = document.getElementById("" + toolName + "Btn");
            (function addBtnFn(btn, toolName) {
                var tool = self.tools[toolName];
                var type = tool.type;
                if (tool.button === null)
                    return;
                else
                    tool.button = btn;

                addClickAndTouchEventListener(btn, function () {
                    self.changeTool([type]);

                    if (tool.mapmode) {
                        eventManager.dispatchEvent({
                            type: "changeMapmode",
                            content: tool.mapmode
                        });
                    }
                });
            })(btn, toolName);
        }

        //save & load
        var saveBtn = document.getElementById("saveBtn");
        var loadBtn = document.getElementById("loadBtn");
        addClickAndTouchEventListener(saveBtn, function () {
            eventManager.dispatchEvent({
                type: "makeSavePopup", content: ""
            });
        });
        addClickAndTouchEventListener(loadBtn, function () {
            eventManager.dispatchEvent({
                type: "makeLoadPopup", content: ""
            });
            /*
            eventManager.dispatchEvent(
            {
            type: "makeInputPopup",
            content:
            {
            text: "Load",
            onOk: function(name: string)
            {
            self.load(name);
            },
            okBtnText: "Load",
            closeBtnText: "Cancel"
            }
            });
            */
        });

        eventManager.addEventListener("saveGame", function (event) {
            self.save(event.content);
        });
        eventManager.addEventListener("loadGame", function (event) {
            self.load(event.content);
        });

        //recruit
        var recruitBtn = document.getElementById("recruitBtn");

        addClickAndTouchEventListener(recruitBtn, function () {
            if (Object.keys(self.players["player0"].employees).length < 1) {
                // TODO
                if (false) {
                    eventManager.dispatchEvent({
                        type: "makeInfoPopup", content: {
                            text: [
                                "Already used initial recruitment.",
                                "Wait 5 seconds (todo)"]
                        }
                    });
                } else {
                    self.players["player0"].usedInitialRecruit = true;
                    eventManager.dispatchEvent({
                        type: "makeRecruitCompletePopup", content: {
                            player: self.players["player0"],
                            employees: makeNewEmployees(randInt(4, 6), 2)
                        }
                    });
                    window.setTimeout(function () {
                        self.players["player0"].usedInitialRecruit = false;
                    }, 5 * 1000);
                }
            } else {
                eventManager.dispatchEvent({
                    type: "makeRecruitPopup", content: {
                        player: self.players["player0"]
                    }
                });
            }
        });

        //info
        addClickAndTouchEventListener(document.getElementById("show-info"), function () {
            document.getElementById("info-container").style.display = "flex";
        });
        addClickAndTouchEventListener(document.getElementById("close-info"), function () {
            document.getElementById("info-container").style.display = "none";
        });

        //renderer
        this.bindRenderer();

        //resize
        window.addEventListener('resize', game.resize, false);

        window.setInterval(self.autosave.bind(self), 1000 * 60);

        //edit mode select
        var editmodeSelect = document.getElementById("editmode-select");
        editmodeSelect.addEventListener("change", function (event) {
            self.switchEditingMode(editmodeSelect.value);
        });

        //regen world
        addClickAndTouchEventListener(document.getElementById("regen-world"), function () {
            var oldMapmode = game.worldRenderer.currentMapmode;
            self.resetLayers();
            self.activeBoard.destroy();
            self.boards[self.indexOfActiveBoard] = new Board({ width: TILES });

            self.changeActiveBoard(self.indexOfActiveBoard);

            eventManager.dispatchEvent({
                type: "changeMapmode",
                content: oldMapmode
            });
            eventManager.dispatchEvent({
                type: "updateWorld",
                content: ""
            });
            self.updateBoardSelect();
        });

        // board select
        var boardSelect = document.getElementById("board-select");
        boardSelect.addEventListener("change", function (event) {
            self.changeActiveBoard(parseInt(boardSelect.value));
        });
    };
    Game.prototype.bindRenderer = function () {
        var _canvas = document.getElementById("pixi-container");
        _canvas.appendChild(this.renderer.view);
        this.renderer.view.setAttribute("id", "pixi-canvas");
    };
    Game.prototype.updateBoardSelect = function () {
        var boardSelect = document.getElementById("board-select");
        var oldValue = boardSelect.value || "0";
        while (boardSelect.children.length > 0) {
            boardSelect.remove(0);
        }
        for (var i = 0; i < this.boards.length; i++) {
            var opt = document.createElement("option");
            opt.value = "" + i;
            opt.text = this.boards[i].name;

            boardSelect.add(opt);
        }
        boardSelect.value = oldValue;
    };
    Game.prototype.updateWorld = function (clear) {
        eventManager.dispatchEvent({ type: "updateWorld", content: { clear: clear } });
    };
    Game.prototype.resize = function () {
        var container = window.getComputedStyle(document.getElementById("pixi-container"), null);
        SCREEN_WIDTH = parseInt(container.width) / window.devicePixelRatio;
        SCREEN_HEIGHT = parseInt(container.height) / window.devicePixelRatio;
        if (game.renderer) {
            game.renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        }
    };

    Game.prototype.changeTool = function (tool) {
        var oldTool = this.activeTool;
        this.activeTool = this.tools[tool];

        if (oldTool && oldTool.button) {
            oldTool.button.classList.toggle("selected-tool");
        }
        if (this.activeTool.button) {
            this.activeTool.button.classList.toggle("selected-tool");
        }
    };
    Game.prototype.changeActiveBoard = function (index) {
        var oldBoard = this.activeBoard;

        this.activeBoard = this.boards[index];
        this.indexOfActiveBoard = index;

        this.worldRenderer.setBoard(this.activeBoard);
    };
    Game.prototype.destroyAllBoards = function () {
        for (var i = 0; i < this.boards.length; i++) {
            this.boards[i].destroy();
        }
    };
    Game.prototype.save = function (name) {
        var toSave = {
            player: this.savePlayer(this.players["player0"]),
            boards: this.saveBoards(this.boards),
            date: new Date(),
            gameDate: this.systemsManager.systems.date.getDate()
        };
        localStorage.setItem(name, JSON.stringify(toSave));
    };
    Game.prototype.autosave = function () {
        // TODO
        var AUTOSAVELIMIT = 3;

        var autosaves = [];
        for (var saveGame in localStorage) {
            if (saveGame.match(/autosave/)) {
                autosaves.push(saveGame);
            }
        }
        autosaves.sort();
        autosaves = autosaves.slice(0, AUTOSAVELIMIT - 1);
        for (var i = autosaves.length - 1; i >= 0; i--) {
            localStorage.setItem("autosave" + (i + 2), localStorage.getItem(autosaves[i]));
        }
        this.save("autosave");
    };
    Game.prototype.load = function (name) {
        var parsed = JSON.parse(localStorage.getItem(name));
        this.loadPlayer(parsed.player);
        this.loadBoards(parsed);

        // legacy
        if (parsed.gameDate)
            this.systemsManager.systems.date.setDate(parsed.gameDate);
    };
    Game.prototype.saveBoards = function (boardsToSave) {
        var savedBoards = [];
        for (var k = 0; k < boardsToSave.length; k++) {
            var data = {};
            var board = boardsToSave[k];

            data.width = board.width;
            data.height = board.height;
            data.population = board.population;
            data.name = board.name;
            data.cells = [];

            for (var i = 0; i < board.cells.length; i++) {
                data.cells[i] = [];
                for (var j = 0; j < board.cells[i].length; j++) {
                    var boardCell = board.cells[i][j];
                    var cell = data.cells[i][j] = {};
                    cell.type = boardCell.type.type;
                    if (boardCell.player) {
                        cell.player = boardCell.player.id;
                    }
                    if (boardCell.content) {
                        cell.content = {
                            type: boardCell.content.type.type,
                            player: boardCell.content.player ? boardCell.content.player.id : null
                        };
                        if (cell.content.type.baseType === "road") {
                            cell.content.type = cg["content"]["roads"]["road_nesw"];
                        }
                    }
                    if (boardCell.undergroundContent) {
                        cell.undergroundContent = true;
                    }
                }
            }
            savedBoards.push(data);
        }

        return savedBoards;
    };
    Game.prototype.loadBoards = function (data) {
        this.resetLayers();
        this.destroyAllBoards();

        var boardsToLoad = [];
        var newBoards = [];
        var cachedBoardIndex = data.cachedBoardIndex || 0;

        // legacy
        if (data.board) {
            boardsToLoad.push(data.board);
        } else {
            boardsToLoad = data.boards;
        }
        if (boardsToLoad.length === 0)
            throw new Error("No boards to load");

        for (var k = 0; k < boardsToLoad.length; k++) {
            var currToLoad = boardsToLoad[k];

            for (var i = 0; i < currToLoad.cells.length; i++) {
                for (var j = 0; j < currToLoad.cells[i].length; j++) {
                    var cell = currToLoad.cells[i][j];
                    if (cell.player) {
                        cell.player = this.players[cell.player];
                        if (cell.content) {
                            cell.content.player = this.players[cell.player];
                        }
                    }
                }
            }

            var board = new Board({
                width: currToLoad.width,
                height: currToLoad.height,
                savedCells: currToLoad.cells
            });

            board.population = currToLoad.population;
            board.name = currToLoad.name || board.name;

            newBoards.push(board);
        }

        game.boards = newBoards;
        game.changeActiveBoard(cachedBoardIndex);

        eventManager.dispatchEvent({ type: "updateWorld", content: { clear: true } });
        this.updateBoardSelect();
    };

    Game.prototype.savePlayer = function (player) {
        var data = {};
        data.id = player.id;
        data.money = player.money;

        data.employees = player.employees;
        data.modifiers = player.modifiers;

        return data;
    };
    Game.prototype.loadPlayer = function (data) {
        for (var employee in data.employees) {
            data.employees[employee] = new Employee(names, data.employees[employee]);
        }
        var newPlayer = new Player(data.id);
        for (var prop in data) {
            if (data[prop] !== undefined) {
                newPlayer[prop] = data[prop];
            }
        }

        this.players["player0"] = newPlayer;
        newPlayer.updateElements();
    };
    Game.prototype.render = function () {
        this.renderer.render(this.stage);

        TWEEN.update();

        this.systemsManager.update();
        requestAnimFrame(this.render.bind(this));
    };
    Game.prototype.resetLayers = function () {
        this.worldRenderer.clearLayers();
        this.worldRenderer.initLayers();
        this.worldRenderer.render();
    };
    Game.prototype.switchEditingMode = function (newMode) {
        if (newMode === this.currentMode)
            return;

        this.toolCache[this.currentMode] = this.activeTool.type;

        if (!this.toolCache[newMode]) {
            this.changeTool("nothing");
        } else {
            this.changeTool(this.toolCache[newMode]);
        }
        for (var j = 0; j < this.editModes.length; j++) {
            var editMode = this.editModes[j];

            if (newMode !== editMode) {
                var toToggle = document.getElementsByClassName(editMode);
                for (var i = 0; i < toToggle.length; i++) {
                    toToggle[i].classList.add("hidden");
                }
            } else {
                var toToggle = document.getElementsByClassName(editMode);
                for (var i = 0; i < toToggle.length; i++) {
                    toToggle[i].classList.remove("hidden");
                }
            }
        }
        this.currentMode = newMode;
        var el = document.getElementById("editmode-select");
        el.value = newMode;
    };
    return Game;
})();

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

        /*
        if (oldZoom <= 0.5 && zoomAmount > 0.5)
        {
        
        }
        else if ( oldZoom <= 1.5 && oldZoom >= 0.5)
        {
        if (zoomAmount < 0.5)
        else if (zoomAmount > 1.5)
        }
        else if (oldZoom >= 1.5 && zoomAmount < 1.5)
        {
        }*/
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
        var self = this;

        this.currAction = undefined;
        window.oncontextmenu = function (event) {
            var eventTarget = event.target;
            if (eventTarget.localName !== "canvas")
                return;
            event.preventDefault();
            event.stopPropagation();
        };

        var _canvas = document.getElementById("pixi-container");
        _canvas.addEventListener("DOMMouseScroll", function (e) {
            self.scroller.deltaZoom(-e.detail, 0.05);
        });
        _canvas.addEventListener("mousewheel", function (e) {
            self.scroller.deltaZoom(e.wheelDelta / 40, 0.05);
        });
    }
    MouseEventHandler.prototype.mouseDown = function (event, targetType) {
        game.uiDrawer.removeActive();
        if (event.originalEvent.button === 2 && this.currAction !== undefined && targetType === "stage") {
            this.currAction = undefined;
            this.startPoint = undefined;
            this.scroller.end();
            game.highlighter.clearSprites();
            game.updateWorld();
        } else if (event.originalEvent.ctrlKey || event.originalEvent.metaKey || (event.originalEvent.button === 1 || event.originalEvent.button === 2)) {
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

    // need to switch to the click event being transferred to
    // rendertexture parent DOC and checked against individual sprites
    // (that have hit masks) to support slopes / variable height
    MouseEventHandler.prototype.startCellAction = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        this.currAction = "cellAction";
        this.startCell = gridPos;
        this.currCell = gridPos;

        this.selectedCells = [game.activeBoard.getCell(gridPos)];

        game.highlighter.clearSprites();
        game.highlighter.tintCells(this.selectedCells, game.activeTool.tintColor);
        game.updateWorld();
    };
    MouseEventHandler.prototype.worldMove = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        if (!this.currCell || gridPos[0] !== this.currCell[0] || gridPos[1] !== this.currCell[1]) {
            this.currCell = gridPos;

            /*
            this.selectedCells = game.activeBoard.getCells(
            game.activeTool.selectType(this.startCell, this.currCell));
            */
            this.selectedCells = game.activeBoard.getCell(this.currCell).getArea({
                size: 1,
                centerSize: [4, 5],
                excludeStart: true
            });

            game.highlighter.clearSprites();
            game.highlighter.tintCells(this.selectedCells, game.activeTool.tintColor);
            game.updateWorld();
        }
    };
    MouseEventHandler.prototype.worldEnd = function (event) {
        game.activeTool.activate(this.selectedCells);

        game.highlighter.clearSprites();
        this.currAction = undefined;
        this.startCell = undefined;
        this.currCell = undefined;
        this.selectedCells = undefined;

        eventManager.dispatchEvent({ type: "updateLandValueMapmode", content: "" });

        game.updateWorld(true);
    };
    MouseEventHandler.prototype.hover = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        // TEMPORARY
        if (!gridPos)
            return;
        if (gridPos[0] >= TILES || gridPos[1] >= TILES)
            return;
        else if (gridPos[0] < 0 || gridPos[1] < 0)
            return;

        if (!this.hoverCell)
            this.hoverCell = gridPos;
        if (gridPos[0] !== this.hoverCell[0] || gridPos[1] !== this.hoverCell[1]) {
            this.hoverCell = gridPos;
            game.uiDrawer.removeActive();
            game.uiDrawer.makeCellTooltip(event, game.activeBoard.getCell(gridPos), event.target);
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
                font: "16px Arial",
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

        var text = cell.content ? cell.content.type["translate"] || cell.content.type.type : cell.type["type"];

        if (game.worldRenderer.currentMapmode === "landValue") {
            text += "\nLand value: " + cell.landValue;
            for (var modifier in cell.landValueModifiers) {
                text += "\n-------\n";
                var _mod = cell.landValueModifiers[modifier];
                text += "Modifier: " + modifier + "\n";
                text += "Strength: " + _mod.strength + "\n";
                if (_mod.scalingFN) {
                    text += "Adj strength: " + _mod.scalingFN(_mod.strength).toFixed(3) + "\n";
                }
            }
        } else {
            for (var modifier in cell.modifiers) {
                var _mod = cell.modifiers[modifier];
                text += "\n--------------\n";
                text += "Modifier: " + _mod.translate + "\n";
                text += "Strength: " + _mod.strength + "\n";
                text += "Adj strength: " + _mod.scaling(_mod.strength).toFixed(3);
            }
        }

        /*
        else if (cell.content && cell.content.baseProfit)
        {
        text += "\n--------------\n";
        text += "Base profit: " + cell.content.baseProfit.toFixed(2) + "/d" + "\n";
        text += "-------\n";
        for (var modifier in cell.content.modifiers)
        {
        var _mod = cell.content.modifiers[modifier];
        text += "Modifier: " + _mod.translate + "\n";
        text += "Strength: " + _mod.strength + "\n";
        text += "Adj strength: " + _mod.scaling(_mod.strength).toFixed(3) + "\n";
        text += "--------------\n";
        }
        text += "Final profit: " + cell.content.modifiedProfit.toFixed(2) + "/d";
        }
        */
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
    UIDrawer.prototype.makeCellPopup = function (cell, text, container) {
        var pos = cell.getScreenPos(container);
        var content = new PIXI.Text(text, this.fonts["black"]);

        this.makeFadeyPopup([pos[0], pos[1]], [0, -20], 2000, content);
    };
    UIDrawer.prototype.makeFadeyPopup = function (pos, drift, lifeTime, content, easing) {
        if (typeof easing === "undefined") { easing = TWEEN.Easing.Linear.None; }
        var tween = new TWEEN.Tween({
            alpha: 1,
            x: pos[0],
            y: pos[1]
        });
        tween.easing(easing);

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

/*
interface Tool
{
selectType: any;
tintColor: number;
activateCost: number;
activate(target:Cell[]);
}
*/
var Tool = (function () {
    function Tool() {
        this.mapmode = "default";
    }
    Tool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            this.onActivate(target[i]);
        }
    };
    Tool.prototype.onActivate = function (target) {
    };
    return Tool;
})();

var WaterTool = (function (_super) {
    __extends(WaterTool, _super);
    function WaterTool() {
        _super.call(this);
        this.type = "water";
        this.selectType = rectSelect;
        this.tintColor = 0x4444FF;
        this.mapmode = undefined;
    }
    WaterTool.prototype.onActivate = function (target) {
        target.replace(cg["terrain"]["water"]);
    };
    return WaterTool;
})(Tool);

var GrassTool = (function (_super) {
    __extends(GrassTool, _super);
    function GrassTool() {
        _super.call(this);
        this.type = "grass";
        this.selectType = rectSelect;
        this.tintColor = 0x617A4E;
        this.mapmode = undefined;
    }
    GrassTool.prototype.onActivate = function (target) {
        target.replace(cg["terrain"]["grass"]);
    };
    return GrassTool;
})(Tool);

var SandTool = (function (_super) {
    __extends(SandTool, _super);
    function SandTool() {
        _super.call(this);
        this.type = "sand";
        this.selectType = rectSelect;
        this.tintColor = 0xE2BF93;
        this.mapmode = undefined;
    }
    SandTool.prototype.onActivate = function (target) {
        target.replace(cg["terrain"]["sand"]);
    };
    return SandTool;
})(Tool);

var SnowTool = (function (_super) {
    __extends(SnowTool, _super);
    function SnowTool() {
        _super.call(this);
        this.type = "snow";
        this.selectType = rectSelect;
        this.tintColor = 0xBBDFD7;
        this.mapmode = undefined;
    }
    SnowTool.prototype.onActivate = function (target) {
        target.replace(cg["terrain"]["snow"]);
    };
    return SnowTool;
})(Tool);
var RemoveTool = (function (_super) {
    __extends(RemoveTool, _super);
    function RemoveTool() {
        _super.call(this);
        this.type = "remove";
        this.selectType = rectSelect;
        this.tintColor = 0xFF5555;
        this.mapmode = undefined;
    }
    RemoveTool.prototype.onActivate = function (target) {
        if (game.worldRenderer.currentMapmode !== "underground") {
            target.changeContent("none");
        } else {
            target.changeUndergroundContent();
        }
    };
    return RemoveTool;
})(Tool);

var PlantTool = (function (_super) {
    __extends(PlantTool, _super);
    function PlantTool() {
        _super.call(this);
        this.type = "plant";
        this.selectType = rectSelect;
        this.tintColor = 0x338833;
        this.mapmode = undefined;
    }
    PlantTool.prototype.onActivate = function (target) {
        target.addPlant();
    };
    return PlantTool;
})(Tool);

var HouseTool = (function (_super) {
    __extends(HouseTool, _super);
    function HouseTool() {
        _super.call(this);
        this.type = "house";
        this.selectType = rectSelect;
        this.tintColor = 0x696969;
        this.mapmode = undefined;
    }
    HouseTool.prototype.onActivate = function (target) {
        // TODO
        var toChange;
        while (true) {
            //toChange = getRandomProperty(cg["content"]["buildings"]);
            toChange = cg.content.buildings.bigoffice;
            if (toChange.categoryType && toChange.categoryType === "apartment") {
                break;
            }
        }

        target.changeContent(toChange);
    };
    return HouseTool;
})(Tool);
var RoadTool = (function (_super) {
    __extends(RoadTool, _super);
    function RoadTool() {
        _super.call(this);
        this.type = "road";
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
    }
    RoadTool.prototype.onActivate = function (target) {
        target.changeContent(cg["content"]["roads"]["road_nesw"]);
    };
    return RoadTool;
})(Tool);
var SubwayTool = (function (_super) {
    __extends(SubwayTool, _super);
    function SubwayTool() {
        _super.call(this);
        this.type = "subway";
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
        this.mapmode = "underground";
    }
    SubwayTool.prototype.onActivate = function (target) {
        target.changeUndergroundContent(cg["content"]["tubes"]["tube_nesw"]);
    };
    return SubwayTool;
})(Tool);

var BuyTool = (function (_super) {
    __extends(BuyTool, _super);
    function BuyTool() {
        _super.call(this);
        this.type = "buy";
        this.selectType = singleSelect;
        this.tintColor = 0x22EE22;
        this.mapmode = undefined;
    }
    BuyTool.prototype.onActivate = function (target) {
        eventManager.dispatchEvent({
            type: "makeCellBuyPopup", content: {
                player: game.players["player0"],
                cell: target
            }
        });
    };
    return BuyTool;
})(Tool);

var BuildTool = (function (_super) {
    __extends(BuildTool, _super);
    function BuildTool() {
        _super.call(this);
        this.type = "build";
        this.selectType = singleSelect;
        this.tintColor = 0x696969;
        this.mapmode = undefined;
    }
    BuildTool.prototype.onActivate = function (target) {
        eventManager.dispatchEvent({
            type: "makeBuildingSelectPopup", content: {
                player: game.players["player0"],
                cell: target
            }
        });
    };
    return BuildTool;
})(Tool);

var NothingTool = (function (_super) {
    __extends(NothingTool, _super);
    function NothingTool() {
        _super.call(this);
        this.type = "nothing";
        this.selectType = singleSelect;
        this.tintColor = 0xFFFFFF;
        this.mapmode = undefined;
        this.button = null;
    }
    NothingTool.prototype.onActivate = function (target) {
    };
    return NothingTool;
})(Tool);

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

function getTubeConnections(target, depth) {
    var connections = {};
    var dir = "";
    var neighbors = target.getNeighbors(false);
    for (var cell in neighbors) {
        if (neighbors[cell] && neighbors[cell].undergroundContent && neighbors[cell].undergroundContent.baseType === "tube") {
            connections[cell] = true;
        }
    }

    if (depth > 0) {
        for (var connection in connections) {
            getTubeConnections(neighbors[connection], depth - 1);
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
    if (target.undergroundContent && target.undergroundContent.baseType === "tube") {
        var finalTube = cg["content"]["tubes"]["tube_" + dir];
        target.changeUndergroundContent(finalTube, false);
    }
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
//# sourceMappingURL=citygame.js.map
