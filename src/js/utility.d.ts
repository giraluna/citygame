/// <reference path="../../lib/pixi.d.ts" />
declare function getFrom2dArray(target: any, arr: number[]): any;
declare function getRandomKey(target: any): string;
declare function getRandomProperty(target: any): any;
declare function getRandomArrayItem(target: any[]): any;
declare function setDeepProperties(baseObj: any, target: any[], props: any): any;
declare function deepDestroy(object: any): void;
declare function rectToIso(width: number, height: number): number[][];
declare function getOrthoCoord(click: number[], tileSize: number[], worldSize: number[]): number[];
declare function getIsoCoord(x: number, y: number, width: number, height: number, offset?: number[]): number[];
declare function getTileScreenPosition(x: number, y: number, tileSize: number[], worldSize: number[], container: PIXI.DisplayObjectContainer): void;
declare function randInt(min: any, max: any): number;
declare function randRange(min: any, max: any): any;
declare function rollDice(dice: any, sides: any): number;
interface ISpritesheetData {
    frames: {
        [id: string]: {
            frame: {
                x: number;
                y: number;
                w: number;
                h: number;
            };
        };
    };
    meta: any;
}
declare function spritesheetToImages(sheetData: ISpritesheetData, baseUrl: string): {
    [id: string]: HTMLImageElement;
};
declare function addClickAndTouchEventListener(target: any, callback: any): void;
/**
* http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
*
* Converts an HSL color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes h, s, and l are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   Number  h       The hue
* @param   Number  s       The saturation
* @param   Number  l       The lightness
* @return  Array           The RGB representation
*/
declare function hslToRgb(h: any, s: any, l: any): any[];
declare function hslToHex(h: any, s: any, l: any): number;
declare function getNeighbors(targetArray: any[], gridPos: number[], diagonal?: boolean): {
    n: any;
    e: any;
    s: any;
    w: any;
    ne: any;
    nw: any;
    se: any;
    sw: any;
};
