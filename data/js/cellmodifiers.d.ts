/// <reference path="../../src/js/arraylogic.d.ts" />
declare module cellModifiers {
    function niceEnviroment(range?: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
    };
    function crowded(range?: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
    function population(range?: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
        };
        scaling: (strength: any) => any;
    };
    function fastfoodCompetition(range?: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
}
