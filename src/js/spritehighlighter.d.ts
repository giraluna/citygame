/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="eventlistener.d.ts" />
declare class Highlighter {
    public currHighlighted: PIXI.Sprite[];
    public blinkGroups: any;
    public idGenerator: number;
    public blinkIntervals: any;
    public tintSprites(sprites: PIXI.Sprite[], color: number): void;
    public clearSprites(): void;
    public tintCells(cells: any[], color: number): void;
    public tintByBlinkKey(key: string, color: number): void;
    public blinkCells(cells: any[], color: number, delay: number, groupKey: string, id?: string): string;
    public removeSingleBlink(group: string, id: string): void;
    public stopBlink(group: string): void;
    public stopAllBlinks(): void;
}
