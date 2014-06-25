/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/utility.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spriteblinker.d.ts" />
/// 
/// <reference path="../data/js/cg.d.ts" />

module actions
{
  var blinkerTODO = new Blinker(600, 0x880055, -1, false);

  export function buyCell(props:
  {
    gridPos: number[];
    boardId: string;
    playerId: string;
    employeeId: string;

    finishedOn?: number;
  })
  {
    // TODO circular reference
    var _: any = window;
    var game = _.game;

    var cell = game.getCell(props);
    var player = game.players[props.playerId]

    if (!cell || !player) throw new Error();

    var employee = player.employees[props.employeeId];
    var data: any = Object.create(props);

    if (data.finishedOn === undefined)
    {
      data.time = getActionTime([employee.skills["negotiation"]], 14).approximate;
    }

    var price = player.getCellBuyCost(cell);
    price = getActionCost([employee.skills["negotiation"]], price).actual

    var blinkerId = blinkerTODO.idGenerator++;


    var onStartFN = function()
    {
      player.ownedCellsAmount++;
      employee.active = false;
      employee.currAction = "buyCell";
      player.addMoney(-price);
    }
    var onCompleteFN = function()
    {
      player.ownedCellsAmount--;
      employee.active = true;
      employee.currAction = undefined;
      employee.trainSkill("negotiation");
      player.addCell(cell);

      blinkerTODO.removeCells(blinkerId);
      eventManager.dispatchEvent({type: "updateWorld", content: ""});
      return true;
    }

    var startBlinkFN = function()
    {
      blinkerTODO.addCells([cell], null, blinkerId);
      blinkerTODO.start();

      window.setTimeout(onCompleteFN, 2400);
    }

    onStartFN.call(null);

    eventManager.dispatchEvent(
    {
      type: "delayedAction",
      content:
      {
        type: "buyCell",
        data: data,
        onComplete: startBlinkFN
      }
    });
  };
  
  export function recruitEmployee(props:
  {
    playerId: string;
    employeeId: string;

    finishedOn?: number;
  })
  {
    // TODO circular reference
    var _: any = window;
    var game = _.game;

    var player = game.players[props.playerId]
    if (!player) throw new Error();
    var employee = player.employees[props.employeeId];

    var data: any = Object.create(props);
    if (data.finishedOn === undefined)
    {
      data.time = getActionTime([employee.skills["recruitment"]], 14).approximate;
    }

    var onStartFN = function()
    {
      employee.active = false;
      employee.currentAction = "recruit";
    }

    var employeeCount = getSkillAdjust(
      [employee.skills["recruitment"]],
      4,
      function employeeCountAdjustFN(avgSkill){return 1 / (1.5 / Math.log(avgSkill + 1))},
      0.33);

    if (!employee.player) throw new Error("No player on employee");
    var adjustedSkill = employee.skills["recruitment"] * employee.player.modifierEffects.recruitQuality;


    var recruitCompleteFN = function()
    {
      employee.active = true;
      employee.currentAction = undefined;

      var newEmployees = makeNewEmployees(employeeCount.actual, adjustedSkill);
      eventManager.dispatchEvent(
      {
        type: "makeRecruitCompletePopup",
        content:
        {
          player: player,
          employees: newEmployees,
          text: [employee.name + " was able to scout the following people.",
          "Which one should we recruit?"],
          recruitingEmployee: employee
        }
      })
    }

    onStartFN.call(null);

    eventManager.dispatchEvent(
    {
      type: "delayedAction",
      content:
      {
        type: "recruitEmployee",
        data: data,
        onComplete: recruitCompleteFN
      }
    });
  }

  export function constructBuilding(props:
  {
    gridPos: number[];
    boardId: string;
    buildingType: string;
    playerId: string;
    employeeId: string;

    finishedOn?: number;
  })
  {
    // TODO circular reference
    var _: any = window;
    var game = _.game;

    var cell = game.getCell(props);
    var player = game.players[props.playerId]

    if (!cell || !player) throw new Error();

    var employee = player.employees[props.employeeId];
    var buildingType = findType(props.buildingType);

    var data: any = Object.create(props);
    if (data.finishedOn === undefined)
    {
      data.time = getActionTime([employee.skills["construction"]], buildingType.buildTime).approximate;
    }

    var baseCost = player.getBuildCost(buildingType);
    var adjustedCost = getActionCost([employee.skills["construction"]], baseCost).actual;

    if (player.money < adjustedCost) return;

    var size = buildingType.size || [1,1];
    var endX = cell.gridPos[0] + size[0]-1;
    var endY = cell.gridPos[1] + size[1]-1;

    var buildArea = cell.board.getCells(rectSelect(cell.gridPos, [endX, endY]));


    var blinkerId = blinkerTODO.idGenerator++;


    var onStartFN = function()
    {
      for (var i = 0; i < buildArea.length; i++)
      {
        buildArea[i].changeContent(cg.content.underConstruction, true);
      }

      player.amountBuiltPerType[buildingType.type]++;
      player.addMoney(-adjustedCost, "buildingCost");
      employee.active = false;
      employee.currentAction = "constructBuilding";

      eventManager.dispatchEvent({type: "updateWorld", content: ""});
    }
    var constructBuildingCompleteFN = function()
    {
      player.amountBuiltPerType[buildingType.type]--;
      employee.active = true;
      employee.currentAction = undefined;
      employee.trainSkill("construction");
      cell.changeContent(buildingType, true, player);

      blinkerTODO.removeCells(blinkerId);
      eventManager.dispatchEvent({type: "updateWorld", content: ""});
      
      return true;
    }

    var startBlinkFN = function()
    {
      blinkerTODO.addCells(buildArea, null, blinkerId);
      blinkerTODO.start();

      window.setTimeout(constructBuildingCompleteFN, 2400);
    }

    onStartFN.call(null);

    eventManager.dispatchEvent(
    {
      type: "delayedAction",
      content:
      {
        type: "constructBuilding",
        data: data,
        onComplete: startBlinkFN
      }
    });
  }

  function getSkillAdjust( skills: number[], base: number, adjustFN, variance: number)
  {
    var avgSkill = skills.reduce(function(a, b){return a+b}) / skills.length;
    var workRate = adjustFN ? adjustFN(avgSkill) : Math.pow( 1-0.166904 * Math.log(avgSkill), 1/2.5 );
    
    var approximate = Math.round(base * workRate);
    var actual = Math.round(approximate +
      randRange(-base * variance, base * variance) );

    return(
    {
      approximate: approximate,
      actual: actual < 1 ? 1 : actual
    });
  }
  export function getActionTime( skills: number[], base: number )
  {
    return getSkillAdjust(
      skills,
      base,
      null,
      0.25
    );
  }

  export function getActionCost( skills: number[], base: number )
  {
    return getSkillAdjust(
      skills,
      base,
      null,
      0
    );
  }
}
