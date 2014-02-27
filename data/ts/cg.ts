var cg =
{
  "terrain":
  {
    "grass":
    {
      "type": "grass",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1],
      "texture": "img\/grass.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "plant": "tree",
      "buildable": true
    },
    "water":
    {
      "type": "water",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1],
      "texture": "img\/water.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "plant": "tentacle",
      "buildable": false
    },
    "sand":
    {
      "type": "sand",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1],
      "texture": "img\/sand.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "plant": "cactus",
      "buildable": true
    },
    "snow":
    {
      "type": "snow",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1],
      "texture": "img\/snow.png",
      "interactive": true,
      "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
      "plant": "snowman",
      "buildable": true
    }
  },
  "content":
  {
    "tree":
    {
      "type": "tree",
      "type2": "plant",
      "width": 16,
      "height": 32,
      "anchor": [0.5, 1.5],
      "texture": "img\/tree.png",
    },
    "cactus":
    {
      "type": "cactus",
      "type2": "plant",
      "width": 16,
      "height": 32,
      "anchor": [0.5, 1.5],
      "texture": "img\/cactus.png",
    },
    "tentacle":
    {
      "type": "tentacle",
      "type2": "plant",
      "width": 16,
      "height": 32,
      "anchor": [0.5, 1.5],
      "texture": "img\/tentacle.png",
    },
    "snowman":
    {
      "type": "snowman",
      "type2": "plant",
      "width": 32,
      "height": 64,
      "anchor": [0.5, 1.25],
      "texture": "img\/snowman.png",
    },
    "house":
    {
      "type": "house",
      "type2": "building",
      "width": 64,
      "height": 44,
      "anchor": [0.5, 1],
      "texture": "img\/house.png",
    },
    "road_h":
    {
      "type": "road_h",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_h2.png"
    },
    "road_v":
    {
      "type": "road_v",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_v.png"
    },
    "road_ne":
    {
      "type": "road_ne",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_ne.png"
    },
    "road_nw":
    {
      "type": "road_nw",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_nw.png"
    },
    "road_sw":
    {
      "type": "road_sw",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_sw.png"
    },
    "road_es":
    {
      "type": "road_es",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_se.png"
    },
    "road_nesw":
    {
      "type": "road_nesw",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_news.png"
    },
    "road_new":
    {
      "type": "road_new",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_new.png"
    },
    "road_nsw":
    {
      "type": "road_nsw",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_nsw.png"
    },
    "road_esw":
    {
      "type": "road_esw",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_sew.png"
    },
    "road_nes":
    {
      "type": "road_nes",
      "type2": "road",
      "width": 64,
      "height": 32,
      "anchor": [0.5, 1.0],
      "texture": "img\/road_nse.png"
    }
  }
};
//ignore
/* 
function checkImage(url)
{
  var req = new XMLHttpRequest();
  req.open('HEAD', url, false);
  req.send();
  return req.status==200;
}
function githubifyUrls()
{
  for (var category in cg)
  {
    for (var sprite in cg[category])
    {
      sprite = cg[category][sprite];
      sprite["texture"] = "citygame/" + sprite["texture"];
    }
  }
}
(function()
{
  var github = checkImage("citygame/" + cg.terrain.grass.texture);
  console.log(github);
  if (github)
  {
    //githubifyUrls();
  }

}());
*/


cg = JSON.parse(JSON.stringify(cg)); //dumb

var map =
{
  "mapKey":
  {
    "0": "grass",
    "1": "water"
  },
  "map":
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
}

map = JSON.parse(JSON.stringify(map));