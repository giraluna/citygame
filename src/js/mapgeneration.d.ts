/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="utility.d.ts" />
/**
* add base land value
*
*
*/
declare module mapGeneration {
    function makeBlankMap(props: {
        width: number;
        height?: number;
        board: any;
    }): any[];
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
        falloff?: number;
        falloffType?: number;
        landThreshhold?: number;
    }): any;
    function applyCoastsToBoard(props: {
        board: any;
        coastProps?: any;
    }): void;
}
declare function drawCoastInConsole(coast: any): void;
