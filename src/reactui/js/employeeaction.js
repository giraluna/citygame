/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/employee.d.ts" />
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/actioninfo.d.ts" />
///
/// <reference path="../js/actions.d.ts" />
var UIComponents;
(function (UIComponents) {
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
    UIComponents.EmployeeAction = React.createClass({
        getInitialState: function () {
            return ({
                selected: null,
                action: this.props.action || null
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
                handleSelectRow: this.handleSelectRow
            });

            var actionData = {};

            if (selectedAction) {
                if (selectedEmployee) {
                    var skills = this.props.relevantSkills.map(function (skill) {
                        return selectedEmployee.skills[skill];
                    });

                    actionData.selectedEmployee = selectedEmployee;

                    for (var prop in selectedAction.data) {
                        var dataProp = selectedAction.data[prop];
                        if (dataProp) {
                            var toAssign = {};
                            if (dataProp.approximate === true) {
                                toAssign.approximate = true;
                                toAssign.amount = actions.getActionTime(skills, dataProp.amount).approximate;
                            } else if (dataProp.approximate === false) {
                                toAssign.approximate = false;
                                toAssign.amount = dataProp.amount;
                            } else {
                                toAssign = null;
                            }
                            ;
                            actionData[prop] = toAssign;
                        } else {
                            actionData[prop] = null;
                        }
                        ;
                    }
                }
            }
            var actionInfo = selectedAction ? UIComponents.ActionInfo({ data: actionData, text: selectedAction.actionText }) : null;

            return (React.DOM.div(null, el, actionInfo));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=employeeaction.js.map
