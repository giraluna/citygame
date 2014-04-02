/// <reference path="../js/utility.d.ts" />

// TODO
var TEMPNAMES =
{
  english:
  {
    male:
    [
      "bob"
    ],
    female:
    [
      "bobby"
    ],
    surnames:
    [
      "bobsson"
    ]
  }
}

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

  constructor( id: string,
    names: any,
    name?: string,
    gender?: string,
    ethnicity?: string,
    skills?: ISkillsObj,
    growth?: ISkillsObj,
    potential?: number,
    traits?: any )
  {
    this.id = id;

    this.gender = gender || getRandomArrayItem(["male", "female"]);
    this.ethnicity = ethnicity || getRandomKey(names);
    this.name = name || this.getName( names, this.gender, this.ethnicity );

    // TODO
    this.skills = skills ||
    {
      negotiation: 10,
      management: 10,
      recruitment: 10,
      constuction: 10
    }
    this.growth = growth ||
    {
      negotiation: 0.5,
      management: 0.5,
      recruitment: 0.5,
      constuction: 0.5
    }
    this.potential = 40;
    // END TODO
    
    this.setSkillTotal();
  }

  getName( names: any, gender: string, ethnicity: string )
  {
    var first = getRandomArrayItem(names[ethnicity][gender]);
    var last = getRandomArrayItem(names[ethnicity]["surnames"]);

    return "" + first + " " + last;
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

    else
    {
      var rand = Math.random();
      if (rand + this.growth[skill] > 1)
      {
        this.skills[skill]++;
        this.skillTotal++;
      }
    }
  }
}