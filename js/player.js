var Player = (function () {
    function Player(id) {
        this.money = 0;
        this.ownedContent = {};
        this.ownedCells = {};
        this.employees = {};
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
