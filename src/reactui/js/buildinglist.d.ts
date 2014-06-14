/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../js/utility.d.ts" />
declare module UIComponents {
    /**
    * props:
    * player
    * buildingTemplates
    * buildingImages
    *
    * state:
    * selected building
    */
    var BuildingList: React.ReactComponentFactory<{
        selected: any;
    }, React.ReactComponent<{
        selected: any;
    }, {}>>;
}
