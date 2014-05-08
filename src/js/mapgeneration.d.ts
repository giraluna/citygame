/// <reference path="../../data/js/cg.d.ts" />
/**
* add base land value
* add random modifier of land value to tiles
* create water
*   coasts
*     amount
*     directions
*     types
*       coast
*       bay
*       broken
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
}
