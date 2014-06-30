/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/sidemenu.d.ts" />
/// <reference path="js/stats.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Stage = React.createClass({
        getInitialState: function () {
            return { showStats: false };
        },
        componentDidMount: function () {
            var self = this;
            eventManager.addEventListener("toggleStats", function () {
                self.setState({ showStats: !self.state.showStats });
            });
        },
        render: function () {
            var self = this;
            var popups = [];
            for (var _popup in this.props.popups) {
                var popup = this.props.popups[_popup];
                popups.push(UIComponents[popup.type].call(null, popup.props));
            }
            ;

            var stats = this.state.showStats ? React.DOM.div({ id: "stats-container", className: "fullscreen-popup" }, UIComponents.Stats({ player: this.props.player })) : null;

            return (React.DOM.div({ id: "react-wrapper" }, React.DOM.div({
                id: "react-popups",
                onDragEnter: function (e) {
                    e.preventDefault();
                },
                onDragOver: function (e) {
                    e.preventDefault();
                },
                onDrop: function (e) {
                    e.preventDefault();
                },
                onDragLeave: function (e) {
                    e.preventDefault();
                }
            }, popups), stats, UIComponents.SideMenu({
                player: this.props.player,
                frameImages: this.props.frameImages,
                // todo react definitions
                selectedTool: null
            })));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=stage.js.map
