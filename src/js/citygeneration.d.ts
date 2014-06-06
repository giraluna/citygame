/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="utility.d.ts" />
/// <reference path="arraylogic.d.ts" />
declare module cityGeneration {
    interface IExclusionTypes {
        radius: number;
        flags: string[];
    }
    function placeBuilding(board: any, _buildingType: string, includedArea: number, exclusions?: IExclusionTypes[]): any;
    function placeMainSubwayLines(board: any): void;
    function placeInitialHousing(board: any): void;
}
