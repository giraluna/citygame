/// <reference path="lib/pixi.d.ts" />
/// <reference path="lib/tween.js.d.ts" />
declare class UIObject extends PIXI.DisplayObjectContainer {
    public _parent: PIXI.DisplayObjectContainer;
    public delay: number;
    public lifeTime: number;
    constructor(_parent: PIXI.DisplayObjectContainer, delay: number, lifeTime: number);
    public init(): void;
    public remove(): void;
}
