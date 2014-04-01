declare class Player {
    public id: string;
    public money: number;
    public income: number;
    public moneySpan: HTMLElement;
    public incomeSpan: HTMLElement;
    constructor();
    public bindElements(): void;
    public updateElements(): void;
    public addMoney(amount: any): void;
    public setIncome(amount: any): void;
}
