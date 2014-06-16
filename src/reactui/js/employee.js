/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Employee = React.createClass({
        getDefaultProps: function () {
            var defs = {
                employee: {
                    name: "UNDEFINED",
                    skills: {
                        "neg": 0,
                        "rec": 0,
                        "con": 0
                    }
                }
            };

            return defs;
        },
        render: function () {
            var name = this.props.employee.name;
            var skillCells = [];

            for (var skill in this.props.employee.skills) {
                var colProps = { key: skill };
                if (this.props.relevantSkills && this.props.relevantSkills.length > 0) {
                    if (this.props.relevantSkills.indexOf(skill) === -1) {
                        colProps["className"] = "irrelevant-cell";
                    }
                    ;
                }

                skillCells.push(React.DOM.td(colProps, this.props.employee.skills[skill]));
            }

            return (React.DOM.tr(this.props.rowProps, React.DOM.td({ className: "employee-name" }, name), skillCells));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=employee.js.map
