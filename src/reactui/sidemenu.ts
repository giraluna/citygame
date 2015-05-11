/// <reference path="../../lib/react.d.ts" />

/// <reference path="sidemenubuildings.ts" />
/// <reference path="sidemenuzoom.ts" />
/// <reference path="sidemenumapmode.ts" />
/// <reference path="sidemenusave.ts" />
/// <reference path="sidemenustats.ts" />
/// <reference path="sidemenutools.ts" />
/// <reference path="sidemenumodifierbutton.ts" />

module UIComponents
{

export var SideMenu = React.createClass(
{
  getInitialState: function()
  {
    return {selectedTool: null};
  },
  setSelectedTool: function(type)
  {
    this.setState({selectedTool: type});
  },
  render: function()
  {

    return(
      React.DOM.div( {id:"react-side-menu"},
        UIComponents.SideMenuTools(
          {
            player: this.props.player,
            setSelectedTool: this.setSelectedTool,
            selectedTool: this.state.selectedTool
          }
        ),
        UIComponents.SideMenuBuildings(
          {
            player: this.props.player,
            frameImages: this.props.frameImages,
            setSelectedTool: this.setSelectedTool,
            selectedTool: this.state.selectedTool,
            // Todo react definitions
            beautifyIndex: null,
            lastSelectedBuilding: null
          }
        ),

        React.DOM.div( {id:"side-menu-other-buttons", className:"grid-column"}, 
          UIComponents.SideMenuSave(),
          UIComponents.SideMenuMapmode(),
          UIComponents.SideMenuZoom()

        ),
        UIComponents.SideMenuStats(
          {
            player: this.props.player,
            // Todo react definitions
            hasLevelUpUpgrade: null,
            lastModifierCount: null
          }
        ),
        UIComponents.SideMenuModifierButton(
          {
            player: this.props.player,
            // Todo react definitions
            hasNewModifier: null,
            lastModifierCount: null
          }
        )

      )
    );
  }
});

}