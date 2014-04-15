/// <reference path="../../lib/pixi.d.ts" />
declare class Highlighter {
    public currHighlighted: PIXI.Sprite[];
    public tintSprites(sprites: PIXI.Sprite[], color: number): void;
    public clearSprites(): void;
    public tintCells(cells: any[], color: number): void;
}
