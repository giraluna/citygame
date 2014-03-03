/// <reference path="lib/pixi.d.ts" />
/// <reference path="lib/tween.js.d.ts" />
declare class UIObject extends PIXI.DisplayObjectContainer {
    public _parent: PIXI.DisplayObjectContainer;
    public delay: number;
    public lifeTime: number;
    public timeouts: any;
    constructor(_parent: PIXI.DisplayObjectContainer, delay: number, lifeTime: number);
    public init(): void;
    public remove(): void;
    public clearTimeouts(): void;
}
declare class ToolTip extends UIObject {
    public _parent: PIXI.DisplayObjectContainer;
    public delay: number;
    public lifeTime: number;
    public data: any;
    constructor(_parent: PIXI.DisplayObjectContainer, delay: number, lifeTime: number, data: any);
    public drawToolTip(data: any): void;
}
declare function drawPolygon(gfx: PIXI.Graphics, polygon: number[][], lineStyle: any, fillStyle: any): PIXI.Graphics;
declare function makeSpeechBubble(width?: number, height?: number, offset?: number, tipWidth?: number, tipHeight?: number): number[][];
