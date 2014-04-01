class Player
{
  id: string = "player1";
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
    this.incomeSpan.innerHTML = "+" + this.income + "/s";
  }
  addMoney(amount)
  {
    this.money += amount;
    this.updateElements();
  }
  setIncome(amount)
  {
    this.income = amount;
    this.updateElements();
  }
}

