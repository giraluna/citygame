/// <reference path="../lib/pixi.d.ts" />

/// <reference path="js/employee.d.ts" />
/// <reference path="../data/js/cg.d.ts" />

class Player
{
  id: string;
  color: number;
  money: number = 0;
  eventListener: any;

  ownedContent: any = {};
  ownedCells: any = {};

  employees: any = {};
  usedInitialRecruit: boolean = false;
  modifiers: any = {};

  moneySpan: HTMLElement;
  incomeSpan: HTMLElement;

  constructor(id: number, color: number=0xFF0000)
  {
    this.id = "player" + id;
    this.color = color;
    this.bindElements();
    this.init();
  }
  bindElements()
  {
    this.moneySpan = document.getElementById("money");
    this.incomeSpan = document.getElementById("income");
    this.updateElements();
  }
  updateElements()
  {
    this.moneySpan.innerHTML = Math.round(this.money) + "$";
    //this.incomeSpan.innerHTML = "+" + this.income + "/s";
  }
  init()
  {
    for (var building in cg.content.buildings)
    {
      var type = cg.content.buildings[building].categoryType;
      if (!this.ownedContent[type])
      {
        this.ownedContent[type] = [];
      }
    }
  }
  addEventListeners()
  {
    
  }

  addEmployee(employee: Employee)
  {
    this.employees[employee.id] = employee;
  }
  getEmployees()
  {
    var employees = [];
    for (var employee in this.employees)
    {
     employees.push(this.employees[employee]);
    };

    return employees;
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
  
  addCell( cell )
  {
    if (!this.ownedCells[cell.gridPos])
    {
      this.ownedCells[cell.gridPos] = cell;

      cell.player = this;
      cell.addOverlay(this.color);
    }
  }
  removeCell( cell )
  {
    if (this.ownedCells[cell.gridPos])
    {
      delete this.ownedCells[cell.gridPos];
    }
  }
  addContent( content )
  {
    var type = content.categoryType;
    if (!this.ownedContent[type]) return;
    
    this.ownedContent[type].push(content);
    content.player = this;
  }
  removeContent( content )
  {
    var type = content.categoryType;
    this.ownedContent[type] = this.ownedContent[type].filter(function(building)
    {
      return building.id !== content.id;
    });
  }
  addMoney(amount)
  {
    this.money += amount;
    this.updateElements();
  }
}

