/// <reference path="utility.d.ts" />
/// <reference path="sorteddisplaycontainer.d.ts" />
/// <reference path="mapgeneration.d.ts" />
/// <reference path="citygeneration.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
declare var idGenerator: any;
declare class Board {
    public id: number;
    public name: string;
    public width: number;
    public height: number;
    public totalSize: number;
    public cells: any[][];
    public mapGenInfo: any;
    public layers: any;
    public population: number;
    constructor(props: {
        width: number;
        height?: number;
        savedCells?: any[][];
    });
    public generateMap(): void;
    public generateCity(): void;
    public getCell(arr: number[]): any;
    public getCells(arr: number[]): any;
    public destroy(): void;
    public initLayers(): void;
    public addSpriteToLayer(layerToAddTo: string, spriteToAdd: any, gridPos?: number[]): void;
    public removeSpriteFromLayer(layerToRemoveFrom: string, spriteToRemove: any, gridPos?: number[]): void;
}
