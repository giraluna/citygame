/// <reference path="../../../lib/react.d.ts" />
/// <reference path="sidemenu.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="options.d.ts" />
/// <reference path="notifications.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
declare module UIComponents {
    var Stage: React.ReactComponentFactory<{
        fullScreenPopups: {
            stats: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
            options: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
        };
    }, React.ReactComponent<{
        fullScreenPopups: {
            stats: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
            options: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
        };
    }, {
        showFullScreenPopup: any;
    }>>;
}
