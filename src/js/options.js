/// <reference path="js/eventlistener.d.ts" />
var Options;
(function (Options) {
    Options.drawClickPopups = true;
    eventManager.addEventListener("toggleDrawClickPopups", function () {
        Options.drawClickPopups = !Options.drawClickPopups;
        eventManager.dispatchEvent({ type: "saveOptions", content: null });
    });

    Options.autosaveLimit = 3;
    eventManager.addEventListener("setAutosaveLimit", function (e) {
        Options.autosaveLimit = e.content;
        eventManager.dispatchEvent({ type: "saveOptions", content: null });
    });
})(Options || (Options = {}));
//# sourceMappingURL=options.js.map
