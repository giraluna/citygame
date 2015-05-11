/// <reference path="game.ts" />
/// <reference path="loader.ts" />

module CityGame
{
  export var TILE_WIDTH = 64,
      TILE_HEIGHT = 32,
      SCREEN_WIDTH = 0,
      SCREEN_HEIGHT = 0,
      SPRITE_HEIGHT = 31,
      TILES = 32,
      WORLD_WIDTH = TILES * TILE_WIDTH,
      WORLD_HEIGHT = TILES * TILE_HEIGHT,
      ZOOM_LEVELS = [1],
      AMT_OF_BOARDS = 1;

  export var game = new CityGame.Game();
  export var loader = new CityGame.Loader(game);
}


