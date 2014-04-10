/// <reference path="../../../lib/react.d.ts" />
/// <reference path="employee.d.ts" />
declare module UIComponents {
    var EmployeeList: React.ReactComponentFactory<{
        selected?: any;
        filterInactive?: boolean;
    }, React.ReactComponent<{
        selected?: any;
        filterInactive?: boolean;
    }, {}>>;
}
