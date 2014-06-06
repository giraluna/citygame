/// <reference path="utility.d.ts" />
/// <reference path="mapgeneration.d.ts" />
/// <reference path="citygeneration.d.ts" />
declare class Board {
    public width: number;
    public height: number;
    public cells: any[][];
    public mapGenInfo: any;
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
}
