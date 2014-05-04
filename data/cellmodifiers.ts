/// <reference path="../src/js/arraylogic.d.ts" />

module cellModifiers
{
  export function testModifier(range: number = 1, strength: number = 1)
  {
    return(
    {
      type: "testModifier",
      range: range,
      strength: strength,
      targets: ["apartment"],
      effect: effects.testEffect
    });
  }

  export var effects =
  {
    testEffect:
    {
      baseProfit: 10,
      multiplier: 0.25
    }
  }
}