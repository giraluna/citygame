/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="utility.d.ts" />
/// <reference path="arraylogic.d.ts" />
declare module cityGeneration {
    function placeStation(board: any, _stationType: string, includedArea: number): any;
    function placeMainSubwayLines(board: any): void;
}
