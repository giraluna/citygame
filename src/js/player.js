/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
var Player = (function () {
    function Player(id, color) {
        if (typeof color === "undefined") { color = 0xFF0000; }
        this.money = 0;
        this.ownedContent = {};
        this.ownedCells = {};
        this.employees = {};
        this.usedInitialRecruit = false;
        this.modifiers = {};
        this.id = "player" + id;
        this.color = color;
        this.bindElements();
        this.init();
    }
    Player.prototype.bindElements = function () {
        this.moneySpan = document.getElementById("money");
        this.incomeSpan = document.getElementById("income");
        this.updateElements();
    };
    Player.prototype.updateElements = function () {
        this.moneySpan.innerHTML = Math.round(this.money) + "$";
        //this.incomeSpan.innerHTML = "+" + this.income + "/s";
    };
    Player.prototype.init = function () {
        for (var building in cg.content.buildings) {
            var type = cg.content.buildings[building].categoryType;
            if (!this.ownedContent[type]) {
                this.ownedContent[type] = [];
            }
        }
    };
    Player.prototype.addEventListeners = function () {
    };

    Player.prototype.addEmployee = function (employee) {
        this.employees[employee.id] = employee;
    };
    Player.prototype.getEmployees = function () {
        var employees = [];
        for (var employee in this.employees) {
            employees.push(this.employees[employee]);
        }
        ;

        return employees;
    };
    Player.prototype.getActiveEmployees = function () {
        var active = [];
        for (var employee in this.employees) {
            if (employee.active !== false)
                active.push(this.employees[employee]);
        }
        ;

        return active;
    };

    Player.prototype.addCell = function (cell) {
        if (!this.ownedCells[cell.gridPos]) {
            console.log(cell.gridPos);
            this.ownedCells[cell.gridPos] = cell;
            console.log(this.ownedCells);
            console.log(game.players.player0);
            console.log(game.players.player0 === this);

            cell.player = this;
            cell.addOverlay(this.color);
        }
    };
    Player.prototype.removeCell = function (cell) {
        if (this.ownedCells[cell.gridPos]) {
            delete this.ownedCells[cell.gridPos];
        }
    };
    Player.prototype.addContent = function (content) {
        var type = content.categoryType;
        this.ownedContent[type].push(content);
        content.player = this;
    };
    Player.prototype.removeContent = function (content) {
    };
    Player.prototype.addMoney = function (amount) {
        this.money += amount;
        this.updateElements();
    };
    return Player;
})();
//# sourceMappingURL=player.js.map
