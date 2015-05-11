/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../eventmanager.ts" />
/// <reference path="../utility.ts" />

module CityGame
{
  
  export module UIComponents
  {
  
    export var OptionList = React.createClass({
  
      render: function()
      {
        var rows = [];
        for (var i = 0; i < this.props.options.length; i++)
        {
          var option = this.props.options[i];
  
          var div = React.DOM.div(
          {
            className: "stat-container",
            key: "" + i
          },
            React.DOM.div(
            {
              className: "stat-main"
            },
              option.content
            ),
            option.subContent ?
              React.DOM.small({className:"stat-subContent"}, option.subContent) :
              null
          )
  
          rows.push(div);
        };
  
  
        return(
          React.DOM.div({className: "stat-group"},
            React.DOM.div({className: "stat-header"}, this.props.header),
            rows
          )
        );
      }
    });
  }
}
