/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />
/// <reference path="ui.d.ts" />
/// <reference path="loader.d.ts" />
declare var cg: any;
declare var container: any;
declare var SCREEN_WIDTH: any, SCREEN_HEIGHT: any, TILE_WIDTH: any, TILE_HEIGHT: any, TILES: any, WORLD_WIDTH: any, WORLD_HEIGHT: any;
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
    public type: string;
    public type2: string;
    public id: number;
    public sprite: Sprite;
    public cell: Cell;
    constructor(cell: Cell, type: any, data?: any);
    public init(type: any): void;
    public applyData(data: any): void;
}
interface neighborCells {
    n: Cell;
    e: Cell;
    s: Cell;
    w: Cell;
}
declare class Cell {
    public type: string;
    public sprite: Sprite;
    public content: Content;
    public gridPos: number[];
    public buildable: boolean;
    constructor(gridPos: any, type: any);
    public init(type: string): void;
    public getNeighbors(): neighborCells;
    public replace(type: string): void;
    public changeContent(type: string, update?: boolean, data?: any): void;
    public checkSameTypeExclusion(type2: string): boolean;
    public checkBuildable(type2: string): boolean;
    public addPlant(): void;
    public updateCell(): void;
    public removeContent(): void;
}
declare class Board {
    public width: number;
    public height: number;
    public cells: Cell[][];
    constructor(width: any, height: any);
    public init(): void;
    public makeMap(data?: any): void;
    public getCell(arr: number[]): Cell;
    public getCells(arr: number[]): Cell[];
}
declare class Game {
    public board: Board;
    public tools: any;
    public activeTool: Tool;
    public mouseEventHandler: MouseEventHandler;
    public highlighter: Highlighter;
    public stage: PIXI.Stage;
    public renderer: any;
    public layers: any;
    public uiDrawer: UIDrawer;
    constructor();
    public init(): void;
    public initContainers(): void;
    public initLayers(): void;
    public initTools(): void;
    public bindElements(): void;
    public bindRenderer(): void;
    public changeTool(tool: any): void;
    public saveBoard(): void;
    public loadBoard(): void;
    public render(): void;
    public resetLayers(): void;
}
declare class SortedDisplayObjectContainer extends PIXI.DisplayObjectContainer {
    public container: PIXI.DisplayObjectContainer;
    public indexes: number[];
    constructor(layers: number);
    public init(): void;
    public incrementIndexes(start: number): void;
    public decrementIndexes(start: number): void;
    public addChildAt(element: PIXI.DisplayObject, index: number): void;
    public removeChildAt(element: PIXI.DisplayObject, index: number): void;
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
    constructor(container: PIXI.DisplayObjectContainer, width: any, height: any, bound: any);
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
    public currAction: string;
    public scroller: Scroller;
    constructor();
    public mouseEventHelperFN(event: any): void;
    public scrollStart(event: any): void;
    public zoomStart(event: any): void;
    public stageMove(event: any): void;
    public stageEnd(event: any): void;
    public cellDown(event: any): void;
    public cellOver(event: any): void;
    public cellUp(event: any): void;
}
declare class UIDrawer {
    public layer: PIXI.DisplayObjectContainer;
    public fonts: any;
    public styles: any;
    public active: UIObject;
    constructor();
    public init(): void;
    public removeActive(): void;
    public makeCellTooltip(event: any): ToolTip;
    public clearLayer(): void;
}
declare class Highlighter {
    public currHighlighted: Sprite[];
    public tintSprites(sprites: Sprite[], color: number): void;
    public clearSprites(): void;
    public tintCells(cells: Cell[], color: number): void;
}
interface Tool {
    selectType: any;
    tintColor: number;
    activate(target: Cell[]): any;
}
declare class WaterTool implements Tool {
    public selectType: any;
    public tintColor: number;
    constructor();
    public activate(target: any): void;
}
declare class GrassTool implements Tool {
    public selectType: any;
    public tintColor: number;
    constructor();
    public activate(target: any): void;
}
declare class SandTool implements Tool {
    public selectType: any;
    public tintColor: number;
    constructor();
    public activate(target: any): void;
}
declare class SnowTool implements Tool {
    public selectType: any;
    public tintColor: number;
    constructor();
    public activate(target: any): void;
}
declare class RemoveTool implements Tool {
    public selectType: any;
    public tintColor: number;
    constructor();
    public activate(target: any): void;
}
declare class PlantTool implements Tool {
    public selectType: any;
    public tintColor: number;
    constructor();
    public activate(target: any): void;
}
declare class HouseTool implements Tool {
    public selectType: any;
    public tintColor: number;
    constructor();
    public activate(target: any): void;
}
declare class RoadTool implements Tool {
    public selectType: any;
    public tintColor: number;
    constructor();
    public activate(target: any): void;
}
declare function getRoadConnections(target: Cell, depth: number): any;
declare function rectSelect(a: number[], b: number[]): number[];
declare function manhattanSelect(a: any, b: any): number[];
declare function getFrom2dArray(target: any, arr: number[]): any;
declare function arrayToPolygon(points: any): PIXI.Polygon;
declare function arrayToPoint(point: any): PIXI.Point;
declare function getIsoCoord(x: number, y: number, width: number, height: number, offset?: number[]): number[];
declare function fround(x: any): number;
declare function getRandomProperty(target: any): any;
declare function pineapple(): void;
declare var game: Game;
declare var loader: Loader;
