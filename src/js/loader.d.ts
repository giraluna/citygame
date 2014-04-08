/// <reference path="../../lib/pixi.d.ts" />
declare var WebFont: any;
declare var WebFontConfig: any;
declare class Loader {
    public loaded: any;
    public game: any;
    public startTime: number;
    constructor(game: any);
    public loadFonts(): void;
    public loadSprites(): void;
    public checkLoaded(): void;
}
