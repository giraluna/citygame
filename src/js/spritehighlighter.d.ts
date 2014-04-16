/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="eventlistener.d.ts" />
declare class Highlighter {
    public currHighlighted: PIXI.Sprite[];
    public tintSprites(sprites: PIXI.Sprite[], color: number, shouldGroup?: boolean): void;
    public clearSprites(shouldClear?: boolean): void;
    public clearHighlighted(): void;
    public tintCells(cells: any[], color: number, shouldGroup?: boolean): void;
}
