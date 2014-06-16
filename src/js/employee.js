/// <reference path="js/utility.d.ts" />
/// <reference path="../data/js/names.d.ts" />
var idGenerator = idGenerator || {};
idGenerator.employee = 0;

var Employee = (function () {
    function Employee(names, params) {
        this.traits = {};
        this.active = true;
        // lets us do cleaner || check instead of (params && param.x) ? x : y
        var _params = params || {};

        this.id = _params.id || "employee" + idGenerator.employee++;

        this.gender = _params.gender || getRandomArrayItem(["male", "female"]);
        this.ethnicity = _params.ethnicity || getRandomKey(names);
        this.name = _params.name || this.getName(names, this.gender, this.ethnicity);

        var skillVariance = Math.round(_params.skillVariance) || 1;

        // legacy
        if (_params.skills && _params.skills["management"])
            delete _params.skills["management"];

        this.skills = _params.skills || this.setSkillsByLevel(_params.skillLevel, skillVariance);
        this.growth = _params.growth || this.setGrowthByLevel(_params.growthLevel);
        this.potential = _params.potential || 60;

        //40 * _params.skillLevel + 20 * Math.random();
        this.setSkillTotal();
    }
    Employee.prototype.getName = function (names, gender, ethnicity) {
        var first = getRandomArrayItem(names[ethnicity][gender]);
        var last = getRandomArrayItem(names[ethnicity]["surnames"]);

        var final = "";
        if (names[ethnicity].props && names[ethnicity].props.surname_first) {
            final += last + " " + first;
        } else {
            final += first + " " + last;
        }

        return final;
    };
    Employee.prototype.setSkillsByLevel = function (skillLevel, variance) {
        var skills = {
            negotiation: 1,
            recruitment: 1,
            construction: 1
        };
        var min = 8 * skillLevel + 1;
        var max = 16 * skillLevel + 1 + variance;

        for (var skill in skills) {
            skills[skill] = randInt(min, max);
            if (skills[skill] > 20)
                skills[skill] = 20;
        }
        return skills;
    };
    Employee.prototype.setGrowthByLevel = function (growthLevel) {
        var skills = {
            negotiation: 1,
            recruitment: 1,
            construction: 1
        };

        for (var skill in skills) {
            var _growth = Math.random() * growthLevel;
            skills[skill] = _growth > 0.4 ? _growth : 0.4;
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
        else if (this.skills[skill] >= 20)
            return;
        else {
            var rand = Math.random();

            var adjustedGrowth = this.growth[skill] * (2 / Math.log(this.skills[skill] + 0.5));
            console.log(rand, adjustedGrowth, this.growth[skill]);
            if (rand + adjustedGrowth > 1) {
                console.log("levelup");
                this.skills[skill]++;
                this.skillTotal++;
            }
        }
    };
    return Employee;
})();

function makeNewEmployees(employeeCount, recruitingSkill) {
    var newEmployees = [];

    // sets skill level linearly between 0 and 1 with 1 = 0 and 20 = 1
    var recruitSkillLevel = function (recruitingSkill) {
        // i love you wolfram alpha
        return 0.0526316 * recruitingSkill - 0.0526316;
    };

    // logarithmic: 1 = 3, >=6 = 1
    // kiss me wolfram alpha
    var skillVariance = recruitingSkill > 6 ? 1 : 3 - 0.868589 * Math.log(recruitingSkill);

    for (var i = 0; i < employeeCount; i++) {
        var newEmployee = new Employee(names, {
            skillLevel: recruitSkillLevel(recruitingSkill),
            growthLevel: Math.random(),
            skillVariance: skillVariance
        });

        newEmployees.push(newEmployee);
    }

    return newEmployees;
}
//# sourceMappingURL=employee.js.map
