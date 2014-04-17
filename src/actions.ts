/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spriteblinker.d.ts" />
/// 
module actions
{
  var blinkerTODO = new Blinker(600, 0x880055, -1, false);

  export function buyCell( player: Player, cell, employee: Employee )
  {
    employee.active = false;
    var blinkerIdTODO = blinkerTODO.idGenerator++;

    var actionTime = getActionTime([employee.skills["negotiation"]], 14);
    var price = getActionCost([employee.skills["negotiation"]], cell.landValue).actual;

    var buyCellConfirmFN = function()
    {
      blinkerTODO.removeCells(blinkerIdTODO);
      employee.active = true;
      employee.trainSkill("negotiation");
      if (player.money < price)
      {
        eventManager.dispatchEvent(
        {
          type: "makeInfoPopup",
          content:
          {
            text: "Not enough funds"
          }
        })
        return false;
      }

      else
      {
        player.addCell(cell);
        player.addMoney(-price);
        cell.sprite.tint = 0xFF0000;
        eventManager.dispatchEvent({type: "updateWorld", content: ""});

        return true
      }

    }.bind(this);

    var buyCellCancelFN = function()
    {
      blinkerTODO.removeCells(blinkerIdTODO);
      employee.active = true;
    }.bind(this);

    var onCompleteText = "Buy plot for " + price + "$ ?";

    var completeFN = function()
    {
      blinkerTODO.addCells([cell], blinkerIdTODO);
      blinkerTODO.start();
      eventManager.dispatchEvent(
        {
          type: "makeConfirmPopup",
          content:
          {
            text: onCompleteText,
            onOk: buyCellConfirmFN,
            onCancel: buyCellCancelFN
          }
        })

    }.bind(this);

    eventManager.dispatchEvent({type: "updateWorld", content:""});
    eventManager.dispatchEvent({type: "delayedAction", content:
      {
        time: actionTime["actual"],
        onComplete: completeFN
      }
    });
  }
  export function recruitEmployee(player: Player, employee: Employee)
  {
    employee.active = false;

    var actionTime = getActionTime([employee.skills["recruitment"]], 14);

    var employeeCount = getSkillAdjust(
      [employee.skills["recruitment"]],
      2,
      function employeeCountAdjustFN(avgSkill){return 1 / (1.5 / Math.log(avgSkill + 1))},
      0.33);

    var newEmployees = {};


    // sets skill level linearly between 0 and 1 with 1 = 0 and 20 = 1
    var recruitSkillLevel = function(recruitingSkill)
      {
        // i love you wolfram alpha
        return 0.0526316*employee.skills["recruitment"] - 0.0526316;
      };

    // logarithmic: 1 = 3, >=6 = 1
    // kiss me wolfram alpha
    var skillVariance = employee.skills["recruitment"] > 6 ?
      1 :
      3 - 0.868589*Math.log(employee.skills["recruitment"]);


    for (var i = 0; i < employeeCount.actual; i++)
    {
      var id = "tempEmployee" + i;

      var newEmployee = new Employee(id, TEMPNAMES,
      {
        skillLevel: recruitSkillLevel(employee.skills["recruitment"]),
        growthLevel: Math.random(),
        skillVariance: skillVariance
      });

      newEmployees[id] = newEmployee;
    }

    var recruitConfirmFN = function(selected)
    {
      employee.active = true;
      player.addEmployee(selected);
    }.bind(this);

    var recruitCancelFN = function()
    {
      employee.active = true;
    }.bind(this);

    var recruitCompleteFN = function()
    {
      eventManager.dispatchEvent(
        {
          type: "makeEmployeeActionPopup",
          content:
          {
            employees: newEmployees,
            text: "Choose employee to recruit",
            onOk: recruitConfirmFN,
            okText: "Recruit",

          }
        })
    }
  }
  function getSkillAdjust( skills: number[], base: number, adjustFN, variance: number)
  {
    var avgSkill = skills.reduce(function(a, b){return a+b}) / skills.length;
    var workRate = adjustFN ? adjustFN(avgSkill) : 2 / Math.log(avgSkill + 1);
    
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
      function actionTimeAdjustFN(avgSkill){return 2 / Math.log(avgSkill + 1);},
      0.25
    );
  }

  export function getActionCost( skills: number[], base: number )
  {
    return getSkillAdjust(
      skills,
      base,
      function actionCostAdjustFN(avgSkill){return 2 / Math.log(avgSkill + 3);},
      0.25
    );
  }
}
