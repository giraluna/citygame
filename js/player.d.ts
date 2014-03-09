declare class Player {
    public money: number;
    public income: number;
    public moneySpan: HTMLElement;
    public incomeSpan: HTMLElement;
    constructor();
    public bindElements(): void;
    public updateElements(): void;
    public addMoney(amount: any): void;
    public addIncome(amount: any): void;
}
