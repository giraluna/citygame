/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../js/eventlistener.d.ts" />

module UIComponents
{

export var SideMenuStats = React.createClass(
{
  getInitialState: function()
  {
    return {
      hasLevelUpUpgrade: false,
      lastModifierCount: 0
    }
  },
  componentWillReceiveProps: function(newProps: any)
  {
    var newUpgradeCount =
      Object.keys(newProps.player.unlockedLevelUpModifiers).length;

    console.log(newUpgradeCount, this.state.lastModifierCount);
    if (newUpgradeCount > this.state.lastModifierCount)
    {
      console.log("lol")
      this.setState({hasLevelUpUpgrade: true});
    }

    this.setState({lastModifierCount: newUpgradeCount})
  },
  componentDidMount: function()
  {
    var money = this.refs.money.getDOMNode();
    var exp = this.refs.exp.getDOMNode();
    var expText = this.refs.expText.getDOMNode();

    eventManager.addEventListener("updatePlayerMoney", function(event)
    {
      money.innerHTML = event.content;
    });

    eventManager.addEventListener("updatePlayerExp", function(event)
    {
      var levelString = "Level   " + event.content.level + " " +
        event.content.experience + " / " + event.content.nextLevel; /*+
        " [" + event.content.percentage + "%]";*/

      exp.value = event.content.percentage;
      expText.innerHTML = levelString;
    });

    // forces update, kinda dumb
    this.props.player.addMoney(0);
  },
  handleOpenModifiers: function()
  {
    this.setState({hasLevelUpUpgrade: false});

    eventManager.dispatchEvent({type: "makeModifierPopup",
      content: this.props.player});
  },

  render: function()
  {
    var progressProps: any =
    {
      id:"player-level",
      ref: "exp",
      value:0,
      max:100
    };
    var divProps: any =
    {
      id:"player-level-wrapper"
    };

    if (this.state.hasLevelUpUpgrade)
    {
      progressProps.className = "new-modifier";

      divProps.onClick = this.handleOpenModifiers;
      divProps.onTouchStart = this.handleOpenModifiers;
      divProps.className = "interactive";
    }

    return(
      React.DOM.div( {id:"side-menu-stats"},
        React.DOM.div( divProps,
          React.DOM.progress( progressProps),

          React.DOM.span(
            {
              id:"player-level-text",
              ref: "expText",
            }, null
          )
        ),
        React.DOM.div({ref: "money"}, 0)
      )
    );
  }

});

}