var cg = {
    "terrain": {
        "grass": {
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
        "water": {
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
        "sand": {
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
        "snow": {
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
    "content": {
        "tree": {
            "type": "tree",
            "width": 16,
            "height": 32,
            "anchor": [0.5, 1.5],
            "texture": "img\/tree.png"
        },
        "cactus": {
            "type": "cactus",
            "width": 16,
            "height": 32,
            "anchor": [0.5, 1.5],
            "texture": "img\/cactus.png"
        },
        "tentacle": {
            "type": "tentacle",
            "width": 16,
            "height": 32,
            "anchor": [0.5, 1.5],
            "texture": "img\/tentacle.png"
        },
        "snowman": {
            "type": "snowman",
            "width": 32,
            "height": 64,
            "anchor": [0.5, 1.25],
            "texture": "img\/snowman.png"
        },
        "house": {
            "type": "house",
            "width": 64,
            "height": 44,
            "anchor": [0.5, 1],
            "texture": "img\/house.png"
        },
        "pineapple": {
            "type": "pineapple",
            "width": 24,
            "height": 56,
            "anchor": [0.5, 1.13],
            "texture": "img\/pineapple2.png"
        }
    }
};
function checkImage(url) {
    var req = new XMLHttpRequest();
    req.open('HEAD', url, false);
    req.send();
    return req.status == 200;
}
function githubifyUrls() {
    for (var category in cg) {
        for (var sprite in cg[category]) {
            sprite = cg[category][sprite];
            sprite["texture"] = "citygame/" + sprite["texture"];
        }
    }
}
(function () {
    var github = checkImage("citygame/" + cg.terrain.grass.texture);
    console.log("github", github);
    if (github) {
        githubifyUrls();
    }
}());

cg = JSON.parse(JSON.stringify(cg)); //dumb

var map = {
    "mapKey": {
        "0": "grass",
        "1": "water"
    },
    "map": [
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
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
};

map = JSON.parse(JSON.stringify(map));
//# sourceMappingURL=cg.js.map
