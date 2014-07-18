/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="js/sidemenu.d.ts" />
/// <reference path="js/stats.d.ts" />
/// <reference path="js/options.d.ts" />
/// <reference path="js/notifications.d.ts" />

/// <reference path="../js/eventlistener.d.ts" />

module UIComponents
{

export var Stage = React.createClass(
{
  getDefaultProps: function()
  {
    return(
    {
      fullScreenPopups:
      {
        stats: function()
        {
          return(
            React.DOM.div({className: "fullscreen-popup-wrapper"},
              React.DOM.div({id: "stats-container", className: "fullscreen-popup"},
                UIComponents.Stats({player: this.props.player})
              )
            )
          )
        },
        options: function()
        {
          return(
            React.DOM.div({className: "fullscreen-popup-wrapper"},
              React.DOM.div({id: "options-container", className: "fullscreen-popup"},
                UIComponents.OptionsPopup(null)
              )
            )
          )
        }
      }
    });
  },
  getInitialState: function()
  {
    return {showFullScreenPopup:null};
  },

  componentDidMount: function()
  {
    var self = this;
    eventManager.addEventListener("toggleFullScreenPopup", function(event)
    {
      if (event.content === self.state.showFullScreenPopup)
      {
        self.setState({showFullScreenPopup: null});
      }
      else
      {
        self.setState({showFullScreenPopup: event.content});
      }
    })
  },

  render: function()
  {
    var self = this;
    var popups = [];
    for (var _popup in this.props.popups)
    {
      var popup = this.props.popups[_popup];
      popups.push( UIComponents[popup.type].call(null, popup.props) );
    };

    var fullScreenPopup = this.state.showFullScreenPopup ?
      this.props.fullScreenPopups[this.state.showFullScreenPopup].call(this) :
      null;

    return(
      React.DOM.div( {id:"react-wrapper"},
        
        React.DOM.div(
          {
            id:"react-popups",
            onDragEnter: function(e){e.preventDefault()},
            onDragOver: function(e){e.preventDefault()},
            onDrop: function(e){e.preventDefault()},
            onDragLeave: function(e){e.preventDefault()}
          }, 
          popups,
          UIComponents.Notifications(
          {
            notifications: this.props.notifications
          })
        ),

        fullScreenPopup,


        UIComponents.SideMenu(
          {
            player: this.props.player,
            frameImages: this.props.frameImages,
            // todo react definitions
            selectedTool: null
          }
        )
      )
    );
  }
});

}