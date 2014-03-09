var Player = (function () {
    function Player() {
        this.money = 0;
        this.income = 0;
        this.bindElements();
    }
    Player.prototype.bindElements = function () {
        this.moneySpan = document.getElementById("money");
        this.incomeSpan = document.getElementById("income");
        this.updateElements();
    };
    Player.prototype.updateElements = function () {
        this.moneySpan.innerHTML = this.money + "$";
        this.incomeSpan.innerHTML = "+" + this.income + "/tick";
    };
    Player.prototype.addMoney = function (amount) {
        this.money += amount;
        this.updateElements();
    };
    Player.prototype.addIncome = function (amount) {
        this.income += amount;
        this.updateElements();
    };
    return Player;
})();
//# sourceMappingURL=player.js.map
