/// <reference path="../../lib/react.d.ts" />

module UIComponents
{

  export var Notifications = React.createClass({

    render: function()
    {

      var allNotifications = [];

      for (var i = 0; i < this.props.notifications.length; i++)
      {
        var current = this.props.notifications[i];

        var newNotification = React.DOM.div(
        {
          key: ""+i,
          className: "react-notification",
          onClick: current.onClose
        },
          React.DOM.img({src:"img/Uusi kansio/user_add.png"})
        )

        allNotifications.push(newNotification);
      }

      return(
        React.DOM.div({id:"react-notifications"},
          allNotifications
        )
      );
    }

  });
}