/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="spritehighlighter.d.ts" />
/// <reference path="eventlistener.d.ts" />
declare class Blinker extends Highlighter {
    public delay: number;
    public color: number;
    public repeat: number;
    public toBlink: {
        [key: string]: PIXI.Sprite[];
    };
    public idGenerator: number;
    private blinkFunctions;
    private intervalFN;
    private blink;
    private clearFN;
    constructor(delay: number, color: number, repeat: number, autoStart?: boolean);
    public getToBlink(id?: number): any[];
    private makeBlinkFunctions();
    public addCells(cells: any[], id?: number): number;
    public removeCells(id: number): number;
    public start(): Blinker;
    public pause(): Blinker;
    public stop(): Blinker;
}
