/// <reference path="../src/js/arraylogic.d.ts" />

module cellModifiers
{
  export function testModifier(range: number = 1, strength: number = 1)
  {
    return(
    {
      type: "testModifier",
      translate: "Nice enviroment",
      range: range,
      strength: strength,
      targets: ["apartment"],
      effect: effects.testEffect
    });
  }

  export function testModifier2(range: number = 1, strength: number = 1)
  {
    return(
    {
      type: "testModifier2",
      translate: "Crowded",
      range: range,
      strength: strength,
      targets: ["apartment"],
      effect: effects.testEffect2
    });
  }

  export var effects =
  {
    testEffect:
    {
      multiplier: 0.25
    },
    testEffect2:
    {
      addedProfit: -0.1,
      multiplier: -0.15
    }
  }
}