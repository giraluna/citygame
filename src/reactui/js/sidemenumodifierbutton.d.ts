/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
declare module UIComponents {
    var SideMenuModifierButton: React.ReactComponentFactory<{
        hasNewModifier: boolean;
        lastModifierCount: number;
    }, React.ReactComponent<{
        hasNewModifier: boolean;
        lastModifierCount: number;
    }, {}>>;
}
