module CityGame
{
  export interface ITerrainTemplate
  {
    type: string;
    anchor: number[];
    frame: string;
    interactive: boolean;
    hitArea: number[][];
    flags: string[];

    effects: any; //refactortodo
  }
  export module Terrain
  {
    export var grass =
    {
      type: "grass",
      anchor: [0.5, 1],
      frame: "grass2.png",
      interactive: true,
      hitArea: [[0, -32], [32, -16], [0, 0], [-32, -16]],
      flags: ["ground", "grass"]
    }
    export var water =
    {
      type: "water",
      anchor: [0.5, 1],
      frame: "water.png",
      interactive: true,
      hitArea: [[0, -32], [32, -16], [0, 0], [-32, -16]],
      flags: ["water"],
      effects:
      [
        {
          type: "niceEnviroment",
          range: 2,
          strength: 1
        }
      ]
    }
    export var sand =
    {
      type: "sand",
      anchor: [0.5, 1],
      frame: "sand.png",
      interactive: true,
      hitArea: [[0, -32], [32, -16], [0, 0], [-32, -16]],
      flags: ["ground", "sand"]
    }
    export var snow =
    {
      type: "snow",
      anchor: [0.5, 1],
      frame: "snow.png",
      interactive: true,
      hitArea: [[0, -32], [32, -16], [0, 0], [-32, -16]],
      flags: ["ground", "snow"]
    }
  }
}
