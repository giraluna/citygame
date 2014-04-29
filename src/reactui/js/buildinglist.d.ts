/// <reference path="../../../lib/react.d.ts" />
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
