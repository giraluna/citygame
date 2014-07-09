/// <reference path="../lib/pixi.d.ts" />

/// <reference path="js/employee.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
/// <reference path="../data/js/playermodifiers.d.ts" />
/// <reference path="../data/js/levelupmodifiers.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/utility.d.ts" />

class Player
{
  id: string;
  color: number;
  money: number = 0;
  clicks: number = 0;
  level: number = 1;
  experience: number = 0;
  experienceForCurrentLevel: number = 0;
  experienceToNextLevel: number = 0;

  timesReset: number = 0;
  prestige: number = 0;
  totalResetExperience: number = 0;
  permanentLevelupUpgrades: string[] = [];

  ownedContent: any = {};
  amountBuiltPerType: any = {};
  amountBuiltPerCategory: any = {};
  ownedCells: any = {};
  ownedCellsAmount: number = 0;

  employees: any = {};
  usedInitialRecruit: boolean = false;

  incomePerDate: any = {};
  incomePerType: any = {};

  rollingIncome: number[] = [0, 0, 0];
  lastRollingIncomeDay: number;

  modifiers: any = {};
  dynamicModifiers: any = {};
  timedModifiers: any = {};
  levelUpModifiers: any = {};
  specialModifiers: any = {};
  defaultModifiers: any = {};
  employeeModifiers: any = {};

  modifierEffects: any =
  {
    profit: {},
    buildCost: {},
    buyCost: {},
    recruitQuality: 1,
    sellPrice: 0.5
  };

  unlockedModifiers = [];
  lockedModifiers = [];
  unlockedLevelUpModifiers:
  {
    [level:number]: playerModifiers.IPlayerModifier[];
  } = {};
  levelUpModifiersPerLevelUp: number = 4;
  levelsAlreadyPicked: any = {};

  recentlyCheckedUnlockConditions: any = {};

  indexedProfits: any = {};
  indexedProfitsWithoutGlobals: any = {};

  moneySpan: HTMLElement;
  incomeSpan: HTMLElement;

  constructor(id: string, color: number=0xFF0000)
  {
    this.id = id;
    this.color = color;
    this.init();
    this.updateElements();
  }
  updateElements()
  {
    var moneyBeautifyIndex = this.money > 999999 ? 3 : 0;
    var beautified = "$" + beautify(this.money, moneyBeautifyIndex);
    var expBeautifyIndex = this.experienceToNextLevel > 999999 ? 2 : 0;

    /*
    var rolling = this.rollingIncome.reduce(function(a,b)
    {
      return a+b;
    }) / 3;
    */
    var rolling = this.rollingIncome[2];

    var money =
    {
      total: beautified,
      rolling: rolling.toFixed(1)
    }

    eventManager.dispatchEvent({type: "updatePlayerMoney", content: money});
    eventManager.dispatchEvent(
      {
        type: "updatePlayerExp",
        content:
        {
          experience: beautify(this.experience, expBeautifyIndex),
          nextLevel: beautify(this.experienceToNextLevel, expBeautifyIndex),
          level: this.level,
          percentage: this.getExperiencePercentage()
        }
      }
    );
  }
  init()
  {
    for (var building in cg.content.buildings)
    {
      var type = cg.content.buildings[building];

      if (!this.ownedContent[type.categoryType])
      {
        this.ownedContent[type.categoryType] = [];
      }
      if (this.amountBuiltPerType[type.type] === undefined)
      {
        this.amountBuiltPerType[type.type] = 0;
      }
      if (this.amountBuiltPerCategory[type.categoryType] === undefined)
      {
        this.amountBuiltPerCategory[type.categoryType] = 0;
      }
      if (this.incomePerType[type.categoryType] === undefined)
      {
        this.incomePerType[type.categoryType] = 0;
      }
      
      this.modifierEffects.profit[type.categoryType] =
      {
        addedProfit: 0,
        multiplier: 1
      };
      this.modifierEffects.buildCost[type.categoryType] =
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
    this.modifierEffects.buyCost["global"] =
    {
      addedCost: 0,
      multiplier: 1
    };
    this.modifierEffects.profit["click"] =
    {
      addedProfit: 1,
      multiplier: 1
    };

    this.setExperienceToNextLevel();
    this.setInitialAvailableModifiers();


    this.addModifier(playerModifiers.prestigeDefault, "defaultModifiers");
  }

  addEmployee(employee: Employee)
  {
    this.employees[employee.id] = employee;
    employee.player = this;
    if (employee.trait)
    {
      this.addEmployeeModifier(employee.trait);
    }
  }
  removeEmployee(employee: Employee)
  {
    if (employee.trait)
    {
      this.removeModifier(employee.trait, "employeeModifiers");
      for (var _id in this.employees)
      {
        var _employee = this.employees[_id];

        if (_employee.trait && _employee.trait.type === employee.trait.type)
        {
          this.addEmployeeModifier(_employee.trait);
        }
      }
    }
    this.employees[employee.id] = null;
    delete this.employees[employee.id];
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

      this.ownedCellsAmount++;
    }
  }
  removeCell( cell )
  {
    if (this.ownedCells[cell.gridPos])
    {
      if (cell.overlay) cell.removeOverlay();

      delete this.ownedCells[cell.gridPos];
      cell.player = null;
      this.ownedCellsAmount--;
    }
  }
  sellCell( cell )
  {
    var value = this.getCellBuyCost(cell) * this.modifierEffects.sellPrice;

    this.addMoney(value, "sell");
    this.removeCell(cell);
  }
  addContent( content )
  {
    // for trees etc.
    if (!this.ownedContent[content.categoryType]) return;
    
    this.ownedContent[content.categoryType].push(content);
    this.amountBuiltPerType[content.type.type]++;
    this.amountBuiltPerCategory[content.type.categoryType]++;

    this.checkLockedModifiers(content.type.type, -1);
    this.checkLockedModifiers(content.type.categoryType, -1);
    content.player = this;
    this.updateDynamicModifiers(content.type.type);
    this.updateDynamicModifiers(content.type.categoryType);
  }
  removeContent( content )
  {
    this.ownedContent[content.categoryType] =
      this.ownedContent[content.categoryType].filter(function(building)
    {
      return building.id !== content.id;
    });

    this.amountBuiltPerType[content.type.type]--;
    this.amountBuiltPerCategory[content.type.categoryType]--;

    this.updateDynamicModifiers(content.type.type);
    this.updateDynamicModifiers(content.type.categoryType);
  }
  sellContent( content )
  {
    var type = content.type;
    if (!type.cost) return;
    if (!content.player || content.player.id !== this.id) return;

    var value = this.getBuildCost(type) * this.modifierEffects.sellPrice;

    this.addMoney(value, "sell");
  }
  addMoney(initialAmount, incomeType?: string, baseMultiplier?: number, date?)
  {
    var amount = initialAmount;

    if (incomeType && ["sell", "initial"].indexOf(incomeType) < 0)
    {
      amount = this.getIndexedProfit(incomeType, initialAmount, baseMultiplier);
    }

    if (amount > 0 && incomeType !== "sell" && incomeType !== "initial")
    {
      
      
      this.addExperience(amount);
    }


    if (incomeType)
    {
      if (this.incomePerType[incomeType] === undefined)
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
      this.addToRollingIncome(amount, date);
    }

    if (!isFinite(amount)) throw new Error("Infinite amount of money added");
    this.money += amount;
    this.checkLockedModifiers("money");
    this.updateElements();

    return amount;
  }
  subtractCost(amount: number)
  {
    if (!isFinite(amount)) throw new Error("Infinite amount of money subtracted");
    this.money -= amount;
    this.checkLockedModifiers("money");
    this.updateElements();

    return amount;
  }
  addModifier(modifier, collection:string="modifiers", firstTime:boolean = true)
  {
    if (this[collection][modifier.type]) return;
    if (firstTime)
    {
      if (modifier.cost && modifier.cost > this.money) return;

      if (modifier.cost)
      {
        this.subtractCost(modifier.cost);
      }
    }

    var index = this.unlockedModifiers.indexOf(modifier);
    {
      if (index > -1)
      {
        this.unlockedModifiers.splice(index, 1);
      }
    }
    this[collection][modifier.type] = Object.create(modifier);


    if (modifier.effects)
    {
      this.applyModifier(modifier);
    }
    if (modifier.onAdd)
    {
      if (!modifier.onAdd.oneTime || firstTime === true)
      {
        modifier.onAdd.effect.call(null, this);
      }
    }
    if (modifier.dynamicEffect)
    {
      this.addDynamicModifier(modifier);
    }
  }
  addSpecialModifier(modifier)
  {
    if (this.specialModifiers[modifier.type])
    {
      this.removeModifier(this.specialModifiers[modifier.type], "specialModifiers");
    }
    this.addModifier(modifier, "specialModifiers");
  }
  addTimedModifier(modifier)
  {
    if (!modifier.lifeTime)
    {
      throw new Error("Timed modifier" + modifier.type + "has no life time set");
    }
    if (this.timedModifiers[modifier.type])
    {
      window.clearTimeout(this.timedModifiers[modifier.type]);
    }

    var removeTimedModifierFN = function()
    {
      this.removeModifier(this.specialModifiers[modifier.type], "specialModifiers");
      window.clearTimeout(this.timedModifiers[modifier.type]);
    }.bind(this);

    this.timedModifiers[modifier.type] = window.setTimeout(removeTimedModifierFN,
      modifier.lifeTime);

    this.addSpecialModifier(modifier);
  }
  addDynamicModifier(sourceModifier)
  {
    for (var condition in sourceModifier.dynamicEffect)
    {
      var modifier = sourceModifier.dynamicEffect[condition];

      if (!this.dynamicModifiers[condition])
      {
        this.dynamicModifiers[condition] = {};
      }

      this.dynamicModifiers[condition][sourceModifier.type] = modifier;

      this.updateDynamicModifiers(condition);
    }
  }
  addEmployeeModifier(modifier)
  {
    this.addModifier(modifier, "employeeModifiers");
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
        if (effect.buildCost)
        {
          if (effect.buildCost.addedProfit)
          {
            this.modifierEffects.buildCost[type].addedCost +=
              effect.buildCost.addedCost;
          }
          if (effect.buildCost.multiplier)
          {
            this.modifierEffects.buildCost[type].multiplier *=
              effect.buildCost.multiplier;
          }
        }
        if (effect.buyCost)
        {
          if (effect.buyCost.addedProfit)
          {
            this.modifierEffects.buyCost.addedCost +=
              effect.buyCost.addedCost;
          }
          if (effect.buyCost.multiplier)
          {
            this.modifierEffects.buyCost.multiplier *=
              effect.buyCost.multiplier;
          }
        }
        this.clearIndexedProfits();
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
  removeModifier(modifier, collection:string="modifiers")
  {
    if (!this[collection][modifier.type])
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
        if (effect.buildCost)
        {
          if (effect.buildCost.addedProfit)
          {
            this.modifierEffects.buildCost[type].addedCost -=
              effect.buildCost.addedCost;
          }
          if (effect.buildCost.multiplier)
          {
            this.modifierEffects.buildCost[type].multiplier *=
              (1 / effect.buildCost.multiplier);
          }
        }
        if (effect.buycost)
        {
          if (effect.buycost.addedProfit)
          {
            this.modifierEffects.buyCost.addedCost -=
              effect.buycost.addedCost;
          }
          if (effect.buycost.multiplier)
          {
            this.modifierEffects.buyCost.multiplier *=
              (1 / effect.buycost.multiplier);
          }
        }
        this.clearIndexedProfits();
      }
    }

    this[collection][modifier.type] = null;
    delete this.modifiers[modifier.type];
  }
  getBuildCost(type)
  {
    var cost = type.cost;
    var alreadyBuilt = this.amountBuiltPerType[type.type];

    var baseCost = cost * Math.pow(1.4, alreadyBuilt);

    cost += this.modifierEffects.buildCost[type.categoryType].addedCost;
    cost += this.modifierEffects.buildCost["global"].addedCost;

    cost *= this.modifierEffects.buildCost[type.categoryType].multiplier;
    cost *= this.modifierEffects.buildCost["global"].multiplier;

    cost *= Math.pow(1.4, alreadyBuilt);

    if (cost < baseCost * 0.2)
    {
      cost = baseCost * 0.2;
    }


    return Math.round(cost);
  }
  getCellBuyCost(cell)
  {
    var adjusted = cell.landValue * Math.pow(1.1, this.ownedCellsAmount);

    adjusted += this.modifierEffects.buyCost["global"].addedCost;
    adjusted *= this.modifierEffects.buyCost["global"].multiplier;

    return adjusted;
  }
  addExperience(amount)
  {
    this.experience += amount;

    if (this.experience >= this.experienceToNextLevel)
    {
      this.levelUp();
    }
  }
  levelUp(callSize: number = 0)
  {
    this.level++;
    this.setExperienceToNextLevel();
    this.unlockLevelUpModifiers(this.level);
    this.updateDynamicModifiers("level");

    if (this.experience >= this.experienceToNextLevel)
    {
      if (callSize > 101)
      {
        throw new Error();
        return;
      }
      this.levelUp(callSize++);
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
  getModifiedProfit(initialAmount: number, type?: string, baseMultiplier?: number,
    includeGlobal:boolean=true)
  {
    var amount = initialAmount;
    var baseMultiplier = baseMultiplier || 1;

    if (includeGlobal)
    {
      amount += this.modifierEffects.profit["global"].addedProfit * baseMultiplier;
    }

    if (type)
    {
      if (this.modifierEffects.profit[type])
      {
        amount += this.modifierEffects.profit[type].addedProfit * baseMultiplier;
        if (amount > 0)
        {
          amount *= this.modifierEffects.profit[type].multiplier;
        }
      }
    }
    if (includeGlobal && amount > 0)
    {
      amount *= this.modifierEffects.profit["global"].multiplier;
    }

    if (initialAmount > 0 && amount < 0) amount = 0;

    return amount;
  }
  getIndexedProfit(type, amount, baseMultiplier)
  {
    if (!this.indexedProfits[type]) this.indexedProfits[type] = {};

    if (!this.indexedProfits[type][amount])
    {
      this.indexedProfits[type][amount] = this.getModifiedProfit(amount, type, baseMultiplier);
    }

    return this.indexedProfits[type][amount];
  }
  getIndexedProfitWithoutGlobals(type, amount)
  {
    if (!this.indexedProfitsWithoutGlobals[type]) this.indexedProfitsWithoutGlobals[type] = {};

    if (!this.indexedProfitsWithoutGlobals[type][amount])
    {
      this.indexedProfitsWithoutGlobals[type][amount] =
        this.getModifiedProfit(amount, type, 1, false);
    }

    return this.indexedProfitsWithoutGlobals[type][amount];
  }
  clearIndexedProfits()
  {
    this.indexedProfits = {};
    this.indexedProfitsWithoutGlobals = {};
  }
  getUnlockConditionVariable(conditionType: string)
  {
    if (["clicks", "money", "level", "prestige"].indexOf(conditionType) !== -1)
    {
      return this[conditionType];
    }
    else if (this.amountBuiltPerType[conditionType] !== undefined)
    {
      return this.amountBuiltPerType[conditionType];
    }
    else if (this.amountBuiltPerCategory[conditionType] !== undefined)
    {
      return this.amountBuiltPerCategory[conditionType];
    }
  }
  checkIfUnlocked(modifier: playerModifiers.IPlayerModifier)
  {
    if (!modifier.unlockConditions) return false;

    var unlocked = true;

    for (var i = 0; i < modifier.unlockConditions.length; i++)
    {
      var condition = modifier.unlockConditions[i];

      var toCheckAgainst = this.getUnlockConditionVariable(condition.type);

      if (toCheckAgainst < condition.value) unlocked = false;
    }
    return unlocked;
  }
  setInitialAvailableModifiers()
  {
    var allModifiers = playerModifiers.allModifiers;
    this.lockedModifiers = allModifiers.slice(0);
    this.unlockedModifiers = [];

    for (var i = 0; i < this.lockedModifiers.length; i++)
    {
      var mod = this.lockedModifiers[i];

      if (this.checkIfUnlocked(mod))
      {
        this.unlockModifier(mod);
      }
    }
  }
  checkLockedModifiers(conditionType: string,
    timeout: number = 1000)
  {
    var unlocks = playerModifiers.modifiersByUnlock[conditionType];
    if (!unlocks) return;

    if (this.recentlyCheckedUnlockConditions[conditionType])
    {
      return;
    }
    else if (timeout > 0)
    {
      this.recentlyCheckedUnlockConditions[conditionType] = true;
      window.setTimeout(function()
      {
        this.recentlyCheckedUnlockConditions[conditionType] = false;
      }.bind(this), timeout);
    }

    var unlockValues = Object.keys(unlocks);


    for (var i = 0; i < unlockValues.length; i++)
    {
      var toCheckAgainst = this.getUnlockConditionVariable(conditionType);

      if (toCheckAgainst >= parseInt(unlockValues[i]))
      {
        var modifiers = unlocks[unlockValues[i]];
        for (var j = 0; j < modifiers.length; j++)
        {
          if (this.modifiers[modifiers[j].type]) continue;
          else if (this.unlockedModifiers.indexOf(modifiers[j]) > -1) continue;

          var unlocked = this.checkIfUnlocked(modifiers[j]);

          if (unlocked)
          {
            this.unlockModifier(modifiers[j]);
          }
        }
      }
    }
  }
  unlockModifier(modifier: playerModifiers.IPlayerModifier)
  {
    if (!this.modifiers[modifier.type] && this.unlockedModifiers.indexOf(modifier) <= -1)
    {
      this.unlockedModifiers.push(modifier);
    }

    var index = this.lockedModifiers.indexOf(modifier);
    if (index > -1) this.lockedModifiers.splice(index, 1);
  }
  updateDynamicModifiers(conditionType: string)
  {
    for (var _mod in this.dynamicModifiers[conditionType])
    {
      var dynamicEffect = this.dynamicModifiers[conditionType][_mod];
      dynamicEffect.call(null, this);
    }
  }
  addClicks(amount: number)
  {
    this.clicks += amount;
    this.checkLockedModifiers("clicks");
  }
  unlockLevelUpModifiers(level)
  {
    var self = this;
    if (!levelUpModifiers.modifiersByUnlock.level[level]) return;

    var modifiersForThisLevel = levelUpModifiers.modifiersByUnlock.level[level].slice(0);

    if (this.levelsAlreadyPicked[level]) return;

    
    modifiersForThisLevel = modifiersForThisLevel.filter(function(mod)
    {
      if (self.levelUpModifiers[mod.type]) return false;
      else return (self.checkIfUnlocked(mod));
    });

    var toUnlock = [];

    if (modifiersForThisLevel.length <= this.levelUpModifiersPerLevelUp)
    {
      for (var _mod in modifiersForThisLevel)
      {
        toUnlock.push(modifiersForThisLevel[_mod]);
      }
    }
    else
    {
      for (var i = 0; i < this.levelUpModifiersPerLevelUp; i++)
      {
        if (modifiersForThisLevel.length < 1) break;

        var indexToAdd = randInt(0, modifiersForThisLevel.length -1);
        var toAdd = modifiersForThisLevel.splice(indexToAdd, 1);

        toUnlock.push(toAdd[0]);
      }
    }

    if (toUnlock.length < 1)
    {
      this.unlockedLevelUpModifiers[level] = null;
      delete this.unlockedLevelUpModifiers[level];

      return;
    }


    this.unlockedLevelUpModifiers[level] = toUnlock;
  }
  addLevelUpModifier(modifier, preventMultiplePerLevel:boolean = true,
    firstTime:boolean = true)
  {
    var level = modifier.unlockConditions[0].value;

    if (preventMultiplePerLevel && this.levelsAlreadyPicked[level]) return false;

    this.addModifier(modifier, "levelUpModifiers", firstTime);

    if (preventMultiplePerLevel)
    {
      this.unlockedLevelUpModifiers[level] = null;
      delete this.unlockedLevelUpModifiers[level];
  
      this.levelsAlreadyPicked[level] = true;
    }
  }
  applyPermedModifiers(firstTime: boolean = true)
  {
    for (var i = 0; i < this.permanentLevelupUpgrades.length; i++)
    {
      var modType = this.permanentLevelupUpgrades[i];

      var modifier = levelUpModifiers[modType];

      this.addLevelUpModifier(modifier, false, firstTime);
    }
  }
  getPrestige(exp: number)
  {
    return Math.pow(exp / 1000000, 0.75);
  }
  applyPrestige()
  {
    this.prestige = this.getPrestige(this.totalResetExperience);

    this.updateDynamicModifiers("prestige");
  }
  addToRollingIncome(amount, date)
  {

    if (date.day !== this.lastRollingIncomeDay)
    {
      this.lastRollingIncomeDay = date.day;
      this.rollingIncome = this.rollingIncome.slice(1,3);
      this.rollingIncome.push(0);
    }
    this.rollingIncome[this.rollingIncome.length-1] += amount;
  }
}

