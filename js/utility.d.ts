/// <reference path="../lib/pixi.d.ts" />
declare function getFrom2dArray(target: any, arr: number[]): any;
declare function getRandomProperty(target: any): any;
declare function setDeepProperties(baseObj: any, target: any[], props: any): any;
declare function deepDestroy(object: any): void;
declare function rectToIso(width: number, height: number): number[][];
declare function getOrthoCoord(click: number[], tileSize: number[], worldSize: number[]): number[];
declare function getIsoCoord(x: number, y: number, width: number, height: number, offset?: number[]): number[];
declare function getTileScreenPosition(x: number, y: number, tileSize: number[], worldSize: number[], container: PIXI.DisplayObjectContainer): void;
