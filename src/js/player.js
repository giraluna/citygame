/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/employee.d.ts" />
var Player = (function () {
    function Player(id) {
        this.money = 0;
        this.ownedContent = {};
        this.ownedCells = {};
        this.employees = {};
        this.usedInitialRecruit = false;
        this.modifiers = {};
        this.id = "player" + id;
        this.bindElements();
    }
    Player.prototype.bindElements = function () {
        this.moneySpan = document.getElementById("money");
        this.incomeSpan = document.getElementById("income");
        this.updateElements();
    };
    Player.prototype.updateElements = function () {
        this.moneySpan.innerHTML = this.money + "$";
        //this.incomeSpan.innerHTML = "+" + this.income + "/s";
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
            this.ownedCells[cell.gridPos] = cell;
        }
    };
    Player.prototype.removeCell = function (cell) {
        if (this.ownedCells[cell.gridPos]) {
            delete this.ownedCells[cell.gridPos];
        }
    };
    Player.prototype.addContent = function (type, content) {
        if (!this.ownedContent[type]) {
            this.ownedContent[type] = {};
        }
        this.ownedContent[type][content.id] = content;
    };
    Player.prototype.addMoney = function (amount) {
        this.money += amount;
        this.updateElements();
    };
    return Player;
})();
//# sourceMappingURL=player.js.map
