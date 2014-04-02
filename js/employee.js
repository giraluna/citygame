/// <reference path="../js/utility.d.ts" />
// TODO
var TEMPNAMES = {
    english: {
        male: [
            "bob"
        ],
        female: [
            "bobby"
        ],
        surnames: [
            "bobsson"
        ]
    }
};

var Employee = (function () {
    function Employee(id, names, name, gender, ethnicity, skills, growth, potential, traits) {
        this.traits = {};
        this.id = id;

        this.gender = gender || getRandomArrayItem(["male", "female"]);
        this.ethnicity = ethnicity || getRandomKey(names);
        this.name = name || this.getName(names, this.gender, this.ethnicity);

        // TODO
        this.skills = skills || {
            negotiation: 10,
            management: 10,
            recruitment: 10,
            constuction: 10
        };
        this.growth = growth || {
            negotiation: 0.5,
            management: 0.5,
            recruitment: 0.5,
            constuction: 0.5
        };
        this.potential = 40;

        // END TODO
        this.setSkillTotal();
    }
    Employee.prototype.getName = function (names, gender, ethnicity) {
        var first = getRandomArrayItem(names[ethnicity][gender]);
        var last = getRandomArrayItem(names[ethnicity]["surnames"]);

        return "" + first + " " + last;
    };
    Employee.prototype.setSkillTotal = function () {
        var total = 0;
        for (var skill in this.skills) {
            total += this.skills[skill];
        }
        this.skillTotal = total;
    };
    Employee.prototype.trainSkill = function (skill) {
        // don't train if potential is already reached
        if (this.skillTotal >= this.potential)
            return;
        else {
            var rand = Math.random();
            if (rand + this.growth[skill] > 1) {
                this.skills[skill]++;
                this.skillTotal++;
            }
        }
    };
    return Employee;
})();
//# sourceMappingURL=employee.js.map
