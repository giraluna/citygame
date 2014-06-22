/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
declare module UIComponents {
    var SideMenuStats: React.ReactComponentFactory<{
        hasLevelUpUpgrade: boolean;
        lastModifierCount: number;
    }, React.ReactComponent<{
        hasLevelUpUpgrade: boolean;
        lastModifierCount: number;
    }, {}>>;
}
