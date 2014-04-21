/// <reference path="utility.d.ts" />
declare var TEMPNAMES: {
    american: {
        male: string[];
        female: string[];
        surnames: string[];
    };
};
declare var idGenerator: any;
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
    public active: boolean;
    constructor(names: any, params?: {
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
    });
    public getName(names: any, gender: string, ethnicity: string): string;
    public setSkillsByLevel(skillLevel: any, variance: any): ISkillsObj;
    public setGrowthByLevel(growthLevel: any): ISkillsObj;
    public setSkillTotal(): void;
    public trainSkill(skill: string): void;
}
declare function makeNewEmployees(employeeCount: number, recruitingSkill: number): any[];
