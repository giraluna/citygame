/// <reference path="../../../lib/react.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="newemployeelist.d.ts" />
/// <reference path="actioninfo.d.ts" />
/// <reference path="../../js/actions.d.ts" />
declare module UIComponents {
    /**
    * props:
    * player
    * relevant skill
    *
    *
    *
    * state:
    * selected employee: Employee
    * action:
    * {
    *   target
    *   base action duration
    * }
    * }
    */
    /**
    * el
    * {
    *   selected employee
    *   employees
    *   relevantskills
    *   handleselect
    * }
    */
    var EmployeeAction: React.ReactComponentFactory<{
        selected: any;
        action: any;
    }, React.ReactComponent<{
        selected: any;
        action: any;
    }, {}>>;
}
