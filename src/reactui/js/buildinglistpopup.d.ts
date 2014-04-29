/// <reference path="../../../lib/react.d.ts" />
/// <reference path="draggable.d.ts" />
/// <reference path="splitmultilinetext.d.ts" />
/// <reference path="buildinglist.d.ts" />
/// <reference path="employeeaction.d.ts" />
declare module UIComponents {
    /**
    * props:
    * player
    * buildingTemplates
    * buildingImages
    */
    var BuildingListPopup: React.ReactComponentFactory<{
        player: any;
        style: any;
    }, React.ReactComponent<{
        player: any;
        style: any;
    }, {}>>;
}
