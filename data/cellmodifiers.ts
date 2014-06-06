/// <reference path="../src/js/arraylogic.d.ts" />

module cellModifiers
{

  export function niceEnviroment(range: number, strength: number = 1)
  {
    return(
    {
      type: "niceEnviroment",
      translate: "Nice enviroment",
      range: range,
      strength: strength,
      targets: ["apartment"],
      effect:
      {
        multiplier: 0.1
      },
      landValue:
      {
        radius: 8,
        multiplier: 0.05,
        scalingFN: function(strength){ return 1+Math.log(strength); }
      }
    });
  }

  export function crowded(range: number, strength: number = 1)
  {
    return(
    {
      type: "crowded",
      translate: "Crowded",
      range: range,
      strength: strength,
      targets: ["apartment"],
      effect:
      {
        addedProfit: -0.1,
        multiplier: -0.15
      }
    });
  }

  export function population(range: number, strength: number = 1)
  {
    return(
    {
      type: "population",
      translate: "Nearby customers",
      range: range,
      strength: strength,
      targets: ["fastfood", "shopping"],
      effect:
      {
        addedProfit: 0.1,
      },
      scaling: function(strength)
      {
        return strength;
      },
      landValue:
      {
        radius: 4,
        multiplier: 0.01
      }
    });
  }

  export function fastfoodCompetition(range: number, strength: number = 1)
  {
    return(
    {
      type: "fastfoodCompetition",
      translate: "Competing restaurants",
      range: range,
      strength: strength,
      targets: ["fastfood"],
      effect:
      {
        addedProfit: -0.15,
        multiplier: -0.25,
      }
    });
  }

  export function shoppingCompetition(range: number, strength: number = 1)
  {
    return(
    {
      type: "shoppingCompetition",
      translate: "Competing stores",
      range: range,
      strength: strength,
      targets: ["shopping"],
      effect:
      {
        addedProfit: -0.075,
        multiplier: -0.15,
      }
    });
  }

  export function nearbyShopping(range: number, strength: number = 1)
  {
    return(
    {
      type: "nearbyShopping",
      translate: "Nearby stores",
      range: range,
      strength: strength,
      targets: ["fastfood"],
      effect:
      {
        addedProfit: 0.2
      }
    });
  }

  export function nearbyStation(range: number, strength: number = 1)
  {
    return(
    {
      type: "nearbyStation",
      translate: "Nearby station",
      range: range,
      strength: strength,
      targets: ["fastfood", "shopping", "office", "apartment"],
      effect:
      {
        addedProfit: 0.5,
        multiplier: 0.2
      },
      landValue:
      {
        radius: 20,
        multiplier: 0.05,
        falloffFN: function(distance, invertedDistance, invertedDistanceRatio)
        {
          return invertedDistance * invertedDistanceRatio;
        }
      }
    });
  }
}