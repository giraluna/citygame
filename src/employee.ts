/// <reference path="js/utility.d.ts" />

// TODO
var TEMPNAMES =
{
  american:
  {
    male:
    [
      "James",
      "Christopher",
      "Ronald",
      "John",
      "Daniel",
      "Anthony",
      "Robert",
      "Paul",
      "Kevin",
      "Michael",
      "Mark",
      "Jason",
      "William",
      "Donald",
      "Robin",
      "Jeff",
      "David",
      "George",
      "Richard",
      "Kenneth",
      "Charles",
      "Steven",
      "Joseph",
      "Edward",
      "Thomas",
      "Brian",
      "Davis"
    ],
    female:
    [
      "Mary",
      "Lisa",
      "Michelle",
      "Patricia",
      "Nancy",
      "Laura",
      "Linda",
      "Karen",
      "Sarah",
      "Barbara",
      "Betty",
      "Kimberly",
      "Elizabeth",
      "Helen",
      "Deborah",
      "Jennifer",
      "Sandra",
      "Maria",
      "Donna",
      "Susan",
      "Carol",
      "Margaret",
      "Ruth"
    ],
    surnames:
    [
      "Smith",
      "Anderson",
      "Clark",
      "Wright",
      "Mitchell",
      "Johnson",
      "Thomas",
      "Rodriguez",
      "Lopez",
      "Perez",
      "Williams",
      "Jackson",
      "Lewis",
      "Hill",
      "Roberts",
      "Jones",
      "White",
      "Lee",
      "Scott",
      "Turner",
      "Brown",
      "Harris",
      "Walker",
      "Green",
      "Phillips",
      "Davis",
      "Martin",
      "Hall",
      "Adams",
      "Campbell",
      "Miller",
      "Farmer",
      "Thompson",
      "Allen",
      "Baker",
      "Parker",
      "Wilson",
      "Garcia",
      "Young",
      "Gonzalez",
      "Evans",
      "Moore",
      "Martinez",
      "Hernandez",
      "Nelson",
      "Edwards",
      "Taylor",
      "Robinson",
      "King",
      "Carter",
      "Collins"
    ]
  }
}

var idGenerator = idGenerator || {};
idGenerator.employee = 0;

interface ISkillsObj
{
  negotiation: number; // buy & sell price
  management: number;  // rolling profits
  recruitment: number; // recruiting new employees
  constuction: number; // constructing buildings
}

class Employee
{
  id: string;
  name: string;
  gender: string;
  ethnicity: string;
  skills: ISkillsObj;
  growth: ISkillsObj;
  skillTotal: number;
  potential: number;
  traits: any = {};
  active: boolean = true;

  constructor(
    names: any,
    params?: {
      id?: string;
      name?: string;
      gender?: string;
      ethnicity?: string;

      skillLevel?: number;
      skillVariance?: number;
      growthLevel?: number;

      growth?: ISkillsObj;
      potential?: number;
      skills?: ISkillsObj;
      traits?: any;
    })
  {

    // lets us do cleaner || check instead of (params && param.x) ? x : y
    var _params = params || {};

    this.id = _params.id || "employee" + idGenerator.employee++;

    this.gender = _params.gender || getRandomArrayItem(["male", "female"]);
    this.ethnicity = _params.ethnicity || getRandomKey(names);
    this.name = _params.name || this.getName( names, this.gender, this.ethnicity );

    var skillVariance = Math.round(_params.skillVariance) || 1;
    this.skills = _params.skills || this.setSkillsByLevel(_params.skillLevel, skillVariance);
    this.growth = _params.growth || this.setGrowthByLevel(_params.growthLevel);
    this.potential = _params.potential ||
      50 * _params.skillLevel + 30 * Math.random();

    
    this.setSkillTotal();
  }

  getName( names: any, gender: string, ethnicity: string )
  {
    var first = getRandomArrayItem(names[ethnicity][gender]);
    var last = getRandomArrayItem(names[ethnicity]["surnames"]);

    return "" + first + " " + last;
  }
  setSkillsByLevel(skillLevel, variance)
  {
    var skills: ISkillsObj =
    {
      negotiation: 1,
      management: 1,
      recruitment: 1,
      constuction: 1
    }
    var min = 8 * skillLevel + 1;
    var max = 16 * skillLevel + 1 + variance;

    for (var skill in skills)
    {
      skills[skill] = randInt(min, max);
    }
    return skills;
  }
  setGrowthByLevel(growthLevel)
  {
    var skills: ISkillsObj =
    {
      negotiation: 1,
      management: 1,
      recruitment: 1,
      constuction: 1
    }

    for (var skill in skills)
    {
      var _growth = Math.random() * growthLevel;
      skills[skill] = _growth > 0.1 ? _growth : 0.1;
    }
    return skills;
  }
  setSkillTotal()
  {
    var total = 0;
    for (var skill in this.skills)
    {
      total += this.skills[skill];
    }
    this.skillTotal = total;
  }
  trainSkill(skill: string)
  {
    // don't train if potential is already reached
    if (this.skillTotal >= this.potential) return;
    else if (this.skills[skill] >= 20) return;

    else
    {
      var rand = Math.random();

      var adjustedGrowth =
        this.growth[skill] * ( 1 / Math.log(this.skills[skill] + 0.5) );
      if (rand + adjustedGrowth > 1)
      {
        this.skills[skill]++;
        this.skillTotal++;
      }
    }
  }
}

function makeNewEmployees(employeeCount: number, recruitingSkill: number)
{
  var newEmployees = [];

  // sets skill level linearly between 0 and 1 with 1 = 0 and 20 = 1
  var recruitSkillLevel = function(recruitingSkill)
    {
      // i love you wolfram alpha
      return 0.0526316*recruitingSkill - 0.0526316;
    };

  // logarithmic: 1 = 3, >=6 = 1
  // kiss me wolfram alpha
  var skillVariance = recruitingSkill > 6 ?
    1 :
    3 - 0.868589*Math.log(recruitingSkill);


  for (var i = 0; i < employeeCount; i++)
  {

    var newEmployee = new Employee(TEMPNAMES,
    {
      skillLevel: recruitSkillLevel(recruitingSkill),
      growthLevel: Math.random(),
      skillVariance: skillVariance
    });

    newEmployees.push( newEmployee );
  }

  return newEmployees;
}
