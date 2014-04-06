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
    function Employee(id, names, params) {
        this.traits = {};
        this.id = "employee" + id;

        // lets us do cleaner || check instead of (params && param.x) ? x : y
        var _params = params || {};

        this.gender = _params.gender || getRandomArrayItem(["male", "female"]);
        this.ethnicity = _params.ethnicity || getRandomKey(names);
        this.name = _params.name || this.getName(names, this.gender, this.ethnicity);

        this.skills = _params.skills || this.setSkillsByLevel(_params.skillLevel);
        this.growth = _params.growth || this.setGrowthByLevel(_params.growthLevel);
        this.potential = _params.potential || 50 * _params.skillLevel + 30 * Math.random();

        this.setSkillTotal();
    }
    Employee.prototype.getName = function (names, gender, ethnicity) {
        var first = getRandomArrayItem(names[ethnicity][gender]);
        var last = getRandomArrayItem(names[ethnicity]["surnames"]);

        return "" + first + " " + last;
    };
    Employee.prototype.setSkillsByLevel = function (skillLevel) {
        var skills = {
            negotiation: 1,
            management: 1,
            recruitment: 1,
            constuction: 1
        };
        var min = 8 * skillLevel + 1;
        var max = 16 * skillLevel + 2;

        for (var skill in skills) {
            skills[skill] = randInt(min, max);
        }
        return skills;
    };
    Employee.prototype.setGrowthByLevel = function (growthLevel) {
        var skills = {
            negotiation: 1,
            management: 1,
            recruitment: 1,
            constuction: 1
        };

        for (var skill in skills) {
            var _growth = Math.random() * growthLevel;
            skills[skill] = _growth > 0.1 ? _growth : 0.1;
        }
        return skills;
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
