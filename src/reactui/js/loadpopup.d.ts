/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
/// <reference path="draggable.d.ts" />
/// <reference path="splitmultilinetext.d.ts" />
/// <reference path="list.d.ts" />
declare module UIComponents {
    /**
    * props:
    *   games:
    *   [
    *     {
    *       name: string;
    *       date: date;
    *     }
    *   ]
    */
    var LoadPopup: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
}
