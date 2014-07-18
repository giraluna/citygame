/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Notifications = React.createClass({
        render: function () {
            var allNotifications = [];

            for (var i = 0; i < this.props.notifications.length; i++) {
                var current = this.props.notifications[i];

                var newNotification = React.DOM.div({
                    key: "" + i,
                    className: "react-notification",
                    onClick: current.onClose
                }, React.DOM.img({ src: current.icon }));

                allNotifications.push(newNotification);
            }

            return (React.DOM.div({ id: "react-notifications" }, allNotifications));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=notifications.js.map
