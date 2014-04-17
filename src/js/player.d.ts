/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="employee.d.ts" />
declare class Player {
    public id: string;
    public money: number;
    public eventListener: any;
    public ownedContent: any;
    public ownedCells: any;
    public employees: any;
    public usedInitialRecruit: boolean;
    public modifiers: any;
    public moneySpan: HTMLElement;
    public incomeSpan: HTMLElement;
    constructor(id: number);
    public bindElements(): void;
    public updateElements(): void;
    public addEventListeners(): void;
    public addEmployee(employee: Employee): void;
    public getEmployees(): any[];
    public getActiveEmployees(): any[];
    public addCell(cell: any): void;
    public removeCell(cell: any): void;
    public addContent(type: any, content: any): void;
    public addMoney(amount: any): void;
}
