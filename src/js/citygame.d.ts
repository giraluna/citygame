/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../../lib/tween.js.d.ts" />
/// <reference path="../reactui/js/reactui.d.ts" />
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="../../data/js/names.d.ts" />
/// <reference path="../../data/js/playermodifiers.d.ts" />
/// <reference path="ui.d.ts" />
/// <reference path="loader.d.ts" />
/// <reference path="sorteddisplaycontainer.d.ts" />
/// <reference path="player.d.ts" />
/// <reference path="systems.d.ts" />
/// <reference path="eventlistener.d.ts" />
/// <reference path="spritehighlighter.d.ts" />
/// <reference path="keyboardinput.d.ts" />
/// <reference path="mapgeneration.d.ts" />
/// <reference path="board.d.ts" />
/// <reference path="options.d.ts" />
/// <reference path="landvalueoverlay.d.ts" />
/// <reference path="utility.d.ts" />
/// <reference path="arraylogic.d.ts" />
declare var SCREEN_WIDTH: number, SCREEN_HEIGHT: number, TILE_WIDTH: number, TILE_HEIGHT: number, SPRITE_HEIGHT: number, TILES: number, WORLD_WIDTH: number, WORLD_HEIGHT: number, ZOOM_LEVELS: number[], AMT_OF_BOARDS: number;
declare var idGenerator: any;
declare class Sprite extends PIXI.Sprite {
    public type: string;
    public content: Content;
    constructor(template: any, frameIndex?: number);
}
declare class GroundSprite extends Sprite {
    public cell: Cell;
    constructor(type: any, cell: any);
}
declare class ContentSprite extends Sprite {
    public content: Content;
    constructor(type: any, content: any, frameIndex: number);
}
declare class Content {
    public type: any;
    public baseType: string;
    public categoryType: string;
    public id: number;
    public sprites: Sprite[];
    public cells: Cell[];
    public baseCell: Cell;
    public size: number[];
    public flags: string[];
    public baseProfit: number;
    public modifiers: any;
    public modifiedProfit: number;
    public player: Player;
    constructor(props: {
        cells: Cell[];
        type: any;
        player?: Player;
        id?: number;
        layer?: string;
    });
    public init(type: any, layer?: string): void;
    public applyModifiers(): void;
    public remove(): void;
}
interface neighborCells {
    n: Cell;
    e: Cell;
    s: Cell;
    w: Cell;
    ne: Cell;
    nw: Cell;
    se: Cell;
    sw: Cell;
}
declare class Cell {
    public type: any;
    public board: Board;
    public sprite: Sprite;
    public content: Content;
    public undergroundContent: Content;
    public baseLandValue: number;
    public landValue: number;
    public gridPos: number[];
    public flags: string[];
    public modifiers: any;
    public landValueModifiers: any;
    public overlay: PIXI.Graphics;
    public overlayColor: number;
    public player: Player;
    public neighbors: neighborCells;
    public neighborsWithDiagonals: neighborCells;
    constructor(gridPos: any, type: any, board: any, autoInit?: boolean);
    public init(): void;
    public getScreenPos(container: any): number[];
    public getNeighbors(diagonal?: boolean): neighborCells;
    public getArea(_props: {
        size: number;
        centerSize?: number[];
        anchor?: string;
        excludeStart?: boolean;
    }): any;
    public getDistances(radius: number, centerSize?: number[]): any;
    public replace(type: any): void;
    public changeUndergroundContent(type?: string, update?: boolean): void;
    public changeContent(type: any, update?: boolean, player?: Player, checkPlayer?: boolean): void;
    public checkBuildable(type: any, player?: Player, checkContent?: boolean): boolean;
    public addPlant(): void;
    public updateCell(): void;
    public addContent(type: any, cells: Cell[], player?: Player): Content;
    public removeContent(): void;
    public checkIfModifierApplies(modifier: any): boolean;
    public getModifierPolarity(modifier: any): boolean;
    public addModifier(modifier: any, source: any): void;
    public removeModifier(modifier: any, source: any): void;
    public propagateModifier(modifier: any): void;
    public propagateAllModifiers(modifiers: any[]): void;
    public removePropagatedModifier(modifier: any): void;
    public removeAllPropagatedModifiers(modifiers: any[]): void;
    public getValidModifiers(contentType?: any): any;
    public applyModifiersToContent(): void;
    public propagateLandValueModifier(modifier: any): void;
    public removePropagatedLandValueModifier(modifier: any): void;
    public updateLandValue(): void;
    public addOverlay(color: any, depth?: number): void;
    public removeOverlay(): void;
}
declare class WorldRenderer {
    public layers: any;
    public renderTexture: PIXI.RenderTexture;
    public worldSprite: PIXI.Sprite;
    public zoomLevel: number;
    public mapmodes: {
        default: {
            layers: {
                type: string;
            }[];
        };
        landValue: {
            layers: {
                type: string;
            }[];
        };
        underground: {
            layers: {
                type: string;
            }[];
            properties: {
                offsetY: number;
            };
        };
    };
    public currentMapmode: string;
    constructor(width: any, height: any);
    public addEventListeners(): void;
    public initContainers(width: any, height: any): void;
    public initLayers(): void;
    public clearLayers(): void;
    public setBoard(board: Board): void;
    public changeZoomLevel(level: any): void;
    public setMapmode(newMapmode: string): void;
    public changeMapmode(newMapmode: string): void;
    public render(clear?: boolean): void;
}
declare class Game {
    public boards: Board[];
    public activeBoard: Board;
    public indexOfActiveBoard: number;
    public tools: any;
    public activeTool: Tool;
    public mouseEventHandler: MouseEventHandler;
    public keyboardEventHandler: KeyboardEventHandler;
    public highlighter: Highlighter;
    public stage: PIXI.Stage;
    public renderer: any;
    public layers: any;
    public uiDrawer: UIDrawer;
    public reactUI: ReactUI;
    public systemsManager: SystemsManager;
    public worldRenderer: WorldRenderer;
    public players: {
        [id: string]: Player;
    };
    public toolCache: any;
    public editModes: string[];
    public currentMode: string;
    public frameImages: {
        [id: string]: HTMLImageElement;
    };
    constructor();
    public init(): void;
    public initContainers(): void;
    public initTools(): void;
    public bindElements(): void;
    public bindRenderer(): void;
    public updateBoardSelect(): void;
    public updateWorld(clear?: boolean): void;
    public resize(): void;
    public changeTool(tool: any): void;
    public changeActiveBoard(index: number): void;
    public destroyAllBoards(): void;
    public getCell(props: {
        gridPos: number[];
        boardId: number;
    }): any;
    public save(name: string): void;
    public autosave(): void;
    public load(name: string): void;
    public saveBoards(boardsToSave: Board[]): any[];
    public loadBoards(data: any): void;
    public savePlayer(player: Player): any;
    public loadPlayer(data: any): void;
    public saveOptions(): void;
    public loadOptions(): void;
    public saveActions(system: DelayedActionSystem): any[];
    public loadActions(toLoad: any[]): void;
    public prestigeReset(onReset: any): void;
    public render(): void;
    public updateSystems(): void;
    public resetLayers(): void;
    public switchEditingMode(newMode: string): void;
}
declare class Scroller {
    public container: PIXI.DisplayObjectContainer;
    public width: number;
    public height: number;
    public bounds: any;
    public startPos: number[];
    public startClick: number[];
    public currZoom: number;
    public zoomField: any;
    constructor(container: PIXI.DisplayObjectContainer, bound: any);
    public startScroll(mousePos: any): void;
    public end(): void;
    public setBounds(): void;
    public getDelta(currPos: any): number[];
    public move(currPos: any): void;
    public zoom(zoomAmount: number): void;
    public deltaZoom(delta: any, scale: any): void;
    public clampEdges(): void;
}
declare class MouseEventHandler {
    public startPoint: number[];
    public currPoint: number[];
    public startCell: number[];
    public currCell: number[];
    public hoverCell: number[];
    public currAction: string;
    public stashedAction: string;
    public selectedCells: Cell[];
    public preventingGhost: boolean;
    public scroller: Scroller;
    constructor();
    public preventGhost(delay: number): void;
    public mouseDown(event: any, targetType: string): void;
    public mouseMove(event: any, targetType: string): void;
    public mouseUp(event: any, targetType: string): void;
    public startScroll(event: any): void;
    public startZoom(event: any): void;
    public stageMove(event: any): void;
    public stageEnd(event: any): void;
    public startCellAction(event: any): void;
    public worldMove(event: any): void;
    public worldEnd(event: any): void;
    public hover(event: any): void;
}
declare class UIDrawer {
    public layer: PIXI.DisplayObjectContainer;
    public fonts: any;
    public styles: any;
    public textureCache: any;
    public active: UIObject;
    public permanentUIObjects: UIObject[];
    public buildingTipTimeOut: any;
    constructor();
    public init(): void;
    public removeActive(): void;
    public clearAllObjects(): void;
    public makeCellTooltip(event: any, cell: Cell, container: PIXI.DisplayObjectContainer): UIObject;
    public makeCellPopup(cell: Cell, text: string, container: PIXI.DisplayObjectContainer, fontName?: string): void;
    public makeBuildingTipsForCell(baseCell: Cell, delay?: number): void;
    public makeBuildingTips(buildArea: Cell[], buildingType: any): void;
    public makeBuildingPlacementTip(cell: Cell, type: string, container: PIXI.DisplayObjectContainer): void;
    public makeFadeyPopup(pos: number[], drift: number[], lifeTime: number, content: any, easing?: (k: number) => number): UIObject;
    public clearLayer(): void;
}
declare class Tool {
    public type: string;
    public selectType: any;
    public tintColor: number;
    public activateCost: number;
    public mapmode: string;
    public continuous: boolean;
    public tempContinuous: boolean;
    public button: HTMLInputElement;
    public activate(target: Cell[]): void;
    public onChange(): void;
    public onActivate(target: Cell, props?: any): void;
    public onHover(targets: Cell[]): void;
    public onFinish(): void;
}
declare class WaterTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class GrassTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class SandTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class SnowTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class RemoveTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class SellTool extends Tool {
    constructor();
    public activate(selectedCells: any[]): void;
    public onActivate(target: Cell, props?: any): void;
}
declare class PlantTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class HouseTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class RoadTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class SubwayTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class BuyTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare class BuildTool extends Tool {
    public selectedBuildingType: any;
    public canBuild: boolean;
    public mainCell: Cell;
    public continuous: boolean;
    public timesTriedToBuiltOnNonOwnedPlot: number;
    public ghostSprites: {
        sprite: PIXI.Sprite;
        pos: number[];
    }[];
    constructor();
    public setDefaults(): void;
    public changeBuilding(buildingType: any, continuous?: boolean): void;
    public activate(selectedCells: any[]): void;
    public onHover(targets: Cell[]): void;
    public onFinish(): void;
    public clearEffects(): void;
    public clearGhostBuilding(): void;
}
declare class ClickTool extends Tool {
    constructor();
    public onChange(): void;
    public onActivate(target: Cell): void;
}
declare class NothingTool extends Tool {
    constructor();
    public onActivate(target: Cell): void;
}
declare function getRoadConnections(target: Cell, depth: number): any;
declare function getTubeConnections(target: Cell, depth: number): any;
declare function pineapple(): void;
declare var game: Game;
declare var loader: Loader;
