/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />

module UIComponents
{

/**
 * props:
 *   player
 *   buildableTypes
 */

export var SideMenuBuildings = React.createClass(
{
  handleBuildingSelect: function(building, e)
  {
    var continuous = e.shiftKey;

    eventManager.dispatchEvent(
      {
        type:"changeBuildingType",
        content:
        {
          building: building,
          continuous: continuous
        }
      })
  },
  render: function()
  {

    var divs = [];
    var player = this.props.player;
    
    for (var i = 0; i < playerBuildableBuildings.length; i++)
    {
      var building = playerBuildableBuildings[i];

      var buildCost = player.getBuildCost(building);
      var canAfford = player.money >= buildCost;
      var amountBuilt = player.amountBuiltPerType[building.categoryType];

      var divProps: any = {className: "side-building interactive", key: building.type};

      var imageProps: any = {className: "building-image"};
      var titleProps: any = {className: "building-title"};
      var costProps: any = {className: "building-cost"};
      var amountProps: any = {className: "building-amount"};

      if (!canAfford)
      {
        divProps.className += " inactive";
        costProps.className += " insufficient";
      }
      else
      {
        divProps.onClick = this.handleBuildingSelect.bind(null, building);
      }

      var image = this.props.frameImages[building.frame];
      imageProps.src = image.src;

      var div = React.DOM.div(divProps,
        React.DOM.img(imageProps, null),

        React.DOM.div({className: "building-content"},
          React.DOM.div({className: "building-content-wrapper"},
            React.DOM.div(titleProps, building.translate),
            React.DOM.div(costProps, "" + buildCost + "$")
          ),
          React.DOM.div(amountProps, amountBuilt)
        )
      )

      divs.push(div);

    }
    return(
      React.DOM.div( {id:"side-menu-buildings", className:"grid-column"}, 
        divs
      )
    );
  }
});

}
