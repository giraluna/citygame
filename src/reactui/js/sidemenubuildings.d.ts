/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../../data/js/cg.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
/// <reference path="../../js/utility.d.ts" />
declare module UIComponents {
    /**
    * props:
    *   player
    *   buildableTypes
    */
    var SideMenuBuildings: React.ReactComponentFactory<{
        beautifyIndex: number;
        lastSelectedBuilding: any;
    }, React.ReactComponent<{
        beautifyIndex: number;
        lastSelectedBuilding: any;
    }, {}>>;
}
