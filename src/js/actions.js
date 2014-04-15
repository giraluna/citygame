/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
var actions;
(function (actions) {
    function buyCell(player, cell, employee) {
        employee.active = false;

        var actionTime = getActionTime([employee.skills["negotiation"]], 14);
        var price = cell.landValue;

        var buyCellConfirmFN = function () {
            employee.active = true;
            employee.trainSkill("negotiation");
            if (player.money < price) {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup",
                    content: {
                        text: "Not enough funds"
                    }
                });
                return false;
            } else {
                player.addCell(cell);
                player.addMoney(-price);
                cell.sprite.tint = 0xFF0000;
                eventManager.dispatchEvent({ type: "updateWorld", content: "" });

                return true;
            }
        }.bind(this);

        var buyCellCancelFN = function () {
            employee.active = true;
        }.bind(this);

        var onCompleteText = "Buy cell?";

        var completeFN = function () {
            console.log("done");
            eventManager.dispatchEvent({
                type: "makeConfirmPopup",
                content: {
                    text: onCompleteText,
                    onOk: buyCellConfirmFN,
                    onCancel: buyCellCancelFN
                }
            });
        }.bind(this);

        eventManager.dispatchEvent({ type: "updateWorld", content: "" });
        eventManager.dispatchEvent({
            type: "delayedAction", content: {
                time: actionTime["actual"],
                onComplete: completeFN
            }
        });
    }
    actions.buyCell = buyCell;
    function getSkillAdjust(skills, base, adjustFN, variance) {
        var avgSkill = skills.reduce(function (a, b) {
            return a + b;
        }) / skills.length;
        var workRate = adjustFN ? adjustFN(avgSkill) : 2 / Math.log(avgSkill + 1);

        var approximate = Math.round(base * workRate);
        var actual = Math.round(approximate + randRange(-base * variance, base * variance));

        return ({
            approximate: approximate,
            actual: actual < 1 ? 1 : actual
        });
    }
    function getActionTime(skills, base) {
        return getSkillAdjust(skills, base, function actionTimeAdjustFN(avgSkill) {
            return 2 / Math.log(avgSkill + 1);
        }, 0.25);
    }
    actions.getActionTime = getActionTime;

    function getActionCost(skills, base) {
        return getSkillAdjust(skills, base, function actionCostAdjustFN(avgSkill) {
            return 2 / Math.log(avgSkill + 3);
        }, 0.25);
    }
    actions.getActionCost = getActionCost;
})(actions || (actions = {}));
//# sourceMappingURL=actions.js.map
