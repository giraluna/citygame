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
      "flags": ["water"]
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
          "canBuildOn": ["grass"]
        },
        "tree2":
        {
          "type": "tree2",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree2.png",
          "canBuildOn": ["grass"]
        },
        "tree3":
        {
          "type": "tree3",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree3.png",
          "canBuildOn": ["grass"]
        },
        "tree4":
        {
          "type": "tree4",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree4.png",
          "canBuildOn": ["grass"]
        },
        "tree5":
        {
          "type": "tree5",
          "baseType": "plant",
          "anchor": [0.5, 1],
          "frame": "tree5.png",
          "canBuildOn": ["grass"]
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
        "frame": "road_h2.png"
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
    "buildings":
    {
      "house1":
      {
        "type": "house1",
        "baseType": "building",
        "categoryType": "apartment",
        "baseProfit": 1, 
        "cost": 25,
        "buildTime": 14,
        "anchor": [0.5, 1],
        "frame": "house1.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effect":
        {
          "type": "testModifier",
          "range": 2,
          "strength": 1
        }
      },
      "house2":
      {
        "type": "house2",
        "baseType": "building",
        "categoryType": "apartment",
        "baseProfit": 2, 
        "cost": 50,
        "buildTime": 21,
        "anchor": [0.5, 1],
        "frame": "house2.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effect":
        {
          "type": "testModifier",
          "range": 2,
          "strength": 1
        }
      },
      "house3":
      {
        "type": "house3",
        "baseType": "building",
        "categoryType": "apartment",
        "baseProfit": 1, 
        "cost": 25,
        "buildTime": 14,
        "anchor": [0.5, 1],
        "frame": "house3.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effect":
        {
          "type": "testModifier",
          "range": 2,
          "strength": 1
        }
      },
      "house4":
      {
        "type": "house4",
        "baseType": "building",
        "categoryType": "apartment",
        "baseProfit": 2, 
        "cost": 50,
        "buildTime": 21,
        "anchor": [0.5, 1],
        "frame": "house4.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effect":
        {
          "type": "testModifier",
          "range": 2,
          "strength": 1
        }
      },
      "house5":
      {
        "type": "house5",
        "baseType": "building",
        "categoryType": "apartment",
        "baseProfit": 2, 
        "cost": 50,
        "buildTime": 21,
        "anchor": [0.5, 1],
        "frame": "house5.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effect":
        {
          "type": "testModifier",
          "range": 2,
          "strength": 1
        }
      },
      "house6":
      {
        "type": "house6",
        "baseType": "building",
        "categoryType": "apartment",
        "baseProfit": 2, 
        "cost": 50,
        "buildTime": 21,
        "anchor": [0.5, 1],
        "frame": "house6.png",
        "canNotBuildOn": ["water", "building", "road"],
        "effect":
        {
          "type": "testModifier",
          "range": 2,
          "strength": 1
        }
      }
    }
  }
};

(function translateModifierEffects(target)
{
  for (var prop in target)
  {
    if (prop === "effect")
    {
      var e = target[prop];
      if (!cellModifiers[e.type]) console.error("Invalid effect defined on ",
        target)
      target.translatedEffect = cellModifiers[e.type].call(null,
        e.range, e.strength)
    }
    else if (typeof target[prop] === "object")
    {
      translateModifierEffects(target[prop])
    }
  }
}(cg));
