/// <reference path="js/eventlistener.d.ts" />
var Options;
(function (Options) {
    Options.drawClickPopups = true;
    eventManager.addEventListener("toggleDrawClickPopups", function () {
        Options.drawClickPopups = !Options.drawClickPopups;
    });
})(Options || (Options = {}));
//# sourceMappingURL=options.js.map
