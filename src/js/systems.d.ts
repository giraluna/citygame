/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="player.d.ts" />
/// <reference path="timer.d.ts" />
/// <reference path="eventlistener.d.ts" />
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
    public timer: Strawb.Timer;
    public tickTime: number;
    public tickNumber: number;
    public accumulated: number;
    public paused: boolean;
    public speed: number;
    public speedBeforePausing: number;
    constructor(tickTime: any);
    public init(): void;
    public addSystem(name: string, system: System): void;
    public addEventListeners(): void;
    public pause(): void;
    public unPause(newSpeed?: number): void;
    public togglePause(): void;
    public setSpeed(speed: number): void;
    public update(): void;
    public tick(): void;
}
declare class System {
    public systemsManager: SystemsManager;
    public activationRate: number;
    public lastTick: number;
    public nextTick: number;
    public activate(any: any): void;
    constructor(activationRate: number, currTick: number);
    public updateTicks(currTick: number): void;
    public tick(currTick: number): void;
}
declare class ProfitSystem extends System {
    public players: {
        [key: string]: Player;
    };
    public targetTypes: string[];
    constructor(activationRate: number, systemsManager: SystemsManager, players: {
        [key: string]: Player;
    }, targetTypes: string[]);
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
    public setDate(newDate: IDateObj): void;
    public toString(): string;
    public updateDate(): void;
}
declare class DelayedActionSystem extends System {
    public callbacks: any;
    constructor(activationRate: number, systemsManager: SystemsManager);
    public addEventListeners(): void;
    public addAction(action: any): void;
    public activate(currTick: number): void;
}
declare class AutosaveSystem extends System {
    constructor(activationRate: number, systemsManager: SystemsManager);
    public activate(currTick: number): void;
}
