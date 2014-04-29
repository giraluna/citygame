/// <reference path="../../lib/react.d.ts" />

module UIComponents
{

  /**
   * props:
   * player
   * buildingTemplates
   * buildingImages
   *
   * state:
   * selected building
   */
  
  export var BuildingList = React.createClass(
  {
    getInitialState: function()
    {
      return {selected: null};
    },

    handleSelectRow: function(selectedBuildingType)
    {
      this.setState(
      {
        selected: selectedBuildingType
      });
    },

    render: function()
    {
      var player = this.props.player;
      var rows = [];
      for (var type in this.props.buildingTemplates)
      {
        var buildingTemplate = this.props.buildingTemplates[type];
        var playerCanBuildBuilding = true;
        var rowProps: any = {key: buildingTemplate.type};
        var costProps = {className: "money"};

        if (player.money < buildingTemplate.cost)
        {
          playerCanBuildBuilding = false;
          rowProps.className = "inactive";
          costProps.className = "insufficient";
        };

        if (playerCanBuildBuilding)
        {
          rowProps.onClick = this.handleSelectRow.bind(null, buildingTemplate.type);
          rowProps.className = "active";
        };

        if (this.state.selected && this.state.selected === buildingTemplate.type)
        {
          rowProps.className = "selected";
        }

        var image = this.props.buildingImages[buildingTemplate.frame];

        var row = React.DOM.tr(rowProps,
          React.DOM.td({className: "building-image"},
            React.DOM.img(
              {
                src: image.src,
                width: image.width/2,
                height: image.height/2
              }
            )
          ),
          React.DOM.td({className: "building-title"}, buildingTemplate.type),
          React.DOM.td(costProps, buildingTemplate.cost + "$")
        )

        rows.push(row);
      };

      return(
        React.DOM.table({className: "building-list"},
          React.DOM.thead(null, 
            React.DOM.tr(null, 
              React.DOM.th(null),
              React.DOM.th(null, "Type"),
              React.DOM.th(null, "Cost")
            )
          ),
          React.DOM.tbody(null, 
            rows
          )
        )
      );
    }

  });

}