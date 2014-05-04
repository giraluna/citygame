/// <reference path="../../../lib/react.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="employeelist.d.ts" />
/// <reference path="actioninfo.d.ts" />
/// <reference path="../../js/actions.d.ts" />
declare module UIComponents {
    /**
    * props:
    * employees: array
    * relevantSkills?: array
    * action?: any
    *
    * state:
    * selected employee: employee
    * action
    * {
    *   target
    *   base cost
    *   base duration
    * }
    *
    *
    * children:
    * el
    * {
    *   selected
    *   employees
    *   relevantskills
    *   handleselect
    * }
    */
    var EmployeeAction: React.ReactComponentFactory<{
        selected: {
            key: any;
            employee: any;
        };
        action: any;
    }, React.ReactComponent<{
        selected: {
            key: any;
            employee: any;
        };
        action: any;
    }, {}>>;
}
