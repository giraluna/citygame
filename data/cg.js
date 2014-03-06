var cg =
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
      "buildable": true
    },
    "water":
    {
      "type": "water",
      "anchor": [0.5, 1],
      "frame": "water.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "buildable": false
    },
    "sand":
    {
      "type": "sand",
      "anchor": [0.5, 1],
      "frame": "sand.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "buildable": true
    },
    "snow":
    {
      "type": "snow",
      "anchor": [0.5, 1],
      "frame": "snow.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "buildable": true
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
          "type2": "plant",
          "anchor": [0.5, 1],
          "frame": "tree1.png",
        },
        "tree2":
        {
          "type": "tree2",
          "type2": "plant",
          "anchor": [0.5, 1],
          "frame": "tree2.png",
        },
        "tree3":
        {
          "type": "tree3",
          "type2": "plant",
          "anchor": [0.5, 1],
          "frame": "tree3.png",
        },
        "tree4":
        {
          "type": "tree4",
          "type2": "plant",
          "anchor": [0.5, 1],
          "frame": "tree4.png",
        },
        "tree5":
        {
          "type": "tree5",
          "type2": "plant",
          "anchor": [0.5, 1],
          "frame": "tree5.png",
        },
      },
      "sand":
      {
        "cactus":
        {
          "type": "cactus",
          "type2": "plant",
          "anchor": [0.5, 1.5],
          "frame": "cactus.png",
        }
      },
      "water":
      {
        "tentacle":
        {
          "type": "tentacle",
          "type2": "plant",
          "anchor": [0.5, 1.5],
          "frame": "tentacle.png",
        }
      },
      "snow":
      {
        "snowman":
        {
          "type": "snowman",
          "type2": "plant",
          "anchor": [0.5, 1.25],
          "frame": "snowman.png",
        }
      }
    },
    "roads":
    {
      "road_h":
      {
        "type": "road_h",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_h2.png"
      },
      "road_v":
      {
        "type": "road_v",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_v.png"
      },
      "road_ne":
      {
        "type": "road_ne",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_ne.png"
      },
      "road_nw":
      {
        "type": "road_nw",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_nw.png"
      },
      "road_sw":
      {
        "type": "road_sw",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_sw.png"
      },
      "road_es":
      {
        "type": "road_es",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_se.png"
      },
      "road_nesw":
      {
        "type": "road_nesw",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_news.png"
      },
      "road_new":
      {
        "type": "road_new",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_new.png"
      },
      "road_nsw":
      {
        "type": "road_nsw",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_nsw.png"
      },
      "road_esw":
      {
        "type": "road_esw",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_sew.png"
      },
      "road_nes":
      {
        "type": "road_nes",
        "type2": "road",
        "anchor": [0.5, 1.0],
        "frame": "road_nse.png"
      }
    },
    "buildings":
    {
      "house1":
      {
        "type": "house1",
        "type2": "building",
        "anchor": [0.5, 1],
        "frame": "house1.png"
      },
      "house2":
      {
        "type": "house2",
        "type2": "building",
        "anchor": [0.5, 1],
        "frame": "house2.png"
      },
      "house3":
      {
        "type": "house3",
        "type2": "building",
        "anchor": [0.5, 1],
        "frame": "house3.png"
      },
      "house4":
      {
        "type": "house4",
        "type2": "building",
        "anchor": [0.5, 1],
        "frame": "house4.png"
      },
      "house5":
      {
        "type": "house5",
        "type2": "building",
        "anchor": [0.5, 1],
        "frame": "house5.png"
      },
      "house6":
      {
        "type": "house6",
        "type2": "building",
        "anchor": [0.5, 1],
        "frame": "house6.png"
      }
    }
  }
};
