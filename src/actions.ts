/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
module actions
{
  export function buyCell( player: Player, cell, employee: Employee )
  {
    employee.active = false;
    

    var actionTime = getActionTime(employee.skills["negotiation"], 14);
    var price = cell.landValue;

    var buyCellConfirmFN = function()
    {
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
      employee.active = true;
    }.bind(this);

    var onCompleteText = "Buy cell?";

    var completeFN = function()
    {
      console.log("done");
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
  export function getActionTime( skill, baseDuration )
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
}
