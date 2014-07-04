/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../../lib/tween.js.d.ts" />
/// <reference path="utility.d.ts" />
declare class UIObject extends PIXI.DisplayObjectContainer {
    public _destroyChildren: boolean;
    public _timeouts: any;
    public _callbacks: any;
    public _delay: number;
    public _lifeTime: number;
    public _parent: PIXI.DisplayObjectContainer;
    constructor(parent: any, destroyChildren?: boolean);
    public start(): UIObject;
    public setParent(parent: PIXI.DisplayObjectContainer): UIObject;
    public delay(time: number): UIObject;
    public lifeTime(time: number): UIObject;
    public addChild(child: any): UIObject;
    public fireCallbacks(id: string): UIObject;
    public remove(): void;
    public onStart(callback: any): UIObject;
    public onAdded(callback: any): UIObject;
    public onComplete(callback: any): UIObject;
    private clearTimeouts();
}
declare function makeToolTip(data: any, text: PIXI.Text): PIXI.DisplayObjectContainer;
declare function drawPolygon(gfx: PIXI.Graphics, polygon: number[][], lineStyle: any, fillStyle: any): PIXI.Graphics;
declare function makeSpeechRect(data: any, text?: PIXI.Text): number[][];
