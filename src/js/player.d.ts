/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="eventlistener.d.ts" />
/// <reference path="utility.d.ts" />
declare class Player {
    public id: string;
    public color: number;
    public money: number;
    public level: number;
    public experience: number;
    public experienceForCurrentLevel: number;
    public experienceToNextLevel: number;
    public eventListener: any;
    public ownedContent: any;
    public amountBuiltPerType: any;
    public ownedCells: any;
    public employees: any;
    public usedInitialRecruit: boolean;
    public incomePerDate: any;
    public incomePerType: any;
    public modifiers: any;
    public modifierEffects: any;
    public moneySpan: HTMLElement;
    public incomeSpan: HTMLElement;
    constructor(id: string, experience?: number, color?: number);
    public bindElements(): void;
    public updateElements(): void;
    public init(): void;
    public addEventListeners(): void;
    public addEmployee(employee: Employee): void;
    public getEmployees(): any[];
    public getActiveEmployees(): any[];
    public addCell(cell: any): void;
    public removeCell(cell: any): void;
    public sellCell(cell: any): void;
    public addContent(content: any): void;
    public removeContent(content: any): void;
    public sellContent(content: any): void;
    public addMoney(initialAmount: any, incomeType?: string, date?: any): void;
    public addModifier(modifier: any): void;
    public applyModifier(modifier: any): void;
    public applyAllModifiers(): void;
    public removeModifier(modifier: any): void;
    public getBuildCost(type: any): number;
    public getCellBuyCost(baseCost: any): number;
    public addExperience(amount: any): void;
    public levelUp(): void;
    public getExperienceForLevel(level: any): number;
    public setExperienceToNextLevel(): void;
    public getExperiencePercentage(): number;
}
