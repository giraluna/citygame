var Player = (function () {
    function Player() {
        this.id = "player1";
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
        this.incomeSpan.innerHTML = "+" + this.income + "/s";
    };
    Player.prototype.addMoney = function (amount) {
        this.money += amount;
        this.updateElements();
    };
    Player.prototype.setIncome = function (amount) {
        this.income = amount;
        this.updateElements();
    };
    return Player;
})();
//# sourceMappingURL=player.js.map
