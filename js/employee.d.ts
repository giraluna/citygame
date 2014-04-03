/// <reference path="utility.d.ts" />
declare var TEMPNAMES: {
    english: {
        male: string[];
        female: string[];
        surnames: string[];
    };
};
interface ISkillsObj {
    negotiation: number;
    management: number;
    recruitment: number;
    constuction: number;
}
declare class Employee {
    public id: string;
    public name: string;
    public gender: string;
    public ethnicity: string;
    public skills: ISkillsObj;
    public growth: ISkillsObj;
    public skillTotal: number;
    public potential: number;
    public traits: any;
    constructor(id: number, names: any, name?: string, gender?: string, ethnicity?: string, skills?: ISkillsObj, growth?: ISkillsObj, potential?: number, traits?: any);
    public getName(names: any, gender: string, ethnicity: string): string;
    public setSkillTotal(): void;
    public trainSkill(skill: string): void;
}
