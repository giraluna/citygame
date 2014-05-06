/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/utility.d.ts" />

declare var WebFont:any;
declare var WebFontConfig:any;


class Loader
{
  loaded: any =
  {
    fonts: true,
    //fonts: false,
    sprites: false,
    dom: false
  };
  game:any;
  startTime: number;
  spriteImages: {[id: string]: HTMLImageElement;};

  constructor(game)
  {
    var self = this;
    this.startTime = window.performance.now();
    this.game = game;
    document.addEventListener('DOMContentLoaded', function()
    {
      self.loaded.dom = true;
      self.checkLoaded();
    });
    //PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

    this.loadFonts();
    this.loadSprites();
  }

  loadFonts()
  {
    // TODO
    return;
    var self = this;
    WebFontConfig = {
      google: {
        families: ['Snippet']
      },
      active: function ()
      {
        self.loaded.fonts = true;
        self.checkLoaded();
      }
    };
    (function () {
      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = true;
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();


  }
  loadSprites()
  {
    var self = this;
    var loader = new PIXI.JsonLoader("img\/sprites.json");
    loader.addEventListener("loaded", function(event)
    {
      self.spriteImages = spritesheetToImages(event.content.json, event.content.baseUrl);
      self.loaded.sprites = true;
      self.checkLoaded();
    });

    loader.load();
  }

  checkLoaded()
  {
    for (var prop in this.loaded)
    {
      if (!this.loaded[prop])
      {
        return;
      }
    }
    this.game.frameImages = this.spriteImages;
    this.game.init();
    var elapsed = window.performance.now() - this.startTime;
    console.log("loaded in " + Math.round(elapsed) + " ms" );
  }
}