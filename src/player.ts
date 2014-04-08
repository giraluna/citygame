/// <reference path="js/employee.d.ts" />

class Player
{
  id: string;
  money: number = 0;

  ownedContent: any = {};
  ownedCells: any = {};

  employees: any = [];
  modifiers: any = {};

  moneySpan: HTMLElement;
  incomeSpan: HTMLElement;

  constructor(id: number)
  {
    this.id = "player" + id;
    this.bindElements();

    // TODO
    for (var i = 0; i < 5; i++)
    {
      this.addEmployee(new Employee(i, TEMPNAMES, {skillLevel: 1, growthLevel: 1}));
    }
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

  addEmployee(employee: Employee)
  {
    this.employees.push(employee);
  }
  getActiveEmployees()
  {
    var activeEmployees = this.employees.filter( function(employee)
    {
      return employee.active !== false;
    });

    return activeEmployees;
  }
  buyCell( cell )
  {
    
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

