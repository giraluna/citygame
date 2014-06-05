/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../../lib/tween.js.d.ts" />
/// <reference path="../reactui/js/reactui.d.ts" />
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="ui.d.ts" />
/// <reference path="loader.d.ts" />
/// <reference path="player.d.ts" />
/// <reference path="systems.d.ts" />
/// <reference path="eventlistener.d.ts" />
/// <reference path="spritehighlighter.d.ts" />
/// <reference path="keyboardinput.d.ts" />
/// <reference path="mapgeneration.d.ts" />
/// <reference path="board.d.ts" />
/// <reference path="landvalueoverlay.d.ts" />
/// <reference path="utility.d.ts" />
/// <reference path="arraylogic.d.ts" />
declare var SCREEN_WIDTH: number, SCREEN_HEIGHT: number, TILE_WIDTH: number, TILE_HEIGHT: number, TILES: number, WORLD_WIDTH: number, WORLD_HEIGHT: number, ZOOM_LEVELS: number[];
declare var idGenerator: any;
declare class Sprite extends PIXI.Sprite {
    public type: string;
    public content: Content;
    constructor(template: any);
}
declare class GroundSprite extends Sprite {
    public cell: Cell;
    constructor(type: any, cell: any);
}
declare class ContentSprite extends Sprite {
    public content: Content;
    constructor(type: any, content: any);
}
declare class Content {
    public type: any;
    public baseType: string;
    public categoryType: string;
    public id: number;
    public sprite: Sprite;
    public cell: Cell;
    public flags: string[];
    public baseProfit: number;
    public baseProfitPerDay: number;
    public modifiers: any;
    public modifiedProfit: number;
    public modifiedProfitPerDay: number;
    public player: Player;
    constructor(props: {
        cell: Cell;
        type: any;
        player?: Player;
        id?: number;
        layer?: string;
    });
    public init(type: any, layer?: string): void;
    public applyModifiers(): void;
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
    public overlay: PIXI.Graphics;
    public player: Player;
    constructor(gridPos: any, type: any, board: any, autoInit?: boolean);
    public init(): void;
    public getScreenPos(container: any): number[];
    public getNeighbors(diagonal?: boolean): neighborCells;
    public getArea(size: number, anchor?: string, excludeStart?: boolean): any;
    public replace(type: any): void;
    public changeUndergroundContent(type?: string, update?: boolean): void;
    public changeContent(type: string, update?: boolean, player?: Player): void;
    public checkBuildable(type: any, checkContent?: boolean): boolean;
    public addPlant(): void;
    public updateCell(): void;
    public addContent(type: any, player?: Player): Content;
    public removeContent(): void;
    public addModifier(modifier: any): void;
    public removeModifier(modifier: any): void;
    public propagateModifier(modifier: any): void;
    public propagateAllModifiers(modifiers: any[]): void;
    public removePropagatedModifier(modifier: any): void;
    public removeAllPropagatedModifiers(modifiers: any[]): void;
    public getValidModifiers(): any;
    public applyModifiersToContent(): void;
    public updateLandValue(): void;
    public addOverlay(color: any, depth?: number): void;
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
    public changeZoomLevel(level: any): void;
    public setMapmode(newMapmode: string): void;
    public changeMapmode(newMapmode: string): void;
    public render(clear?: boolean): void;
}
declare class Game {
    public board: Board;
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
    public initLayers(): void;
    public initTools(): void;
    public bindElements(): void;
    public bindRenderer(): void;
    public updateWorld(clear?: boolean): void;
    public resize(): void;
    public changeTool(tool: any): void;
    public save(name: string): void;
    public autosave(): void;
    public load(name: string): void;
    public saveBoard(board: Board): any;
    public loadBoard(data: any): void;
    public savePlayer(player: Player): any;
    public loadPlayer(data: any): void;
    public render(): void;
    public resetLayers(): void;
    public switchEditingMode(newMode: string): void;
}
declare class SortedDisplayObjectContainer extends PIXI.DisplayObjectContainer {
    public container: PIXI.DisplayObjectContainer;
    public _sortingIndexes: number[];
    constructor(layers: number);
    public init(): void;
    public incrementIndexes(start: number): void;
    public decrementIndexes(start: number): void;
    public _addChildAt(element: PIXI.DisplayObject, index: number): void;
    public _removeChildAt(element: PIXI.DisplayObject, index: number): void;
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
    public scroller: Scroller;
    constructor();
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
    public active: UIObject;
    constructor();
    public init(): void;
    public removeActive(): void;
    public makeCellTooltip(event: any, cell: Cell, container: PIXI.DisplayObjectContainer): UIObject;
    public makeCellPopup(cell: Cell, text: string, container: PIXI.DisplayObjectContainer): void;
    public makeFadeyPopup(pos: number[], drift: number[], lifeTime: number, content: any, easing?: (k: number) => number): void;
    public clearLayer(): void;
}
declare class Tool {
    public type: string;
    public selectType: any;
    public tintColor: number;
    public activateCost: number;
    public mapmode: string;
    public hasButton: boolean;
    public activate(target: Cell[]): void;
    public onActivate(target: Cell): void;
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
    constructor();
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
