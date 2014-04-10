/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/employee.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.EmployeeList = React.createClass({
        getInitialState: function () {
            return ({
                selected: null
            });
        },
        handleSelectRow: function (key, employee) {
            if (employee.active !== true)
                return;
            else {
                this.setState({
                    selected: key
                });
            }
        },
        render: function () {
            var self = this;
            var rows = [];
            var skillColumns = [];

            for (var skill in this.props.employees[0].skills) {
                var colProps = {};

                if (this.props.relevantSkills.indexOf(skill) > -1) {
                    colProps["className"] = "relevant-col";
                }
                ;

                skillColumns.push(React.DOM.col(colProps));
            }

            this.props.employees.forEach(function (employee) {
                var key = employee.id;
                var boundSelect = self.handleSelectRow.bind(self, key, employee);

                var employeeProps = {
                    key: key,
                    employee: employee,
                    relevantSkills: self.props.relevantSkills,
                    rowProps: {
                        onClick: boundSelect,
                        className: "employee active"
                    }
                };

                if (self.state.selected === key) {
                    employeeProps.rowProps["className"] = "employee selected";
                } else if (employee.active === false) {
                    employeeProps.rowProps["className"] = "employee inactive";
                }
                ;

                var row = UIComponents.Employee(employeeProps);

                rows.push(row);
            });

            return (React.DOM.table({ className: "employee-list" }, React.DOM.colgroup(null, React.DOM.col(null), skillColumns), React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Name"), React.DOM.th({ title: "Negotiation" }, "neg"), React.DOM.th({ title: "Management" }, "mgt"), React.DOM.th({ title: "Recruitment" }, "rec"), React.DOM.th({ title: "Construction" }, "con"))), React.DOM.tbody(null, rows)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=employeelist.js.map
