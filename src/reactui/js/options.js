/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/optionlist.d.ts" />
///
/// <reference path="../js/options.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.OptionsPopup = React.createClass({
        toggleSelf: function () {
            eventManager.dispatchEvent({ type: "toggleFullScreenPopup", content: null });
        },
        handleImport: function () {
            var imported = this.refs.importTextArea.getDOMNode().value;
            var decoded = LZString.decompressFromBase64(imported);

            localStorage.setItem("tempImported", decoded);

            eventManager.dispatchEvent({ type: "loadGame", content: "tempImported" });

            localStorage.removeItem("tempImported");
        },
        handleExport: function () {
            eventManager.dispatchEvent({ type: "saveGame", content: "tempImported" });

            var encoded = LZString.compressToBase64(localStorage.getItem("tempImported"));
            this.refs.importTextArea.getDOMNode().value = encoded;

            localStorage.removeItem("tempImported");
        },
        render: function () {
            var allOptions = [];

            var importExport = [
                {
                    content: React.DOM.div({ id: "import-export-container" }, React.DOM.div({ id: "import-export-buttons" }, React.DOM.button({
                        id: "import-button",
                        onClick: this.handleImport,
                        onTouchStart: this.handleImport
                    }, "Import"), React.DOM.button({
                        id: "export-button",
                        onClick: this.handleExport,
                        onTouchStart: this.handleExport
                    }, "Export")), React.DOM.textarea({ id: "import-export-text", ref: "importTextArea" }))
                }
            ];
            var importExportList = UIComponents.OptionList({
                options: importExport,
                header: "Import & Export",
                key: "importExportList"
            });

            allOptions.push(importExportList);

            var visualOptions = [
                {
                    content: React.DOM.div(null, React.DOM.input({
                        type: "checkbox",
                        id: "draw-click-popups",
                        name: "draw-click-popups",
                        defaultChecked: Options.drawClickPopups,
                        onChange: function () {
                            eventManager.dispatchEvent({
                                type: "toggleDrawClickPopups", content: ""
                            });
                        }
                    }), React.DOM.label({
                        htmlFor: "draw-click-popups"
                    }, "Draw click popups"))
                }
            ];
            var visualOptionList = UIComponents.OptionList({
                options: visualOptions,
                header: "Visual & Performance",
                key: "visualOptionList"
            });

            allOptions.push(visualOptionList);

            return (React.DOM.div({ className: "all-options" }, React.DOM.a({
                id: "close-info", className: "close-popup", href: "#",
                onClick: this.toggleSelf,
                onTouchStart: this.toggleSelf
            }, "X"), allOptions));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=options.js.map
