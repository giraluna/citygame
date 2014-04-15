/// <reference path="../../../lib/react.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="employeelist.d.ts" />
/// <reference path="actioninfo.d.ts" />
/// <reference path="../../js/actions.d.ts" />
declare module UIComponents {
    /**
    * props:
    * employees
    * relevantSkills
    * actionText
    *
    *
    * state:
    * selected employee: Employee
    * action:
    * {
    *   target
    *   base action duration
    *   base action cost
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
