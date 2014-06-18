/// <reference path="../../lib/react.d.ts" />

/// <reference path="js/sidemenubuildings.d.ts" />
/// <reference path="js/sidemenuzoom.d.ts" />
/// <reference path="js/sidemenusave.d.ts" />

module UIComponents
{

export var SideMenu = React.createClass(
{

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
        event.content.experience + " / " + event.content.nextLevel +
        " [" + event.content.percentage + "%]";

      exp.value = event.content.percentage;
      expText.innerHTML = levelString;
    });

    // forces update, kinda dumb
    this.props.player.addMoney(0);
  },
  render: function()
  {

    return(
      React.DOM.div( {id:"react-side-menu"},
        React.DOM.div( {id:"side-menu-main-buttons", className:"grid-column"},
          React.DOM.div( {className:"grid-row"},
            React.DOM.div( {className:"grid-cell"},
              "click"
            ),
            React.DOM.div( {className:"grid-cell"},
              "recruit"
            )
          ),
          React.DOM.div( {className:"grid-row"},
            React.DOM.div( {className:"grid-cell"},
              "buy plot"
            ),
            React.DOM.div( {className:"grid-cell"},
              "sell"
            )
          )
        ),
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
        React.DOM.div( {id:"side-menu-stats"},
          React.DOM.div( {id:"player-level-wrapper"},
            React.DOM.progress(
              {
                id:"player-level",
                ref: "exp",
                value:0,
                max:100
              }
            ),
            React.DOM.span(
              {
                id:"player-level-text",
                ref: "expText",
              }, null
            )
          ),
          React.DOM.div({ref: "money"}, 0)
        )

      )
    );
  }
});

}