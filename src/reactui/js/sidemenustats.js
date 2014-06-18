/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuStats = React.createClass({
        componentDidMount: function () {
            var money = this.refs.money.getDOMNode();
            var exp = this.refs.exp.getDOMNode();
            var expText = this.refs.expText.getDOMNode();

            eventManager.addEventListener("updatePlayerMoney", function (event) {
                money.innerHTML = event.content;
            });

            eventManager.addEventListener("updatePlayerExp", function (event) {
                var levelString = "Level   " + event.content.level + " " + event.content.experience + " / " + event.content.nextLevel + " [" + event.content.percentage + "%]";

                exp.value = event.content.percentage;
                expText.innerHTML = levelString;
            });

            // forces update, kinda dumb
            this.props.player.addMoney(0);
        },
        render: function () {
            return (React.DOM.div({ id: "side-menu-stats" }, React.DOM.div({ id: "player-level-wrapper" }, React.DOM.progress({
                id: "player-level",
                ref: "exp",
                value: 0,
                max: 100
            }), React.DOM.span({
                id: "player-level-text",
                ref: "expText"
            }, null)), React.DOM.div({ ref: "money" }, 0)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenustats.js.map
