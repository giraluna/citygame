/// <reference path="js/cellmodifiers.d.ts" />

var cg: any =
{
  "terrain":
  {
    "grass":
    {
      "type": "grass",
      "anchor": [0.5, 1],
      "frame": "grass.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "flags": ["ground", "grass"]
    },
    "water":
    {
      "type": "water",
      "anchor": [0.5, 1],
      "frame": "water.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "flags": ["water"],
      "effects":
      [
        {
          "type": "niceEnviroment",
          "range": 2,
          "strength": 1
        }
      ]
    },
    "sand":
    {
      "type": "sand",
      "anchor": [0.5, 1],
      "frame": "sand.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "flags": ["ground", "sand"]
    },
    "snow":
    {
      "type": "snow",
      "anchor": [0.5, 1],
      "frame": "snow.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "flags": ["ground", "snow"]
    }
  },
  "content":
  {
    "plants":
    {
      "grass":
      {
        "tree1":
        {
          "type": "tree1",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree1.png",
          "canBuildOn": ["grass"],
          "effects":
          [
            {
              "type": "niceEnviroment",
              "range": 2,
              "strength": 1
            }
          ]
        },
        "tree2":
        {
          "type": "tree2",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree2.png",
          "canBuildOn": ["grass"],
          "effects":
          [
            {
              "type": "niceEnviroment",
              "range": 2,
              "strength": 1
            }
          ]
        },
        "tree3":
        {
          "type": "tree3",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree3.png",
          "canBuildOn": ["grass"],
          "effects":
          [
            {
              "type": "niceEnviroment",
              "range": 2,
              "strength": 1
            }
          ]
        },
        "tree4":
        {
          "type": "tree4",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree4.png",
          "canBuildOn": ["grass"],
          "effects":
          [
            {
              "type": "niceEnviroment",
              "range": 2,
              "strength": 1
            }
          ]
        },
        "tree5":
        {
          "type": "tree5",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree5.png",
          "canBuildOn": ["grass"],
          "effects":
          [
            {
              "type": "niceEnviroment",
              "range": 2,
              "strength": 1
            }
          ]
        },
      },
      "sand":
      {
        "cactus":
        {
          "type": "cactus",
          "baseType": "plant",
          "anchor": [0.5, 1.5],
          "frame": "cactus.png",
          "canBuildOn": ["sand"]
        }
      },
      "water":
      {
        "tentacle":
        {
          "type": "tentacle",
          "baseType": "plant",
          "anchor": [0.5, 1.5],
          "frame": "tentacle.png",
          "canBuildOn": ["water"]
        }
      },
      "snow":
      {
        "snowman":
        {
          "type": "snowman",
          "baseType": "plant",
          "anchor": [0.5, 1.25],
          "frame": "snowman.png",
          "canBuildOn": ["snow"]
        }
      }
    },
    "roads":
    {
      "road_h":
      {
        "type": "road_h",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_h.png"
      },
      "road_v":
      {
        "type": "road_v",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_v.png"
      },
      "road_ne":
      {
        "type": "road_ne",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_ne.png"
      },
      "road_nw":
      {
        "type": "road_nw",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_nw.png"
      },
      "road_sw":
      {
        "type": "road_sw",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_sw.png"
      },
      "road_es":
      {
        "type": "road_es",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_se.png"
      },
      "road_nesw":
      {
        "type": "road_nesw",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_news.png"
      },
      "road_new":
      {
        "type": "road_new",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_new.png"
      },
      "road_nsw":
      {
        "type": "road_nsw",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_nsw.png"
      },
      "road_esw":
      {
        "type": "road_esw",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_sew.png"
      },
      "road_nes":
      {
        "type": "road_nes",
        "baseType": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_nse.png"
      }
    },
    "tubes":
    {
      "tube_h":
      {
        "type": "tube_h",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_h.png"
      },
      "tube_v":
      {
        "type": "tube_v",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_v.png"
      },
      "tube_ne":
      {
        "type": "tube_ne",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_ne.png"
      },
      "tube_nw":
      {
        "type": "tube_nw",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_nw.png"
      },
      "tube_sw":
      {
        "type": "tube_sw",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_sw.png"
      },
      "tube_es":
      {
        "type": "tube_es",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_se.png"
      },
      "tube_nesw":
      {
        "type": "tube_nesw",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_news.png"
      },
      "tube_new":
      {
        "type": "tube_new",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_new.png"
      },
      "tube_nsw":
      {
        "type": "tube_nsw",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_nsw.png"
      },
      "tube_esw":
      {
        "type": "tube_esw",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_sew.png"
      },
      "tube_nes":
      {
        "type": "tube_nes",
        "baseType": "tube",
        "anchor": [0.5, 1.0],
        "frame": "tube_nse.png"
      }
    },
    "buildings":
    {
      "house1":
      {
        "type": "house1",
        "baseType": "building",
        "categoryType": "apartment",
        "translate": "Apartment 1",
        "baseProfit": 1.2,
        "daysForProfitTick": 30,
        "cost": 25,
        "buildTime": 14,
        "anchor": [0.5, 1],
        "frame": "house1.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effects":
        [
          {
            "type": "crowded",
            "range": 1,
            "strength": 1
          },
          {
            "type": "population",
            "range": 2,
            "strength": 1
          }
        ]
      },
      "house2":
      {
        "type": "house2",
        "baseType": "building",
        "categoryType": "apartment",
        "translate": "Apartment 2",
        "baseProfit": 2.5,
        "daysForProfitTick": 30,
        "cost": 50,
        "buildTime": 21,
        "anchor": [0.5, 1],
        "frame": "house2.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effects":
        [
          {
            "type": "crowded",
            "range": 2,
            "strength": 2
          },
          {
            "type": "population",
            "range": 2,
            "strength": 2
          }
        ]
      },
      "house3":
      {
        "type": "house3",
        "baseType": "building",
        "categoryType": "apartment",
        "translate": "Apartment 3",
        "baseProfit": 1.2,
        "daysForProfitTick": 30,
        "cost": 25,
        "buildTime": 14,
        "anchor": [0.5, 1],
        "frame": "house3.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effects":
        [
          {
            "type": "crowded",
            "range": 1,
            "strength": 1
          },
          {
            "type": "population",
            "range": 2,
            "strength": 1
          }
        ]
      },
      "house4":
      {
        "type": "house4",
        "baseType": "building",
        "categoryType": "apartment",
        "translate": "Apartment 4",
        "baseProfit": 2.5,
        "daysForProfitTick": 30,
        "cost": 50,
        "buildTime": 21,
        "anchor": [0.5, 1],
        "frame": "house4.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effects":
        [
          {
            "type": "crowded",
            "range": 2,
            "strength": 2
          },
          {
            "type": "population",
            "range": 2,
            "strength": 2
          }
        ]
      },
      "house5":
      {
        "type": "house5",
        "baseType": "building",
        "categoryType": "apartment",
        "translate": "Apartment 5",
        "baseProfit": 2.5,
        "daysForProfitTick": 30,
        "cost": 50,
        "buildTime": 21,
        "anchor": [0.5, 1],
        "frame": "house5.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effects":
        [
          {
            "type": "crowded",
            "range": 2,
            "strength": 2
          },
          {
            "type": "population",
            "range": 2,
            "strength": 2
          }
        ]
      },
      "house6":
      {
        "type": "house6",
        "baseType": "building",
        "categoryType": "apartment",
        "translate": "Apartment 6",
        "baseProfit": 2.5,
        "daysForProfitTick": 30,
        "cost": 50,
        "buildTime": 21,
        "anchor": [0.5, 1],
        "frame": "house6.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effects":
        [
          {
            "type": "crowded",
            "range": 2,
            "strength": 2
          },
          {
            "type": "population",
            "range": 2,
            "strength": 2
          }
        ]
      },
      "fastfood":
      {
        "type": "fastfood",
        "baseType": "building",
        "categoryType": "fastfood",
        "translate": "Fast food restaurant",
        "baseProfit": 1,
        "daysForProfitTick": 1,
        "cost": 25,
        "buildTime": 14,
        "anchor": [0.5, 1],
        "frame": "fastfood.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effects":
        [
          {
            "type": "fastfoodCompetition",
            "range": 3,
            "strength": 1
          }
        ]
      },
      "conveniencestore":
      {
        "type": "conveniencestore",
        "baseType": "building",
        "categoryType": "shopping",
        "translate": "Convenience store",
        "baseProfit": 1,
        "daysForProfitTick": 1,
        "cost": 25,
        "buildTime": 14,
        "anchor": [0.5, 1],
        "frame": "conveniencestore.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effects":
        [
          {
            "type": "shoppingCompetition",
            "range": 2,
            "strength": 1
          },
          {
            "type": "nearbyShopping",
            "range": 2,
            "strength": 1
          }
        ]
      },
      "smalloffice":
      {
        "type": "smalloffice",
        "baseType": "building",
        "categoryType": "office",
        "translate": "Small office",
        "baseProfit": 3,
        "daysForProfitTick": 90,
        "cost": 50,
        "buildTime": 14,
        "anchor": [0.5, 1],
        "frame": "smalloffice.png",
        "canNotBuildOn": ["water", "building", "road"]
      },
      "smallstation":
      {
        "type": "smallstation",
        "baseType": "building",
        "categoryType": "station",
        "translate": "Small station",
        "cost": 0,
        "buildTime": 1,
        "anchor": [0.5, 1],
        "frame": "smallstation.png",
        "canNotBuildOn": ["water", "building", "road"],
        "underground": "tube_nesw",
        "effects":
        [
          {
            "type": "nearbyStation",
            "range": 3,
            "strength": 1
          }
        ]
      }
    }
  }
};

function findType(typeName: string, target: any = cg)
{
  for (var prop in target)
  {
    if (target[prop].type === typeName)
    {
      return target[prop]
    }
    else if (typeof target[prop] === "object" && !target[prop].type)
    {
      var matchFound = findType(typeName, target[prop])
      if (matchFound) return matchFound;
    }
  }
};

(function translateModifierEffects(target)
{
  for (var prop in target)
  {
    if (prop === "effects")
    {
      var newEffects = [];
      for (var i = 0; i < target.effects.length; i++)
      {
        var e = target.effects[i];
        if (!cellModifiers[e.type]) console.error("Invalid effect defined on ",
          target)

        var translated = cellModifiers[e.type].call(null,
          e.range, e.strength)

        translated.scaling = translated.scaling ||
          function(strength)
          {
            return 1+Math.log(strength);
          };

        newEffects.push(translated);
      }
      target.translatedEffects = newEffects;
    }
    else if (typeof target[prop] === "object")
    {
      translateModifierEffects(target[prop])
    }
  }
}(cg));
