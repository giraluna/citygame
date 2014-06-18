/// <reference path="../../lib/react.d.ts" />

/// <reference path="js/sidemenubuildings.d.ts" />
/// <reference path="js/sidemenuzoom.d.ts" />
/// <reference path="js/sidemenusave.d.ts" />
/// <reference path="js/sidemenustats.d.ts" />
/// <reference path="js/sidemenutools.d.ts" />

module UIComponents
{

export var SideMenu = React.createClass(
{
  render: function()
  {

    return(
      React.DOM.div( {id:"react-side-menu"},
        UIComponents.SideMenuTools(),
        UIComponents.SideMenuBuildings(
          {
            player: this.props.player,
            frameImages: this.props.frameImages
          }
        ),

        React.DOM.div( {id:"side-menu-other-buttons", className:"grid-column"}, 
          UIComponents.SideMenuSave(),
          UIComponents.SideMenuZoom()

        ),
        UIComponents.SideMenuStats({player: this.props.player})

      )
    );
  }
});

}