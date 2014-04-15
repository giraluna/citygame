/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/employee.d.ts" />
/// <reference path="js/newemployeelist.d.ts" />
/// <reference path="js/actioninfo.d.ts" />
///
/// <reference path="../js/actions.d.ts" />
var UIComponents;
(function (UIComponents) {
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
    UIComponents.EmployeeAction = React.createClass({
        getInitialState: function () {
            return ({
                selected: null,
                action: null
            });
        },
        handleSelectRow: function (key, employee) {
            if (employee.active !== true)
                return;
            else {
                this.setState({
                    selected: {
                        key: key,
                        employee: employee
                    }
                });
            }
        },
        render: function () {
            var self = this;
            var selectedEmployee = this.state.selected ? this.state.selected.employee : null;

            var selectedAction = this.state.action;

            var el = UIComponents.EmployeeList({
                employees: this.props.employees,
                relevantSkills: this.props.relevantSkills,
                selected: this.state.selected,
                handleSelectRow: this.handleSelectRow.bind(this)
            });

            var data = {};

            data.target = selectedAction.target;

            if (selectedEmployee) {
                var skills = this.props.relevantSkills.filter(function (skill) {
                    return selectedEmployee.skills[skill];
                });

                data.selectedEmployee = selectedEmployee;

                data.approxTime = selectedAction.baseDuration ? actions.getActionTime(skills, selectedAction.baseDuration) : null;
                data.approxCost = selectedAction.baseCost ? actions.getActionTime(skills, selectedAction.baseCost) : null;
            }

            var actionInfo = UIComponents.ActionInfo({ data: data, text: "lol" });

            return (el, React.DOM.div(null, actionInfo));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=employeeaction.js.map
