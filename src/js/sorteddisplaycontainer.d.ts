/// <reference path="../../lib/pixi.d.ts" />
declare class SortedDisplayObjectContainer extends PIXI.DisplayObjectContainer {
    public container: PIXI.DisplayObjectContainer;
    public _sortingIndexes: number[];
    constructor(layers: number);
    public init(): void;
    public incrementIndexes(start: number): void;
    public decrementIndexes(start: number): void;
    public _addChildAt(element: PIXI.DisplayObject, index: number): void;
    public _removeChildAt(element: PIXI.DisplayObject, index: number): void;
}
