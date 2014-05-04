/// <reference path="../../src/js/arraylogic.d.ts" />
declare module cellModifiers {
    function testModifier(range?: number, strength?: number): {
        type: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            baseProfit: number;
            multiplier: number;
        };
    };
    var effects: {
        testEffect: {
            baseProfit: number;
            multiplier: number;
        };
    };
}
