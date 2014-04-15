/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="eventlistener.d.ts" />
declare class Highlighter {
    public currHighlighted: PIXI.Sprite[];
    public blinkGroups: any;
    public intervalIdGenerator: number;
    public blinkIntervals: any;
    public tintSprites(sprites: PIXI.Sprite[], color: number): void;
    public clearSprites(): void;
    public tintCells(cells: any[], color: number): void;
    public blinkCells(cells: any[], color: number, delay: number, key: string): string;
    public stopBlink(key: string): void;
    public stopAllBlinks(): void;
}
