/// <reference path="utility.d.ts" />
/// <reference path="mapgeneration.d.ts" />
declare class Board {
    public width: number;
    public height: number;
    public cells: any[][];
    constructor(props: {
        width: number;
        height?: number;
        savedCells?: any[][];
    });
    public getCell(arr: number[]): any;
    public getCells(arr: number[]): any;
    public destroy(): void;
}
