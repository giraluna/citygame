/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />

module UIComponents
{

/**
 * props:
 *   player
 *   buildableTypes
 */

export var SideMenuBuildings = React.createClass(
{
  getInitialState: function()
  {
    return {beautifyIndex: 0, lastSelectedBuilding: playerBuildableBuildings[0]};
  },
  handleBuildingSelect: function(building, e?)
  {
    if (this.props.player.money < this.props.player.getBuildCost(building))
    {
      return;
    }
    this.props.setSelectedTool(building.type);
    this.setState({lastSelectedBuilding: building});


    var continuous = e && e.shiftKey ? e.shiftKey : false;

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
  componentDidMount: function()
  {
    eventManager.addEventListener("resizeSmaller", function(e)
    {
      this.setState({beautifyIndex: 2});
    }.bind(this));

    eventManager.addEventListener("resizeBigger", function(e)
    {
      this.setState({beautifyIndex: 0});
    }.bind(this));

    eventManager.addEventListener("buildHotkey", function(e)
    {
      this.handleBuildingSelect(this.state.lastSelectedBuilding);
    }.bind(this));

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
      var amountBuilt = player.amountBuiltPerType[building.type];

      var divProps: any = {className: "side-building", key: building.type};

      var imageProps: any = {className: "building-image"};
      var titleProps: any = {className: "building-title"};
      var costProps: any = {className: "building-cost"};
      var amountProps: any = {className: "building-amount"};

      if (!canAfford)
      {
        divProps.className += " disabled";
        costProps.className += " insufficient";
      }
      else
      {
        divProps.className += " interactive";
        divProps.onClick = this.handleBuildingSelect.bind(null, building);
      }

      

      if (this.props.selectedTool &&
        this.props.selectedTool === building.type)
      {
        divProps.className += " selected-tool";
      }

      var costText = "" + beautify(buildCost, this.state.beautifyIndex);

      if (this.state.beautifyIndex < 2)
      {
        costText += "$";
      }


      var image = this.props.frameImages[building.frame];
      imageProps.src = image.src;

      var div = React.DOM.div(divProps,
        React.DOM.div({className: "building-image-container"},
          React.DOM.img(imageProps, null)
        ),

        React.DOM.div({className: "building-content"},
          React.DOM.div({className: "building-content-wrapper"},
            React.DOM.div(titleProps, building.title),
            React.DOM.div(costProps, costText)
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
