/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/eventlisteners.d.ts" />
module actions
{
  function buyCell( player: Player, cell, employee: Employee )
  {
    employee.active = false;
    cell.sprite.tint = 0xFF0000;

    var actionTime = getActionTime(employee.skills["negotiation"], 14);
    var price = cell.landValue;

    var buyCellConfirmFN = function()
    {
      employee.active = true;
      employee.trainSkill("negotiation");
      if (player.money < price)
      {
        listeners.UI.dispatchEvent(
        {
          type: "makeInfoPopup",
          content:
          {
            infoText: "Not enough funds"
          }
        })
        return false;
      }

      else
      {
        player.addCell(cell);
        player.addMoney(-price);

        return true
      }

    }.bind(this);

    var buyCellCancelFN = function()
    {
      employee.active = true;
    }.bind(this);

    var onCompleteText = ""

    var completeFN = function()
    {
      listeners.UI.dispatchEvent(
        {
          type: "makeConfirmationPopup",
          content:
          {
            text: onCompleteText,
            onOk: buyCellConfirmFN,
            onCancel: buyCellCancelFN
          }
        })

    }.bind(this);

    listeners.UI.dispatchEvent({type: "updateWorld", content:""});
    listeners.UI.dispatchEvent({type: "delayedAction", content:""})
  }
  function getActionTime( skill, baseDuration )
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
