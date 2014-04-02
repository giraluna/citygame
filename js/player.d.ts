declare class Player {
    public id: string;
    public money: number;
    public ownedContent: any;
    public ownedCells: any;
    public employees: any;
    public modifiers: any;
    public moneySpan: HTMLElement;
    public incomeSpan: HTMLElement;
    constructor(id: number);
    public bindElements(): void;
    public updateElements(): void;
    public addCell(cell: any): void;
    public removeCell(cell: any): void;
    public addContent(type: any, content: any): void;
    public addMoney(amount: any): void;
}
