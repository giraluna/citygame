/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="../../data/js/cg.d.ts" />
declare class Player {
    public id: string;
    public color: number;
    public money: number;
    public eventListener: any;
    public ownedContent: any;
    public ownedCells: any;
    public employees: any;
    public usedInitialRecruit: boolean;
    public modifiers: any;
    public moneySpan: HTMLElement;
    public incomeSpan: HTMLElement;
    constructor(id: number, color?: number);
    public bindElements(): void;
    public updateElements(): void;
    public init(): void;
    public addEventListeners(): void;
    public addEmployee(employee: Employee): void;
    public getEmployees(): any[];
    public getActiveEmployees(): any[];
    public addCell(cell: any): void;
    public removeCell(cell: any): void;
    public addContent(content: any): void;
    public removeContent(content: any): void;
    public addMoney(amount: any): void;
}
