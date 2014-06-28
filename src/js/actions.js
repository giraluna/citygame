/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/utility.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spriteblinker.d.ts" />
///
/// <reference path="../data/js/cg.d.ts" />
var actions;
(function (actions) {
    var blinkerTODO = new Blinker(600, 0x880055, -1, false);

    function buyCell(props) {
        // TODO circular reference
        var _ = window;
        var game = _.game;

        var cell = game.getCell(props);
        var player = game.players[props.playerId];

        if (!cell || !player)
            throw new Error();

        var employee = player.employees[props.employeeId];
        var data = Object.create(props);

        if (data.finishedOn === undefined) {
            data.time = getActionTime([employee.skills["negotiation"]], 14).approximate;
        }

        var price = player.getCellBuyCost(cell);
        price = getActionCost([employee.skills["negotiation"]], price).actual;

        var blinkerId = blinkerTODO.idGenerator++;

        var onStartFN = function () {
            employee.active = false;
            employee.currAction = "buyCell";
            player.subtractCost(price);
            player.ownedCellsAmount++;
        };
        var onCompleteFN = function () {
            employee.active = true;
            employee.currAction = undefined;
            employee.trainSkill("negotiation");
            player.addCell(cell);
            player.ownedCellsAmount--;

            blinkerTODO.removeCells(blinkerId);
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });
            return true;
        };

        var startBlinkFN = function () {
            blinkerTODO.addCells([cell], null, blinkerId);
            blinkerTODO.start();

            window.setTimeout(onCompleteFN, 2400);
        };

        onStartFN.call(null);

        eventManager.dispatchEvent({
            type: "delayedAction",
            content: {
                type: "buyCell",
                data: data,
                onComplete: startBlinkFN
            }
        });
    }
    actions.buyCell = buyCell;
    ;

    function recruitEmployee(props) {
        // TODO circular reference
        var _ = window;
        var game = _.game;

        var player = game.players[props.playerId];
        if (!player)
            throw new Error();
        var employee = player.employees[props.employeeId];

        var data = Object.create(props);
        if (data.finishedOn === undefined) {
            data.time = getActionTime([employee.skills["recruitment"]], 14).approximate;
        }

        var onStartFN = function () {
            employee.active = false;
            employee.currentAction = "recruit";
        };

        var employeeCount = getSkillAdjust([employee.skills["recruitment"]], 4, function employeeCountAdjustFN(avgSkill) {
            return 1 / (1.5 / Math.log(avgSkill + 1));
        }, 0.33);

        if (!employee.player)
            throw new Error("No player on employee");
        var adjustedSkill = employee.skills["recruitment"] * employee.player.modifierEffects.recruitQuality;

        var recruitCompleteFN = function () {
            employee.active = true;
            employee.currentAction = undefined;
            employee.trainSkill("recruitment");

            var newEmployees = makeNewEmployees(employeeCount.actual, adjustedSkill);
            eventManager.dispatchEvent({
                type: "makeRecruitCompletePopup",
                content: {
                    player: player,
                    employees: newEmployees,
                    text: [
                        employee.name + " was able to scout the following people.",
                        "Which one should we recruit?"],
                    recruitingEmployee: employee
                }
            });
        };

        onStartFN.call(null);

        eventManager.dispatchEvent({
            type: "delayedAction",
            content: {
                type: "recruitEmployee",
                data: data,
                onComplete: recruitCompleteFN
            }
        });
    }
    actions.recruitEmployee = recruitEmployee;

    function constructBuilding(props) {
        // TODO circular reference
        var _ = window;
        var game = _.game;

        var cell = game.getCell(props);
        var player = game.players[props.playerId];

        if (!cell || !player)
            throw new Error();

        var employee = player.employees[props.employeeId];
        var buildingType = findType(props.buildingType);

        var data = Object.create(props);
        if (data.finishedOn === undefined) {
            data.time = getActionTime([employee.skills["construction"]], buildingType.buildTime).approximate;
        }

        var baseCost = player.getBuildCost(buildingType);
        var adjustedCost = getActionCost([employee.skills["construction"]], baseCost).actual;
        console.log(baseCost, adjustedCost);

        if (player.money < adjustedCost)
            return;

        var size = buildingType.size || [1, 1];
        var endX = cell.gridPos[0] + size[0] - 1;
        var endY = cell.gridPos[1] + size[1] - 1;

        var buildArea = cell.board.getCells(rectSelect(cell.gridPos, [endX, endY]));

        var blinkerId = blinkerTODO.idGenerator++;

        var onStartFN = function () {
            for (var i = 0; i < buildArea.length; i++) {
                buildArea[i].changeContent(cg.content.underConstruction, true);
            }

            player.subtractCost(adjustedCost);
            employee.active = false;
            employee.currentAction = "constructBuilding";

            player.amountBuiltPerType[buildingType.type]++;
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });
        };
        var constructBuildingCompleteFN = function () {
            employee.active = true;
            employee.currentAction = undefined;
            employee.trainSkill("construction");
            cell.changeContent(buildingType, true, player);

            player.amountBuiltPerType[buildingType.type]--;
            blinkerTODO.removeCells(blinkerId);
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });

            return true;
        };

        var startBlinkFN = function () {
            blinkerTODO.addCells(buildArea, null, blinkerId);
            blinkerTODO.start();

            window.setTimeout(constructBuildingCompleteFN, 2400);
        };

        onStartFN.call(null);

        eventManager.dispatchEvent({
            type: "delayedAction",
            content: {
                type: "constructBuilding",
                data: data,
                onComplete: startBlinkFN
            }
        });
    }
    actions.constructBuilding = constructBuilding;

    function getSkillAdjust(skills, base, adjustFN, variance) {
        var avgSkill = skills.reduce(function (a, b) {
            return a + b;
        }) / skills.length;
        var workRate = adjustFN ? adjustFN(avgSkill) : Math.pow(1 - 0.166904 * Math.log(avgSkill), 1 / 2.5);

        var approximate = Math.round(base * workRate);
        var actual = Math.round(approximate + randRange(-base * variance, base * variance));

        return ({
            approximate: approximate,
            actual: actual < 1 ? 1 : actual
        });
    }
    function getActionTime(skills, base) {
        return getSkillAdjust(skills, base, null, 0.25);
    }
    actions.getActionTime = getActionTime;

    function getActionCost(skills, base) {
        return getSkillAdjust(skills, base, null, 0);
    }
    actions.getActionCost = getActionCost;
})(actions || (actions = {}));
//# sourceMappingURL=actions.js.map
