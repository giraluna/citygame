/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
/// <reference path="draggable.d.ts" />
/// <reference path="splitmultilinetext.d.ts" />
/// <reference path="employeeaction.d.ts" />
declare module UIComponents {
    /**
    *
    * props:
    *
    * employees || player
    * text?
    * initialstyle?
    *
    * onOk
    * okBtnText
    * onClose
    * closeBtnText
    * employeeactionprops:
    * {
    *   relevantSkills?
    *   action?
    * }
    *
    * incrementZIndex: function
    *
    **/
    var EmployeeActionPopup: React.ReactComponentFactory<{
        employees: any;
        style: any;
    }, React.ReactComponent<{
        employees: any;
        style: any;
    }, {}>>;
}
