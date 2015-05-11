/// <reference path="contenttemplates.ts" />

module CityGame
{
  export interface IBuildingTemplate extends IContentTemplate
  {
    baseProfit: number;
    daysForProfitTick: number;
    cost: number;
    buildTime: number;
    population?: number;
  }
  export module Buildings
  {

    export var house1: IBuildingTemplate =
    {
      type: "house1",
      baseType: "building",
      categoryType: "apartment",
      title: "Apartment 1",
      baseProfit: 16,
      daysForProfitTick: 1,
      cost: 3000,
      buildTime: 14,
      anchor: [0.5, 1],
      frame: ["house1.png"],
      canNotBuildOn: ["water", "building", "road"],
      population: 5,
      effects:
      [
        {
          type: "crowded",
          range: 2,
          strength: 1
        },
        {
          type: "population",
          range: 3,
          strength: 1
        }
      ]
    },
    export var house2: IBuildingTemplate =
    {
      type: "house2",
      baseType: "building",
      categoryType: "apartment",
      title: "Apartment 2",
      baseProfit: 200,
      daysForProfitTick: 1,
      cost: 100000,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["house2.png"],
      canNotBuildOn: ["water", "building", "road"],
      population: 10,
      effects:
      [
        {
          type: "crowded",
          range: 2,
          strength: 2
        },
        {
          type: "population",
          range: 3,
          strength: 2
        }
      ]
    },
    export var house3: IBuildingTemplate =
    {
      type: "house3",
      baseType: "building",
      categoryType: "apartment",
      title: "Apartment 3",
      baseProfit: 1.2,
      daysForProfitTick: 1,
      cost: 25,
      buildTime: 14,
      anchor: [0.5, 1],
      frame: ["house3.png"],
      canNotBuildOn: ["water", "building", "road"],
      population: 5,
      effects:
      [
        {
          type: "crowded",
          range: 2,
          strength: 1
        },
        {
          type: "population",
          range: 3,
          strength: 1
        }
      ]
    },
    export var house4: IBuildingTemplate =
    {
      type: "house4",
      baseType: "building",
      categoryType: "apartment",
      title: "Apartment 4",
      baseProfit: 2.5,
      daysForProfitTick: 1,
      cost: 50,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["house4.png"],
      canNotBuildOn: ["water", "building", "road"],
      population: 10,
      effects:
      [
        {
          type: "crowded",
          range: 2,
          strength: 2
        },
        {
          type: "population",
          range: 3,
          strength: 2
        }
      ]
    },
    export var house5: IBuildingTemplate =
    {
      type: "house5",
      baseType: "building",
      categoryType: "apartment",
      title: "Apartment 5",
      baseProfit: 2.5,
      daysForProfitTick: 1,
      cost: 50,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["house5.png"],
      canNotBuildOn: ["water", "building", "road"],
      population: 10,
      effects:
      [
        {
          type: "crowded",
          range: 2,
          strength: 2
        },
        {
          type: "population",
          range: 3,
          strength: 2
        }
      ]
    },
    export var house6: IBuildingTemplate =
    {
      type: "house6",
      baseType: "building",
      categoryType: "apartment",
      title: "Apartment 6",
      baseProfit: 2.5,
      daysForProfitTick: 1,
      cost: 50,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["house6.png"],
      canNotBuildOn: ["water", "building", "road"],
      population: 10,
      effects:
      [
        {
          type: "crowded",
          range: 2,
          strength: 2
        },
        {
          type: "population",
          range: 3,
          strength: 2
        }
      ]
    },
    export var house7: IBuildingTemplate =
    {
      type: "house7",
      baseType: "building",
      categoryType: "apartment",
      title: "Apartment 7",
      baseProfit: 1.2,
      daysForProfitTick: 1,
      cost: 25,
      buildTime: 14,
      anchor: [0.425, 1],
      frame: ["house7.png"],
      canNotBuildOn: ["water", "building", "road"],
      population: 5,
      effects:
      [
        {
          type: "crowded",
          range: 2,
          strength: 1
        },
        {
          type: "population",
          range: 3,
          strength: 1
        }
      ]
    },
    export var fastfood: IBuildingTemplate =
    {
      type: "fastfood",
      baseType: "building",
      categoryType: "fastfood",
      title: "Fast food restaurant",
      baseProfit: 3,
      daysForProfitTick: 1,
      cost: 150,
      buildTime: 14,
      anchor: [0.5, 1],
      frame: ["fastfood.png"],
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "fastfoodCompetition",
          range: 3,
          strength: 1
        }
      ]
    },
    export var conveniencestore: IBuildingTemplate =
    {
      type: "conveniencestore",
      baseType: "building",
      categoryType: "shopping",
      title: "Convenience store",
      baseProfit: 8,
      daysForProfitTick: 1,
      cost: 1000,
      buildTime: 10,
      anchor: [0.5, 1],
      frame: ["conveniencestore.png"],
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "shoppingCompetition",
          range: 2,
          strength: 1
        },
        {
          type: "nearbyShopping",
          range: 2,
          strength: 1
        }
      ]
    },
    export var smalloffice: IBuildingTemplate =
    {
      type: "smalloffice",
      baseType: "building",
      categoryType: "office",
      title: "Office 1",
      baseProfit: 40,
      daysForProfitTick: 1,
      cost: 10000,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["office1.png"],
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "population",
          range: 3,
          strength: 1
        }
      ]
    },
    export var office2: IBuildingTemplate =
    {
      type: "office2",
      baseType: "building",
      categoryType: "office",
      title: "Office 2",
      baseProfit: 40,
      daysForProfitTick: 1,
      cost: 10000,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["office2.png"],
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "population",
          range: 3,
          strength: 2
        }
      ]
    },
    export var smallstation: IBuildingTemplate =
    {
      type: "smallstation",
      baseType: "building",
      categoryType: "station",
      title: "Small station",
      cost: 0,
      buildTime: 1,
      anchor: [0.5, 1],
      frame: ["smallstation.png"],
      canNotBuildOn: ["water", "building", "road"],
      underground: "tube_nesw",
      effects:
      [
        {
          type: "nearbyStation",
          range: 3,
          strength: 1
        }
      ]
    },
    export var parkinglot: IBuildingTemplate =
    {
      type: "parkinglot",
      baseType: "building",
      categoryType: "parking",
      title: "Parking lot",
      baseProfit: 1,
      daysForProfitTick: 1,
      cost: 25,
      buildTime: 7,
      anchor: [0.5, 1],
      frame: ["parkinglot.png"],
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "nearbyParking",
          range: 2,
          strength: 1
        }
      ]
    },
    export var stretchystore: IBuildingTemplate =
    {
      type: "stretchystore",
      baseType: "building",
      categoryType: "shopping",
      title: "Convenience store 2",
      size: [2,1],
      baseProfit: 13,
      daysForProfitTick: 1,
      cost: 20000,
      buildTime: 14,
      anchor: [0.5, 1],
      frame: ["stretchystore_f0.png", "stretchystore_f1.png"],
      icon: "stretchystore.png",
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "shoppingCompetition",
          range: 3,
          strength: 1
        },
        {
          type: "nearbyShopping",
          range: 3,
          strength: 1
        }
      ]
    },
    export var factory: IBuildingTemplate =
    {
      type: "factory",
      baseType: "building",
      categoryType: "factory",
      title: "Factory",
      baseProfit: 100,
      daysForProfitTick: 1,
      cost: 50000,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["factory.png"],
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "nearbyFactory",
          range: 4,
          strength: 1
        }
      ]
    },
    export var hotel: IBuildingTemplate =
    {
      type: "hotel",
      baseType: "building",
      categoryType: "hotel",
      title: "Hotel",
      baseProfit: 100,
      daysForProfitTick: 1,
      cost: 250000,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["hotel.png"],
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "nearbyHotel",
          range: 4,
          strength: 1
        },
        {
          type: "hotelCompetition",
          range: 3,
          strength: 1
        },
      ]
    },
    export var departmentStore: IBuildingTemplate =
    {
      type: "departmentStore",
      baseType: "building",
      categoryType: "shopping",
      title: "Department store",
      size: [1,2],
      baseProfit: 60,
      daysForProfitTick: 1,
      cost: 25000,
      buildTime: 21,
      anchor: [0.5, 1],
      frame: ["departmentstore_f0.png", "departmentstore_f1.png"],
      icon: "departmentstore.png",
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "shoppingCompetition",
          range: 3,
          strength: 2
        },
        {
          type: "nearbyShopping",
          range: 4,
          strength: 2
        }
      ]
    },
    export var soccerStadium: IBuildingTemplate =
    {
      type: "soccerStadium",
      baseType: "building",
      categoryType: "stadium",
      title: "Soccer stadium",
      size: [2,2],
      baseProfit: 60,
      daysForProfitTick: 1,
      cost: 25000,
      buildTime: 30,
      anchor: [0.5, 1],
      frame: ["soccerstadium_f0.png", "soccerstadium_f2.png",
        "soccerstadium_f1.png", "soccerstadium_f3.png"],
      icon: "soccerstadium.png",
      canNotBuildOn: ["water", "building", "road"],
      effects:
      [
        {
          type: "stadiumCompetition",
          range: 3,
          strength: 1
        },
        {
          type: "nearbyStadium",
          range: 2,
          strength: 1
        }
      ]
    }
  }
}