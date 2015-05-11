module CityGame
{
  export interface IContentTemplate
  {
    type: string;
    baseType: string;
    categoryType: string;
    title: string;
    anchor: number[];
    frame: string[];
    canBuildOn?: string[];
    canNotBuildOn?: string[];

    effects?: any; //refactortodo
  }
  export module Content
  {
    export var underConstruction: IContentTemplate =
    {
      type: "underConstruction",
      baseType: "underConstruction",
      anchor: [0.5, 1],
      frame: ["underconstruction.png"]
    }
    export var underPurchase: IContentTemplate =
    {
      type: "underPurchase",
      baseType: "underPurchase",
      anchor: [0.5, 1],
      frame: ["underpurchase.png"]
    }
  }
  export module Plants
  {
    export var tree1: IContentTemplate =
    {
      type: "tree1",
      baseType: "plant",
      anchor: [0.5, 1],
      frame: ["tree1.png"],
      canBuildOn: ["grass"],
      effects:
      [
        {
          type: "niceEnviroment",
          range: 2,
          strength: 1
        }
      ]
    }
    export var tree2: IContentTemplate =
    {
      type: "tree2",
      baseType: "plant",
      anchor: [0.5, 1],
      frame: ["tree2.png"],
      canBuildOn: ["grass"],
      effects:
      [
        {
          type: "niceEnviroment",
          range: 2,
          strength: 1
        }
      ]
    }
    export var tree3: IContentTemplate =
    {
      type: "tree3",
      baseType: "plant",
      anchor: [0.5, 1],
      frame: ["tree3.png"],
      canBuildOn: ["grass"],
      effects:
      [
        {
          type: "niceEnviroment",
          range: 2,
          strength: 1
        }
      ]
    }
    export var tree4: IContentTemplate =
    {
      type: "tree4",
      baseType: "plant",
      anchor: [0.5, 1],
      frame: ["tree4.png"],
      canBuildOn: ["grass"],
      effects:
      [
        {
          type: "niceEnviroment",
          range: 2,
          strength: 1
        }
      ]
    }
    export var tree5: IContentTemplate =
    {
      type: "tree5",
      baseType: "plant",
      anchor: [0.5, 1],
      frame: ["tree5.png"],
      canBuildOn: ["grass"],
      effects:
      [
        {
          type: "niceEnviroment",
          range: 2,
          strength: 1
        }
      ]
    }
  }
  export module Roads
  {
    export var road_h: IContentTemplate =
    {
      type: "road_h",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_h.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_v: IContentTemplate =
    {
      type: "road_v",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_v.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_ne: IContentTemplate =
    {
      type: "road_ne",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_ne.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_nw: IContentTemplate =
    {
      type: "road_nw",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_nw.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_sw: IContentTemplate =
    {
      type: "road_sw",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_sw.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_es: IContentTemplate =
    {
      type: "road_es",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_se.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_nesw: IContentTemplate =
    {
      type: "road_nesw",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_news.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_new: IContentTemplate =
    {
      type: "road_new",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_new.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_nsw: IContentTemplate =
    {
      type: "road_nsw",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_nsw.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_esw: IContentTemplate =
    {
      type: "road_esw",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_sew.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
    export var road_nes: IContentTemplate =
    {
      type: "road_nes",
      baseType: "road",
      categoryType: "road",
      title: "Road",
      anchor: [0.5, 1.0],
      frame: ["road_nse.png"],
      effects:
      [
        {
          type: "nearbyRoad",
          range: 1,
          strength: 1
        }
      ]
    }
  }
  export module Tubes
  {
    export var tube_h: IContentTemplate =
    {
      type: "tube_h",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_h.png"]
    }
    export var tube_v: IContentTemplate =
    {
      type: "tube_v",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_v.png"]
    }
    export var tube_ne: IContentTemplate =
    {
      type: "tube_ne",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_ne.png"]
    }
    export var tube_nw: IContentTemplate =
    {
      type: "tube_nw",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_nw.png"]
    }
    export var tube_sw: IContentTemplate =
    {
      type: "tube_sw",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_sw.png"]
    }
    export var tube_es: IContentTemplate =
    {
      type: "tube_es",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_se.png"]
    }
    export var tube_nesw: IContentTemplate =
    {
      type: "tube_nesw",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_news.png"]
    }
    export var tube_new: IContentTemplate =
    {
      type: "tube_new",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_new.png"]
    }
    export var tube_nsw: IContentTemplate =
    {
      type: "tube_nsw",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_nsw.png"]
    }
    export var tube_esw: IContentTemplate =
    {
      type: "tube_esw",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_sew.png"]
    }
    export var tube_nes: IContentTemplate =
    {
      type: "tube_nes",
      baseType: "tube",
      anchor: [0.5, 1.0],
      frame: ["tube_nse.png"]
    }
  }
}