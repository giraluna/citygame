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

  incomePerDate: any = {};
  incomePerType: any = {};

  modifiers: any = {};
  modifierEffects: any =
  {
    profit: {},
    buildCost: {},
    recruitQuality: 1
  };


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
      if (this.incomePerType[type] === undefined)
      {
        this.incomePerType[type] = 0;
      }
      
      this.modifierEffects.profit[type] =
      {
        addedProfit: 0,
        multiplier: 1
      };
      this.modifierEffects.buildCost[type] =
      {
        addedProfit: 0,
        multiplier: 1
      };
    }
    this.modifierEffects.profit["global"] =
    {
      addedProfit: 0,
      multiplier: 1
    };
    this.modifierEffects.buildCost["global"] =
    {
      addedProfit: 0,
      multiplier: 1
    };
  }
  addEventListeners()
  {
    
  }

  addEmployee(employee: Employee)
  {
    this.employees[employee.id] = employee;
    employee.player = this;
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
    // for trees etc.
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
  addMoney(initialAmount, incomeType?: string, date?)
  {
    var amount = initialAmount;
    amount += this.modifierEffects.profit["global"].addedProfit;

    if (incomeType)
    {
      if (this.modifierEffects.profit[incomeType])
      {
        amount += this.modifierEffects.profit[incomeType].addedProfit;
        amount *= this.modifierEffects.profit[incomeType].multiplier;
      }
    }
    amount *= this.modifierEffects.profit["global"].multiplier;


    if (incomeType)
    {
      this.incomePerType[incomeType] += amount;
    }
    if (date)
    {
      this.incomePerDate[date.year] = this.incomePerDate[date.year] || {total: 0};
      var _y = this.incomePerDate[date.year];
      _y.total += amount;

      _y[date.month] = _y[date.month] || {total: 0};
      var _m = _y[date.month];
      _m.total += amount;

      _m[date.day] ? _m[date.day] += amount : _m[date.day] = amount;
    }

    this.money += amount;
    this.updateElements();
  }
  addModifier(modifier)
  {
    if (this.modifiers[modifier.type]) return;
    else
    {
      this.modifiers[modifier.type] = Object.create(modifier);

      this.applyModifier(modifier);
    }
  }
  applyModifier(modifier)
  {
    console.log(modifier.type, modifier);
    for (var ii = 0; ii < modifier.effects.length; ii++)
    {
      var effect = modifier.effects[ii];

      for (var jj = 0; jj < effect.targets.length; jj++)
      {
        var type = effect.targets[jj];

        if (effect.addedProfit)
        {
          this.modifierEffects.profit[type].addedProfit +=
            effect.addedProfit;
        }
        if (effect.multiplier)
        {
          this.modifierEffects.profit[type].multiplier *=
            effect.multiplier;
        }
      }
    }
  }
  applyAllModifiers()
  {
    for (var _modifier in this.modifiers)
    {
      this.applyModifier( this.modifiers[_modifier] );
    };
  }
  removeModifier(modifier)
  {
    if (!this.modifiers[modifier.type])
    {
      console.warn("Modifier ", modifier, " does not exist on player ", this);
      return;
    }

    for (var ii = 0; ii < modifier.effects.length; ii++)
    {
      var effect = modifier.effects[ii];

      for (var jj = 0; jj < effect.targets.length; jj++)
      {
        var type = effect.targets[jj];

        if (effect.addedProfit)
        {
          this.modifierEffects.profit[type].addedProfit -=
            effect.addedProfit;
        }
        if (effect.multiplier)
        {
          this.modifierEffects.profit[type].multiplier *=
            (1 / effect.multiplier);
        }
      }
    }

    this.modifiers[modifier.type] = null;
    delete this.modifiers[modifier.type];
  }
}

