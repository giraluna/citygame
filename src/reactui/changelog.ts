/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../eventmanager.ts" />
/// <reference path="../utility.ts" />
/// 
/// <reference path="optionlist.ts" />
/// <reference path="splitmultilinetext.ts" />

module UIComponents
{

  export var Changelog = React.createClass({
    mixins: [SplitMultilineText],

    toggleSelf: function()
    {
      eventManager.dispatchEvent({type:"toggleFullScreenPopup", content:null});
    },

    getInitialState: function()
    {
      return {changelog: null}
    },

    componentDidMount: function()
    {
      var self = this;

      var request = new XMLHttpRequest();
      request.overrideMimeType("application/json");
      request.open("GET", "changelog.json", true);
      request.responseType = "json";
      request.onload = function ()
      {
        self.setState({changelog: request.response});
      };
      request.send();
    },

    render: function()
    {
      var allChanges = [];

      if (this.state.changelog)
      {
        for (var date in this.state.changelog)
        {
          var _changelog = this.state.changelog[date];
          var changelogList = [];
          for (var i = 0; i < _changelog.length; i++)
          {
            changelogList.push({content: _changelog[i]})
          }

          allChanges.push(UIComponents.OptionList(
          {
            options: changelogList,
            header: date,
            key: date
          }));
        }
      }

      return(
        React.DOM.div({className: "all-changes"},
          React.DOM.a({id:"close-info", className:"close-popup", href:"#",
            onClick: this.toggleSelf,
            onTouchStart: this.toggleSelf
          },"X"),
          allChanges
        )
      );

    }
  });
}