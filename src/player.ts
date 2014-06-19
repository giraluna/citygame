/// <reference path="../lib/pixi.d.ts" />

/// <reference path="js/employee.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/utility.d.ts" />

class Player
{
  id: string;
  color: number;
  money: number = 0;
  level: number = 1;
  experience: number = 0;
  experienceForCurrentLevel: number = 0;
  experienceToNextLevel: number = 0;
  eventListener: any;

  ownedContent: any = {};
  amountBuiltPerType: any = {};
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

  constructor(id: string, experience?: number, color: number=0xFF0000)
  {
    this.id = id;
    this.color = color;
    this.init();
    if (experience) this.addExperience(experience);
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
    var beautified = beautify(this.money) + "$";
    this.moneySpan.innerHTML = beautified;
    eventManager.dispatchEvent({type: "updatePlayerMoney", content: beautified});
    eventManager.dispatchEvent(
      {
        type: "updatePlayerExp",
        content:
        {
          experience: beautify(this.experience),
          nextLevel: beautify(this.experienceToNextLevel),
          level: this.level,
          percentage: this.getExperiencePercentage()
        }
      }
    );
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
      if (this.amountBuiltPerType[type] === undefined)
      {
        this.amountBuiltPerType[type] = 0;
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
        addedCost: 0,
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
      addedCost: 0,
      multiplier: 1
    };

    this.setExperienceToNextLevel();
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
      if (cell.overlay) cell.removeOverlay();

      delete this.ownedCells[cell.gridPos];
      cell.player = null;
    }
  }
  sellCell( cell )
  {
    var value = this.getCellBuyCost(cell.landValue) * 0.66;

    this.addMoney(value, "soldCell");
    this.removeCell(cell);
  }
  addContent( content )
  {
    var type = content.categoryType;
    // for trees etc.
    if (!this.ownedContent[type]) return;
    
    this.ownedContent[type].push(content);
    this.amountBuiltPerType[type]++;
    content.player = this;
  }
  removeContent( content )
  {
    var type = content.categoryType;
    this.ownedContent[type] = this.ownedContent[type].filter(function(building)
    {
      return building.id !== content.id;
    });

    this.amountBuiltPerType[type]--;
  }
  sellContent( content )
  {
    var type = content.type;
    var value = this.getBuildCost(type) * 0.66;

    this.addMoney(value, "soldContent");
    this.removeContent(content);
  }
  addMoney(initialAmount, incomeType?: string, date?)
  {
    var amount = initialAmount;
    if (amount > 0)
    {
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

      if (amount < 0) amount = 0;

      this.addExperience(amount);
    }


    if (incomeType)
    {
      if (!this.incomePerType[incomeType])
      {
        this.incomePerType[incomeType] = 0;
      }
      
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
  getBuildCost(type)
  {
    var cost = type.cost;
    var alreadyBuilt = this.amountBuiltPerType[type.categoryType];

    cost *= Math.pow(1.1, alreadyBuilt);

    cost += this.modifierEffects.buildCost[type.categoryType].addedCost;
    cost += this.modifierEffects.buildCost["global"].addedCost;

    cost *= this.modifierEffects.buildCost[type.categoryType].multiplier;
    cost *= this.modifierEffects.buildCost["global"].multiplier;

    return Math.round(cost);
  }
  getCellBuyCost(baseCost)
  {
    return baseCost * Math.pow(1.1, Object.keys(this.ownedCells).length);
  }
  addExperience(amount)
  {
    this.experience += amount;

    if (this.experience >= this.experienceToNextLevel)
    {
      this.levelUp();
    }
  }
  levelUp()
  {
    this.level++;
    this.setExperienceToNextLevel();

    if (this.experience >= this.experienceToNextLevel)
    {
      this.levelUp();
    }
  }
  getExperienceForLevel(level)
  {
    if (level <= 0) return 0;
    else
    {
      return Math.round( 100 * Math.pow(1.1, level-1) );
    }
  }
  setExperienceToNextLevel()
  {
    this.experienceForCurrentLevel = this.experienceToNextLevel;
    this.experienceToNextLevel += this.getExperienceForLevel(this.level);
  }
  getExperiencePercentage()
  {
    var current = this.experience - this.experienceForCurrentLevel;

    return Math.floor( 100 * ( current / this.getExperienceForLevel(this.level) ) );
  }
}

