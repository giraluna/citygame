/// <reference path="../lib/pixi.d.ts" />
/// <reference path="player.d.ts" />
/// <reference path="timer.d.ts" />
/**
* @class SystemsManager
* @classdesc
*
* @param    tickTime       {number}
*
* @property systems     List of systems registered with this
* @property timer
* @property tickTime    Amount of time for single tick
* @property tickNumber  Counter for total ticks so far
* @property accumulated Amount of time banked towards next tick
*
*/
declare class SystemsManager {
    public systems: any;
    public entities: any;
    public eventListener: PIXI.EventTarget;
    public timer: Strawb.Timer;
    public tickTime: number;
    public tickNumber: number;
    public accumulated: number;
    constructor(tickTime: any);
    public init(): void;
    public addSystem(name: string, system: System): void;
    public addEventListeners(listener: any): void;
    public tick(): void;
    public update(): void;
}
declare class System {
    public activationRate: number;
    public lastTick: number;
    public nextTick: number;
    public activate(): void;
    constructor(activationRate: number, currTick: number);
    public updateTicks(currTick: number): void;
    public tick(currTick: number): void;
}
declare class ProfitSystem extends System {
    public targets: any[];
    public systemsManager: SystemsManager;
    public player: Player;
    constructor(activationRate: number, systemsManager: SystemsManager, player: Player);
    public activate(): void;
}
