/// <reference path="../lib/pixi.d.ts" />

var Loader = (function () {
    function Loader(game) {
        this.loaded = {
            fonts: false,
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

        this.loadFonts();
        this.loadSprites();
    }
    Loader.prototype.loadFonts = function () {
        var self = this;
        WebFontConfig = {
            google: {
                families: ['Snippet']
            },
            active: function () {
                // do something
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
        PIXI.scaleModes.DEFAULT = 1; //nearest
        var self = this;
        var assetsToLoad = ["img\/sprites.json"];
        var loader = new PIXI.AssetLoader(assetsToLoad);
        loader.onComplete = function () {
            self.loaded.sprites = true;
            self.checkLoaded();
        };

        loader.load();
    };

    Loader.prototype.checkLoaded = function () {
        for (var prop in this.loaded) {
            if (!this.loaded[prop]) {
                return;
            }
        }
        var elapsed = window.performance.now() - this.startTime;
        console.log("loaded in " + Math.round(elapsed) + " ms");
        this.game.init();
    };
    return Loader;
})();
//# sourceMappingURL=loader.js.map
