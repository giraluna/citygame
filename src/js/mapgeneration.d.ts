/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="utility.d.ts" />
/**
* add base land value
*
*
*/
declare module mapGeneration {
    function makeBlankCells(props: {
        width: number;
        height?: number;
    }): string[][];
    function convertCells(cells: string[][], board: any): void;
    function readSavedMap(props: {
        board: any;
        savedCells: any;
    }): void;
    interface ICardinalDirections {
        n: any;
        e: any;
        s: any;
        w: any;
    }
    function makeCoasts(props?: {
        mapWidth: number;
        mapHeight?: number;
        coasts?: any;
        amount?: number;
        amountWeights?: number[];
        depth?: number;
        variation?: number;
        yFalloff?: number;
        yFalloffType?: number;
        xCutoff?: number;
        xFalloff?: number;
        xFalloffType?: number;
        landThreshhold?: number;
    }): any;
    function applyCoastsToCells(props: {
        cells: string[][];
        coasts?: any;
        coastProps?: any;
    }): void;
    function smoothCells(cells: any, minToChange?: number, radius?: number, times?: number): any;
}
declare function drawCoastInConsole(coast: any): void;
declare function drawNeighbors(neighs: any, center: any): void;
