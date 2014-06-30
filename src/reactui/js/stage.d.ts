/// <reference path="../../../lib/react.d.ts" />
/// <reference path="sidemenu.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
declare module UIComponents {
    var Stage: React.ReactComponentFactory<{
        showStats: boolean;
    }, React.ReactComponent<{
        showStats: boolean;
    }, {}>>;
}
