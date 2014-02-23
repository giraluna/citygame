/// <reference path="lib/pixi.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
declare var container: any;
declare var SCREEN_WIDTH: any, SCREEN_HEIGHT: any, TILE_WIDTH: any, TILE_HEIGHT: any, TILES: any, WORLD_WIDTH: any, WORLD_HEIGHT: any;
declare class Sprite extends PIXI.Sprite {
    public type: string;
    public cell: Cell;
    public content: Content;
    constructor(template: any);
}
declare class Content {
    public type: string;
    public id: number;
    public sprite: Sprite;
    public cell: Cell;
    constructor(cell: Cell, template: any);
    public init(template: any): void;
}
declare class Cell {
    public type: string;
    public sprite: Sprite;
    public content: Content;
    public gridPos: number[];
    public buildable: boolean;
    constructor(gridPos: any, type: any);
    public init(type: string): void;
    public replace(type: string): void;
    public changeContent(type: string): void;
    public removeContent(): void;
}
declare class Board {
    public width: number;
    public height: number;
    public cells: Cell[][];
    constructor(width: any, height: any);
    public init(): void;
    public makeMap(key?: any): void;
    public getCells(arr: any): Cell[];
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
    constructor();
    public init(): void;
    public initContainers(): void;
    public initTools(): void;
    public bindElements(): void;
    public changeTool(tool: any): void;
    public render(): void;
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
    public scrollStart(event: any): void;
    public zoomStart(event: any): void;
    public stageMove(event: any): void;
    public stageEnd(event: any): void;
    public cellStart(pos: number[]): void;
    public cellOver(pos: number[]): void;
    public cellEnd(pos: number[]): void;
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
declare function rectSelect(a: number[], b: number[]): number[];
declare function manhattanSelect(a: any, b: any): number[];
declare function getFrom2dArray(target: any, arr: any): number[][];
declare function arrayToPolygon(points: any): PIXI.Polygon;
declare function arrayToPoint(point: any): PIXI.Point;
declare function getIsoCoord(x: number, y: number, width: number, height: number, offset?: number[]): number[];
declare function fround(x: any): number;
declare var game: Game;
