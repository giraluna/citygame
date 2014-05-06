/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/utility.d.ts" />

var Loader = (function () {
    function Loader(game) {
        this.loaded = {
            fonts: true,
            //fonts: false,
            sprites: false,
            dom: false
        };
        var self = this;
        this.startTime = window.performance.now();
        this.game = game;
        document.addEventListener('DOMContentLoaded', function () {
            self.loaded.dom = true;
            self.checkLoaded();
        });

        //PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
        this.loadFonts();
        this.loadSprites();
    }
    Loader.prototype.loadFonts = function () {
        // TODO
        return;
        var self = this;
        WebFontConfig = {
            google: {
                families: ['Snippet']
            },
            active: function () {
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
    };
    Loader.prototype.loadSprites = function () {
        var self = this;
        var loader = new PIXI.JsonLoader("img\/sprites.json");
        loader.addEventListener("loaded", function (event) {
            self.spriteImages = spritesheetToImages(event.content.json, event.content.baseUrl);
            self.loaded.sprites = true;
            self.checkLoaded();
        });

        loader.load();
    };

    Loader.prototype.checkLoaded = function () {
        for (var prop in this.loaded) {
            if (!this.loaded[prop]) {
                return;
            }
        }
        this.game.frameImages = this.spriteImages;
        this.game.init();
        var elapsed = window.performance.now() - this.startTime;
        console.log("loaded in " + Math.round(elapsed) + " ms");
    };
    return Loader;
})();
//# sourceMappingURL=loader.js.map
