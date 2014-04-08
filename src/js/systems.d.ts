/// <reference path="../../lib/pixi.d.ts" />
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
* @property tickTime    Amount of time for single tick in ms
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
    public paused: boolean;
    constructor(tickTime: any);
    public init(): void;
    public addSystem(name: string, system: System): void;
    public addEventListeners(listener: any): void;
    public update(): void;
    public tick(): void;
}
declare class System {
    public systemsManager: SystemsManager;
    public activationRate: number;
    public lastTick: number;
    public nextTick: number;
    public activate(currTick?: any): void;
    constructor(activationRate: number, currTick: number);
    public updateTicks(currTick: number): void;
    public tick(currTick: number): void;
}
declare class ProfitSystem extends System {
    public targets: any[];
    public player: Player;
    constructor(activationRate: number, systemsManager: SystemsManager, player: Player);
    public activate(): void;
}
interface IDateObj {
    year: number;
    month: number;
    day: number;
}
declare class DateSystem extends System {
    public year: number;
    public month: number;
    public day: number;
    public dateElem: HTMLElement;
    public onDayChange: {
        (): any;
    }[];
    public onMonthChange: {
        (): any;
    }[];
    public onYearChange: {
        (): any;
    }[];
    constructor(activationRate: number, systemsManager: SystemsManager, dateElem: HTMLElement, startDate?: IDateObj);
    public activate(): void;
    public incrementDate(): void;
    public calculateDate(): void;
    public fireCallbacks(targets: {
        (): any;
    }[], date: number): void;
    public getDate(): IDateObj;
    public toString(): string;
    public updateDate(): void;
}
