/// <reference path="../../lib/react.d.ts" />
/// <reference path="js/sidemenubuildings.d.ts" />
/// <reference path="js/sidemenuzoom.d.ts" />
/// <reference path="js/sidemenusave.d.ts" />
/// <reference path="js/sidemenustats.d.ts" />
/// <reference path="js/sidemenutools.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenu = React.createClass({
        getInitialState: function () {
            return { selectedTool: null };
        },
        setSelectedTool: function (type) {
            this.setState({ selectedTool: type });
        },
        render: function () {
            return (React.DOM.div({ id: "react-side-menu" }, UIComponents.SideMenuTools({
                setSelectedTool: this.setSelectedTool,
                selectedTool: this.state.selectedTool
            }), UIComponents.SideMenuBuildings({
                player: this.props.player,
                frameImages: this.props.frameImages,
                setSelectedTool: this.setSelectedTool,
                selectedTool: this.state.selectedTool
            }), React.DOM.div({ id: "side-menu-other-buttons", className: "grid-column" }, UIComponents.SideMenuSave(), UIComponents.SideMenuZoom()), UIComponents.SideMenuStats({ player: this.props.player })));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenu.js.map
