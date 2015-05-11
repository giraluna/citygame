/// <reference path="game.ts" />
/// <reference path="loader.ts" />

var TILE_WIDTH = 64,
    TILE_HEIGHT = 32,
    SPRITE_HEIGHT = 31,
    TILES = 32,
    WORLD_WIDTH = TILES * TILE_WIDTH,
    WORLD_HEIGHT = TILES * TILE_HEIGHT,
    ZOOM_LEVELS = [1],
    AMT_OF_BOARDS = 1;

var game = new CityGame.Game();
var loader = new CityGame.Loader(game);
