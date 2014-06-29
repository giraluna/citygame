/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />

module UIComponents
{

  export var StatList = React.createClass({

    render: function()
    {
      var rows = [];
      for (var i = 0; i < this.props.stats.length; i++)
      {
        var stat = this.props.stats[i];

        var div = React.DOM.div(
        {
          className: "stat-container",
          key: "" + i
        },
          React.DOM.div(
          {
            className: "stat-main"
          },
            React.DOM.span({className:"stat-title"}, stat.title),
            React.DOM.span({className:"stat-content"}, stat.content)
          ),
          stat.subContent ?
            React.DOM.small({className:"stat-subContent"}, stat.subContent) :
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