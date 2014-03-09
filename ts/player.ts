class Player
{
  money: number = 0;
  income: number = 0;
  moneySpan: HTMLElement;
  incomeSpan: HTMLElement;

  constructor()
  {
    this.bindElements();
  }

  bindElements()
  {
    this.moneySpan = document.getElementById("money");
    this.incomeSpan = document.getElementById("income");
    this.updateElements();
  }
  updateElements()
  {
    this.moneySpan.innerHTML = this.money + "$";
    this.incomeSpan.innerHTML = "+" + this.income + "/tick";
  }
  addMoney(amount)
  {
    this.money += amount;
    this.updateElements();
  }
  addIncome(amount)
  {
    this.income += amount;
    this.updateElements();
  }
}