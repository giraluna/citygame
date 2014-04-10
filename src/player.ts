/// <reference path="js/employee.d.ts" />

class Player
{
  id: string;
  money: number = 0;
  eventListener: any;

  ownedContent: any = {};
  ownedCells: any = {};

  employees: any = {};
  modifiers: any = {};

  moneySpan: HTMLElement;
  incomeSpan: HTMLElement;

  constructor(id: number)
  {
    this.id = "player" + id;
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
    //this.incomeSpan.innerHTML = "+" + this.income + "/s";
  }
  addEventListeners(listener)
  {
    this.eventListener = listener;
  }

  addEmployee(employee: Employee)
  {
    this.employees[employee.id] = employee;
  }
  getActiveEmployees()
  {
    var active = [];
    for (var employee in this.employees)
    {
      if (employee.active !== false) active.push(this.employees[employee]);
    };

    return active;
  }
  buyCell( cell, employee: Employee )
  {
    this.addCell(cell);
    employee.active = false;
    cell.sprite.tint = 0xFF0000;
    this.eventListener.dispatchEvent({type: "updateWorld", content:""});
  }
  getActionTime( skill, baseDuration )
  {
    var workRate = 3 / Math.log(skill + 1);
    
    var approximate = Math.round(baseDuration * workRate);
    var actual = Math.round(approximate + randRange(-2, 2));

    return(
    {
      approximate: approximate,
      actual: actual < 1 ? 1 : actual
    });
  }

  addCell( cell )
  {
    if (!this.ownedCells[cell.gridPos])
    {
      this.ownedCells[cell.gridPos] = cell;
    }
  }
  removeCell( cell )
  {
    if (this.ownedCells[cell.gridPos])
    {
      delete this.ownedCells[cell.gridPos];
    }
  }
  addContent( type, content )
  {
    if (!this.ownedContent[type])
    {
      this.ownedContent[type] = {};
    }
    this.ownedContent[type][content.id] = content;
  }
  addMoney(amount)
  {
    this.money += amount;
    this.updateElements();
  }
}

