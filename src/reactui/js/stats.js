/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../../data/js/levelupmodifiers.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
/// <reference path="js/modifierlist.d.ts" />
/// <reference path="js/statlist.d.ts" />
/// <reference path="js/employeelist.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Stats = React.createClass({
        mixins: [UIComponents.SplitMultilineText],
        render: function () {
            var player = this.props.player;

            var clicks = player.clicks;

            var prestigeModifier = 1;
            if (player.levelUpModifiers.prestigeEffectIncrease1) {
                prestigeModifier += 0.5;
            }
            var prestigeStats = [
                {
                    title: "Times reset:",
                    content: player.timesReset
                },
                {
                    title: "Prestige:",
                    content: player.prestige,
                    subContent: "for a total of " + (player.prestige * prestigeModifier) + "% " + "extra profit"
                },
                {
                    title: "Total experience across resets:",
                    content: player.totalResetExperience
                }
            ];
            var prestigeStatList = UIComponents.StatList({
                stats: prestigeStats,
                header: "Prestige"
            });

            var permModifiers = [];
            for (var i = 0; i < player.permanentLevelupUpgrades.length; i++) {
                permModifiers.push(levelUpModifiers[player.permanentLevelupUpgrades[i]]);
            }
            var permModifierList = UIComponents.ModifierList({
                ref: "permModifierList",
                modifiers: permModifiers
            });

            var perks = [];
            for (var _mod in player.levelUpModifiers) {
                if (player.permanentLevelupUpgrades.indexOf(_mod) > -1)
                    continue;
                else
                    perks.push(player.levelUpModifiers[_mod]);
            }
            var perkList = UIComponents.ModifierList({
                ref: "perkList",
                modifiers: perks
            });

            var unlocks = [];
            for (var _mod in player.modifiers) {
                unlocks.push(player.modifiers[_mod]);
            }
            var unlockList = UIComponents.ModifierList({
                ref: "unlockList",
                modifiers: unlocks
            });

            var employeeList = UIComponents.EmployeeList({
                ref: "employeeList",
                employees: player.employees
            });

            return (React.DOM.div({ className: "all-stats" }, prestigeStatList, React.DOM.div({ className: "stat-group" }, React.DOM.div({ className: "stat-header" }, "Permanent perks"), permModifierList), React.DOM.div({ className: "stat-group" }, React.DOM.div({ className: "stat-header" }, "Unlocked perks"), perkList), React.DOM.div({ className: "stat-group" }, React.DOM.div({ className: "stat-header" }, "Upgrades"), unlockList), React.DOM.div({ className: "stat-group" }, React.DOM.div({ className: "stat-header" }, "Employees"), employeeList)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=stats.js.map
