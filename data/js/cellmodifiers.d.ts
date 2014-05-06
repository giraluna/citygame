/// <reference path="../../src/js/arraylogic.d.ts" />
declare module cellModifiers {
    function testModifier(range?: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
    };
    function testModifier2(range?: number, strength?: number): {
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
    var effects: {
        testEffect: {
            multiplier: number;
        };
        testEffect2: {
            addedProfit: number;
            multiplier: number;
        };
    };
}
