/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../eventmanager.ts" />

module CityGame
{
  
  export module UIComponents
  {
  
  export var SideMenuModifierButton = React.createClass(
  {
    getInitialState: function()
    {
      return(
      {
        hasNewModifier: false,
        lastModifierCount: 0
      });
    },
  
    handleOpenModifiers: function()
    {
      this.setState({hasNewModifier: false});
      eventManager.dispatchEvent(
        {
          type: "makeModifierPopup",
          content:
          {
            player: this.props.player,
            modifierList: this.props.player.unlockedModifiers
          }
        });
    },
  
    componentWillReceiveProps: function(newProps: any)
    {
      var newModifierCount = newProps.player.unlockedModifiers.length
  
      if( newModifierCount > this.state.lastModifierCount)
      {
        this.setState({hasNewModifier: true});
      }
  
      this.setState({lastModifierCount: newModifierCount})
    },
  
    render: function()
    {
      var player = this.props.player;
      var modifierCount = this.props.player.unlockedModifiers.length;
  
      if (modifierCount > this.state.lastModifierCount)
      {
        //this.setState({newModifier: true});
      }
  
      var divProps =
      {
        id: "side-menu-modifiers",
        className: "grid-cell interactive",
        onClick: this.handleOpenModifiers,
        onTouchStart: this.handleOpenModifiers
      };
      if (this.state.hasNewModifier)
      {
        //divProps.className += " new-modifier";
      }
  
      var divText = "Available upgrades: ";
      if (modifierCount > 0)
      {
        divText += modifierCount;
      }
  
      return(
        React.DOM.div(divProps, divText)
      );
    }
  
  });
  
  }
}
