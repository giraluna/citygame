/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="../../data/js/playermodifiers.d.ts" />
/// <reference path="../../data/js/levelupmodifiers.d.ts" />
/// <reference path="eventlistener.d.ts" />
/// <reference path="utility.d.ts" />
declare class Player {
    public id: string;
    public color: number;
    public money: number;
    public clicks: number;
    public level: number;
    public experience: number;
    public experienceForCurrentLevel: number;
    public experienceToNextLevel: number;
    public eventListener: any;
    public ownedContent: any;
    public amountBuiltPerType: any;
    public ownedCells: any;
    public ownedCellsAmount: number;
    public employees: any;
    public usedInitialRecruit: boolean;
    public incomePerDate: any;
    public incomePerType: any;
    public rollingIncome: number[];
    public lastRollingIncomeDay: number;
    public modifiers: any;
    public dynamicModifiers: any;
    public timedModifiers: any;
    public levelUpModifiers: any;
    public specialModifiers: any;
    public modifierEffects: any;
    public unlockedModifiers: any[];
    public lockedModifiers: any[];
    public unlockedLevelUpModifiers: {
        [level: number]: playerModifiers.IPlayerModifier[];
    };
    public levelUpModifiersPerLevelUp: number;
    public levelsAlreadyPicked: any;
    public recentlyCheckedUnlockConditions: any;
    public indexedProfits: any;
    public moneySpan: HTMLElement;
    public incomeSpan: HTMLElement;
    constructor(id: string, color?: number);
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
    public addMoney(initialAmount: any, incomeType?: string, daysPerTick?: number, date?: any): any;
    public addModifier(modifier: any, collection?: string, firstTime?: boolean): void;
    public addSpecialModifier(modifier: any): void;
    public addTimedModifier(modifier: any): void;
    public addDynamicModifier(sourceModifier: any): void;
    public applyModifier(modifier: any): void;
    public applyAllModifiers(): void;
    public removeModifier(modifier: any, collection?: string): void;
    public getBuildCost(type: any): number;
    public getCellBuyCost(cell: any): number;
    public addExperience(amount: any): void;
    public levelUp(callSize?: number): void;
    public getExperienceForLevel(level: any): number;
    public setExperienceToNextLevel(): void;
    public getExperiencePercentage(): number;
    public getModifiedProfit(initialAmount: number, type?: string): number;
    public getIndexedProfit(type: any, amount: any): any;
    public clearIndexedProfits(): void;
    public getUnlockConditionVariable(conditionType: string): any;
    public checkIfUnlocked(modifier: playerModifiers.IPlayerModifier): boolean;
    public setInitialAvailableModifiers(): void;
    public checkLockedModifiers(conditionType: string, timeout?: number): void;
    public unlockModifier(modifier: playerModifiers.IPlayerModifier): void;
    public updateDynamicModifiers(conditionType: string): void;
    public addClicks(amount: number): void;
    public unlockLevelUpModifiers(level: any): void;
    public addLevelUpModifier(modifier: any, preventMultiplePerLevel?: boolean, firstTime?: boolean): boolean;
    public addToRollingIncome(amount: any, date: any): void;
}
