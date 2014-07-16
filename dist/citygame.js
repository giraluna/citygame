// Using state for setting position = horrible performance
// manipulating style directly works much better
var UIComponents;
(function (UIComponents) {
    UIComponents.Draggable = {
        handleDragStart: function (e) {
            this.DOMNode.style.zIndex = this.props.incrementZIndex();

            if (!e.nativeEvent.dataTransfer)
                return;

            //this.DOMNode.classList.add("dragging");
            // browser overrides css cursor when dragging
            e.nativeEvent.dataTransfer.dropEffect = "move";

            this.offset = {
                x: e.nativeEvent.pageX - parseInt(this.DOMNode.style.left),
                y: e.nativeEvent.pageY - parseInt(this.DOMNode.style.top)
            };
        },
        handleDrag: function (e) {
            if (e.clientX === 0 && e.clientY === 0)
                return;

            var x = e.clientX - this.offset.x;
            var y = e.clientY - this.offset.y;

            var domWidth = parseInt(this.DOMNode.offsetWidth);
            var domHeight = parseInt(this.DOMNode.offsetHeight);

            var pixiWidth = parseInt(this.pixiContainer.offsetWidth);
            var pixiHeight = parseInt(this.pixiContainer.offsetHeight);

            var x2 = x + domWidth;
            var y2 = y + domHeight;

            if (x < 0)
                x = 0;
            else if (x2 > pixiWidth) {
                x = pixiWidth - domWidth;
            }
            ;

            if (y < 0)
                y = 0;
            else if (y2 > pixiHeight) {
                y = pixiHeight - domHeight;
            }
            ;

            this.DOMNode.style.left = x + "px";
            this.DOMNode.style.top = y + "px";
        },
        handleDragEnd: function (e) {
            //this.DOMNode.classList.remove("dragging");
        },
        componentDidMount: function () {
            this.DOMNode = this.getDOMNode();
            this.pixiContainer = document.getElementById("pixi-container");
        }
    };
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=draggable.js.map

/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SplitMultilineText = {
        splitMultilineText: function (text) {
            if (Array.isArray(text)) {
                var returnArr = [];
                for (var i = 0; i < text.length; i++) {
                    returnArr.push(text[i]);
                    returnArr.push(React.DOM.br(null));
                }
                return returnArr;
            } else {
                return text;
            }
        }
    };
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=splitmultilinetext.js.map

/// <reference path="../../lib/react.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    *   listItems
    *   initialColumns
    *
    * state:
    *   selected
    *   columns
    *   sortBy
    *
    * children:
    *   listelement:
    *     key
    *     tr
    *     getData()
    *
    *  columns:
    *    props (classes etc)
    *    label
    *    sorting (alphabet, numeric, null)
    *    title?
    */
    UIComponents.List = React.createClass({
        mixins: [UIComponents.SplitMultilineText],
        getInitialState: function () {
            var initialColumn = this.props.initialColumn || this.props.initialColumns[0];

            var initialSelected = this.props.listItems[0];

            return ({
                columns: this.props.initialColumns,
                selected: initialSelected,
                sortBy: {
                    column: initialColumn,
                    order: initialColumn.defaultOrder || "desc",
                    currColumnIndex: this.props.initialColumns.indexOf(initialColumn)
                }
            });
        },
        componentDidMount: function () {
            var self = this;

            this.handleSelectRow(this.props.sortedItems[0]);

            this.getDOMNode().addEventListener("keydown", function (event) {
                switch (event.keyCode) {
                    case 40: {
                        self.shiftSelection(1);
                        break;
                    }
                    case 38: {
                        self.shiftSelection(-1);
                        break;
                    }
                    default: {
                        return;
                    }
                }
            });
        },
        handleSelectColumn: function (column) {
            if (column.notSortable)
                return;
            var order;
            if (this.state.sortBy.column.key === column.key) {
                // flips order
                order = this.state.sortBy.order === "desc" ? "asc" : "desc";
            } else {
                order = column.defaultOrder;
            }

            this.setState({
                sortBy: {
                    column: column,
                    order: order,
                    currColumnIndex: this.state.columns.indexOf(column)
                }
            });
        },
        handleSelectRow: function (row) {
            if (this.props.onRowChange)
                this.props.onRowChange.call(null, row);
            this.setState({
                selected: row
            });
        },
        sort: function () {
            var self = this;
            var selectedColumn = this.state.sortBy.column;

            var initialPropToSortBy = selectedColumn.propToSortBy || selectedColumn.key;

            var itemsToSort = this.props.listItems;

            var defaultSortFN = function (a, b) {
                var propToSortBy = initialPropToSortBy;
                var nextIndex = self.state.sortBy.currColumnIndex;

                for (var i = 0; i < self.state.columns.length; i++) {
                    if (a.data[propToSortBy] === b.data[propToSortBy]) {
                        nextIndex = (nextIndex + 1) % self.state.columns.length;
                        var nextColumn = self.state.columns[nextIndex];
                        propToSortBy = nextColumn.propToSortBy || nextColumn.key;
                    } else {
                        break;
                    }
                }

                return a.data[propToSortBy] > b.data[propToSortBy] ? 1 : -1;
            };

            if (selectedColumn.sortingFunction) {
                itemsToSort.sort(function (a, b) {
                    var sortFNResult = selectedColumn.sortingFunction(a, b);
                    if (sortFNResult === 0) {
                        sortFNResult = defaultSortFN(a, b);
                    }
                    return sortFNResult;
                });
            } else {
                itemsToSort.sort(defaultSortFN);
            }

            if (this.state.sortBy.order === "desc") {
                itemsToSort.reverse();
            }

            //else if (this.state.sortBy.order !== "desc") throw new Error("Invalid sort parameter");
            this.props.sortedItems = itemsToSort;
        },
        shiftSelection: function (amountToShift) {
            var reverseIndexes = {};
            for (var i = 0; i < this.props.sortedItems.length; i++) {
                reverseIndexes[this.props.sortedItems[i].key] = i;
            }
            ;
            var currSelectedIndex = reverseIndexes[this.state.selected.key];
            var nextIndex = (currSelectedIndex + amountToShift) % this.props.sortedItems.length;
            if (nextIndex < 0) {
                nextIndex += this.props.sortedItems.length;
            }
            this.setState({
                selected: this.props.sortedItems[nextIndex]
            });
        },
        render: function () {
            var self = this;
            var columns = [];
            var headerLabels = [];

            this.state.columns.forEach(function (column) {
                var colProps = {
                    key: column.key
                };

                if (self.props.colStylingFN) {
                    colProps = self.props.colStylingFN(column, colProps);
                }

                columns.push(React.DOM.col(colProps));
                headerLabels.push(React.DOM.th({
                    className: !column.notSortable ? "sortable-column" : null,
                    title: column.title || colProps.title || null,
                    onMouseDown: self.handleSelectColumn.bind(null, column),
                    onTouchStart: self.handleSelectColumn.bind(null, column),
                    key: column.key
                }, column.label));
            });

            this.sort();

            var sortedItems = this.props.sortedItems;

            var rows = [];
            sortedItems.forEach(function (item) {
                var cells = [];
                for (var _column in self.state.columns) {
                    var column = self.state.columns[_column];

                    var cellProps = {
                        key: "" + item.key + "_" + column.key
                    };

                    if (self.props.cellStylingFN) {
                        cellProps = self.props.cellStylingFN(item, column, cellProps);
                    }

                    cells.push(React.DOM.td(cellProps, self.splitMultilineText(item.data[column.key]) || null));
                }

                var rowProps = {};
                rowProps.key = item.key;
                rowProps.onClick = self.handleSelectRow.bind(null, item);
                rowProps.onTouchStart = self.handleSelectRow.bind(null, item);
                if (self.state.selected && self.state.selected.key === item.key) {
                    rowProps.className = "selected";
                }
                if (self.props.rowStylingFN)
                    rowProps = self.props.rowStylingFN(item, rowProps);
                rows.push(React.DOM.tr(rowProps, cells));
            });

            return (React.DOM.div(null, React.DOM.table({
                tabIndex: 1
            }, React.DOM.colgroup(null, columns), React.DOM.thead(null, React.DOM.tr(null, headerLabels)), React.DOM.tbody(null, rows))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=list.js.map

/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    * text
    * approx action time
    * approx cost
    *
    */
    UIComponents.ActionInfo = React.createClass({
        render: function () {
            var data = this.props.data;
            var textSpan = this.props.text && Object.keys(this.props.data).length > 0 ? [React.DOM.span(null, this.props.text), React.DOM.br(null)] : null;

            var timeSpan = null;
            if (data.time) {
                var timeString = "invalid time";
                if (data.time.approximate === true) {
                    timeString = "~" + data.time.amount + " days";
                } else if (data.time.approximate === false) {
                    timeString = "" + data.time.amount + " days";
                }
                timeSpan = [React.DOM.span(null, timeString), React.DOM.br(null)];
            }

            var costSpan = null;
            if (data.cost) {
                var costString = "invalid cost";
                if (data.cost.approximate === true) {
                    costString = "~" + data.cost.amount + "$";
                } else if (data.cost.approximate === false) {
                    costString = "" + data.cost.amount + "$";
                }
                costSpan = [React.DOM.span(null, costString), React.DOM.br(null)];
            }

            return (React.DOM.div({ className: "action-info" }, textSpan, timeSpan, costSpan));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=actioninfo.js.map

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

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.EmployeeList = React.createClass({
        applyRowStyle: function (item, rowProps) {
            if (item.data.employee.active !== true) {
                rowProps.className = "inactive";
                rowProps.onClick = rowProps.onTouchStart = null;
            }
            return rowProps;
        },
        applyColStyle: function (column, colProps) {
            if (this.props.relevantSkills && this.props.relevantSkills.length > 0) {
                if (this.props.relevantSkills.indexOf(column.key) > -1) {
                    colProps["className"] = "relevant-col";
                }
            }

            return colProps;
        },
        applyCellStyle: function (item, column, cellProps) {
            if (this.props.relevantSkills && this.props.relevantSkills.length > 0) {
                if (this.props.relevantSkills.indexOf(column.key) < 0 && column.key !== "name" && column.key !== "trait") {
                    cellProps["className"] = "irrelevant-cell";
                }
            }

            return cellProps;
        },
        sortEmployees: function (a, b) {
            var employeeA = a.data.employee;
            var employeeB = b.data.employee;

            if (!employeeA.active && employeeB.active)
                return -1;
            else if (!employeeB.active && employeeA.active)
                return 1;
            else
                return 0;
        },
        render: function () {
            var stopBubble = function (e) {
                e.stopPropagation();
            };
            var hasDeleteButton = false;

            var rows = [];
            for (var _emp in this.props.employees) {
                var employee = this.props.employees[_emp];

                var data = {
                    name: employee.name,
                    negotiation: employee.skills.negotiation,
                    recruitment: employee.skills.recruitment,
                    construction: employee.skills.construction,
                    trait: null,
                    traitTitle: null,
                    employee: employee
                };

                if (employee.trait) {
                    data.trait = React.DOM.div({ className: "employee-modifier-container" }, React.DOM.span(null, employee.trait.title), React.DOM.br(null), React.DOM.small(null, employee.trait.description));
                    data.traitTitle = employee.trait.title;
                }

                if (employee.player) {
                    hasDeleteButton = true;
                    data.del = React.DOM.a({
                        href: "#",
                        onClick: function (player, employee) {
                            eventManager.dispatchEvent({
                                type: "makeConfirmPopup",
                                content: {
                                    text: "Are you sure you want to fire " + employee.name + "?",
                                    onOk: function () {
                                        player.removeEmployee(employee);
                                    }
                                }
                            });
                        }.bind(null, employee.player, employee)
                    }, "X");
                }

                rows.push({
                    key: employee.id,
                    data: data
                });
            }
            var columns = [
                {
                    label: "Name",
                    key: "name",
                    sortingFunction: this.sortEmployees,
                    defaultOrder: "asc"
                },
                {
                    label: "neg",
                    key: "negotiation",
                    sortingFunction: this.sortEmployees,
                    defaultOrder: "desc",
                    title: "Negotiation\nGives a discount when buying new plots"
                },
                {
                    label: "rec",
                    key: "recruitment",
                    sortingFunction: this.sortEmployees,
                    defaultOrder: "desc",
                    title: "Recruitment\nAble to find better new recruits"
                },
                {
                    label: "con",
                    key: "construction",
                    sortingFunction: this.sortEmployees,
                    defaultOrder: "desc",
                    title: "Construction\nDecreases building cost and time"
                },
                {
                    label: "trait",
                    key: "trait",
                    defaultOrder: "desc",
                    propToSortBy: "traitTitle",
                    title: "Traits\nMouse over trait to see benefits. Traits do not stack."
                }
            ];

            var initialColumnIndex = 0;
            if (this.props.relevantSkills && this.props.relevantSkills.length > 0) {
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].key === this.props.relevantSkills[0]) {
                        initialColumnIndex = i;
                    }
                }
            }

            if (hasDeleteButton) {
                columns.push({
                    label: "fire",
                    key: "del",
                    notSortable: true
                });
            }

            return (UIComponents.List({
                // TODO fix declaration file and remove
                // typescript qq without these
                selected: null,
                columns: null,
                sortBy: null,
                initialColumn: columns[initialColumnIndex],
                ref: "list",
                rowStylingFN: this.applyRowStyle,
                colStylingFN: this.applyColStyle,
                cellStylingFN: this.applyCellStyle,
                onRowChange: this.props.onRowChange || null,
                listItems: rows,
                initialColumns: columns
            }));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=employeelist.js.map

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
            var employee;
            for (var e in this.props.employees) {
                if (this.props.employees[e].active === true) {
                    employee = this.props.employees[e];
                    break;
                }
            }
            return ({
                selected: employee ? {
                    key: employee.id,
                    employee: employee
                } : null,
                action: this.props.action || null
            });
        },
        handleSelectRow: function (item) {
            var employee = item.data.employee;

            if (employee.active !== true)
                return;
            else {
                this.setState({
                    selected: {
                        key: employee.id,
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
                onRowChange: this.handleSelectRow
            });

            var actionData = {};

            if (selectedAction) {
                if (selectedEmployee && selectedEmployee.active === true) {
                    var skills = this.props.relevantSkills.map(function (skill) {
                        return selectedEmployee.skills[skill];
                    });

                    actionData.selectedEmployee = selectedEmployee;

                    for (var prop in selectedAction.data) {
                        var dataProp = selectedAction.data[prop];
                        if (dataProp) {
                            var toAssign = {};

                            var value = actions.getActionCost(skills, dataProp.amount);

                            if (dataProp.approximate === true) {
                                toAssign.approximate = true;
                                toAssign.amount = value.approximate;
                            } else if (dataProp.approximate === false) {
                                toAssign.approximate = false;
                                toAssign.amount = value.actual;
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

/// <reference path="../../lib/react.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
///
/// <reference path="js/employeeaction.d.ts" />
var UIComponents;
(function (UIComponents) {
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
    UIComponents.EmployeeActionPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleOk: function (e) {
            var selected = this.refs.employeeAction.state.selected;
            if (!selected || !selected.employee.active) {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup", content: { text: "No employee selected" }
                });
                return false;
            }

            var callbackSuccessful = this.props.onOk.call(null, selected);
            if (callbackSuccessful !== false) {
                this.handleClose();
            }
        },
        handleClose: function () {
            this.props.onClose.call();
        },
        getInitialState: function () {
            return {
                employees: this.props.employees || this.props.player.employees,
                style: this.props.initialStyle
            };
        },
        componentWillRecieveProps: function (newProps) {
            this.setState({ employees: newProps.employees || newProps.player.employees });
        },
        componentDidMount: function () {
            var self = this;
            var okBtn = this.refs.okBtn.getDOMNode();
            var closeBtn = this.refs.closeBtn.getDOMNode();
            if (this.props.activationDelay) {
                okBtn.disabled = true;
                closeBtn.disabled = true;
                window.setTimeout(function () {
                    okBtn.disabled = false;
                    closeBtn.disabled = false;
                    okBtn.focus();
                }, self.props.activationDelay);
            } else {
                okBtn.focus();
            }
        },
        render: function () {
            var self = this;

            var text = this.splitMultilineText(this.props.text) || null;
            var employees = this.state.employees;

            var employeeActionProps = {
                ref: "employeeAction",
                employees: employees,
                relevantSkills: this.props.relevantSkills,
                action: this.props.action,
                selected: null
            };
            var stopBubble = function (e) {
                e.stopPropagation();
            };

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: stopBubble
            }, this.props.okBtnText || "Ok");

            var closeBtn = React.DOM.button({
                ref: "closeBtn",
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Cancel");

            return (React.DOM.div({
                className: "popup",
                style: this.state.style,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.p({ className: "popup-text" }, text), React.DOM.div({ className: "popup-content", draggable: true, onDrag: stopBubble }, UIComponents.EmployeeAction(employeeActionProps)), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=employeeactionpopup.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.InfoPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        componentDidMount: function () {
            this.refs.okBtn.getDOMNode().focus();
        },
        render: function () {
            var self = this;
            var text = this.splitMultilineText(this.props.text) || null;

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.props.onClose,
                onTouchStart: this.props.onClose,
                draggable: true,
                onDrag: function (e) {
                    e.stopPropagation();
                }
            }, this.props.okBtnText || "Ok");

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.p({ className: "popup-text" }, text), React.DOM.div({ className: "popup-buttons" }, okBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=infopopup.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.ConfirmPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleClose: function () {
            this.props.onClose.call();
        },
        handleOk: function () {
            var callbackSuccessful = this.props.onOk.call();
            if (callbackSuccessful !== false) {
                this.handleClose();
            }
        },
        componentDidMount: function () {
            this.refs.okBtn.getDOMNode().focus();
        },
        render: function () {
            var self = this;
            var text = this.splitMultilineText(this.props.text) || null;

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: function (e) {
                    e.stopPropagation();
                }
            }, this.props.okBtnText || "Confirm");

            var cancelBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: function (e) {
                    e.stopPropagation();
                }
            }, this.props.CloseBtnText || "Cancel");

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.p({ className: "popup-text" }, text), React.DOM.div({ className: "popup-buttons" }, okBtn, cancelBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=confirmpopup.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
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
    // TODO merge stuff with savepopups
    UIComponents.LoadPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleOk: function (e) {
            var selected = this.refs.savedGameList.state.selected;
            if (!selected) {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup", content: { text: "No saved game selected" }
                });
                return false;
            }

            var callbackSuccessful = this.props.onOk.call(null, selected.data.name);
            if (callbackSuccessful !== false) {
                this.handleClose();
            }
        },
        handleClose: function () {
            this.props.onClose.call();
        },
        render: function () {
            var savedGames = [];

            for (var savedGame in localStorage) {
                if (savedGame === "options")
                    continue;
                var parsed = JSON.parse(localStorage[savedGame]);
                var date = new Date(parsed.date);
                var prettyDate = [
                    [
                        date.getDate(),
                        date.getMonth() + 1,
                        date.getFullYear().toString().slice(2, 4)
                    ].join("/"),
                    [
                        date.getHours(),
                        date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes().toString()
                    ].join(":")
                ].join(" ");
                savedGames.push({
                    key: savedGame,
                    data: {
                        name: savedGame,
                        date: prettyDate,
                        accurateDate: date,
                        del: React.DOM.a({
                            href: "#",
                            onClick: function (name) {
                                eventManager.dispatchEvent({
                                    type: "makeConfirmPopup",
                                    content: {
                                        text: [
                                            "Are you sure you want to delete this save?",
                                            name],
                                        onOk: function () {
                                            localStorage.removeItem(name);
                                        }
                                    }
                                });
                            }.bind(null, savedGame)
                        }, "X")
                    }
                });
            }
            ;

            var columns = [
                {
                    label: "Name",
                    key: "name"
                },
                {
                    label: "Date",
                    key: "date",
                    defaultOrder: "desc",
                    propToSortBy: "accurateDate"
                },
                {
                    label: "Delete",
                    key: "del",
                    notSortable: true
                }
            ];

            var stopBubble = function (e) {
                e.stopPropagation();
            };

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: stopBubble
            }, this.props.okBtnText || "Load");

            var closeBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Cancel");

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.p({ className: "popup-text" }, "Select game to load"), React.DOM.div({ className: "popup-content", draggable: true, onDrag: stopBubble }, UIComponents.List({
                // TODO fix declaration file and remove
                // typescript qq without these
                selected: null,
                columns: null,
                sortBy: null,
                initialColumn: columns[1],
                ref: "savedGameList",
                listItems: savedGames,
                initialColumns: columns
            })), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=loadpopup.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
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
    // TODO merge stuff with load popups
    UIComponents.SavePopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        componentDidMount: function () {
            var setValue = function () {
                this.refs.inputElement.getDOMNode().value = this.refs.savedGameList.state.selected.data.name;
            }.bind(this);

            window.setTimeout(setValue, 50);
        },
        handleOk: function (e) {
            var self = this;

            var toSaveAs = this.refs.inputElement.getDOMNode().value;
            var overwriting = false;
            for (var save in localStorage) {
                if (toSaveAs === save)
                    overwriting = true;
            }

            if (!toSaveAs) {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup", content: { text: "Select a name to save as" }
                });
                return false;
            }

            if (overwriting) {
                eventManager.dispatchEvent({
                    type: "makeConfirmPopup",
                    content: {
                        text: [
                            "Are you sure you want to overwrite this save?",
                            toSaveAs],
                        onOk: onOkFN
                    }
                });
                return false;
            }

            function onOkFN() {
                var callbackSuccessful = self.props.onOk.call(null, toSaveAs);
                if (callbackSuccessful !== false) {
                    self.handleClose();
                }
            }

            onOkFN();
        },
        handleClose: function () {
            this.props.onClose.call();
        },
        render: function () {
            var self = this;
            var savedGames = [];

            for (var savedGame in localStorage) {
                if (savedGame === "options")
                    continue;
                var parsed = JSON.parse(localStorage[savedGame]);
                var date = new Date(parsed.date);
                var prettyDate = [
                    [
                        date.getDate(),
                        date.getMonth() + 1,
                        date.getFullYear().toString().slice(2, 4)
                    ].join("/"),
                    [
                        date.getHours(),
                        date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes().toString()
                    ].join(":")
                ].join(" ");
                savedGames.push({
                    key: savedGame,
                    data: {
                        name: savedGame,
                        date: prettyDate,
                        accurateDate: date,
                        del: React.DOM.a({
                            href: "#",
                            onClick: function (name) {
                                eventManager.dispatchEvent({
                                    type: "makeConfirmPopup",
                                    content: {
                                        text: [
                                            "Are you sure you want to delete this save?",
                                            name],
                                        onOk: function () {
                                            localStorage.removeItem(name);
                                        }
                                    }
                                });
                            }.bind(null, savedGame)
                        }, "X")
                    }
                });
            }
            ;

            var columns = [
                {
                    label: "Name",
                    key: "name"
                },
                {
                    label: "Date",
                    key: "date",
                    defaultOrder: "desc",
                    propToSortBy: "accurateDate"
                },
                {
                    label: "Delete",
                    key: "del",
                    notSortable: true
                }
            ];

            var stopBubble = function (e) {
                e.stopPropagation();
            };

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: stopBubble
            }, this.props.okBtnText || "Save");

            var closeBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Cancel");

            var inputElement = React.DOM.input({
                ref: "inputElement",
                type: "text"
            });

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.p({ className: "popup-text" }, "Select name to save as"), React.DOM.div({ className: "popup-content", draggable: true, onDrag: stopBubble }, UIComponents.List({
                // TODO fix declaration file and remove
                // typescript qq without these
                selected: null,
                columns: null,
                sortBy: null,
                initialColumn: columns[1],
                ref: "savedGameList",
                listItems: savedGames,
                initialColumns: columns,
                onRowChange: function (row) {
                    self.refs.inputElement.getDOMNode().value = row.data.name;
                }
            }), React.DOM.br(null), inputElement), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=savepopup.js.map

/// <reference path="../../lib/react.d.ts" />
/// <reference path="../js/utility.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    * player
    * buildingTemplates
    * buildingImages
    *
    * state:
    * selected building
    */
    UIComponents.BuildingList = React.createClass({
        getInitialState: function () {
            var templates = this.props.buildingTemplates;
            for (var _type in templates) {
                var building = templates[_type];
                if (this.props.player.money >= building.cost) {
                    return { selected: building };
                }
            }
            return { selected: null };
        },
        handleSelectRow: function (selectedBuildingType) {
            this.setState({
                selected: selectedBuildingType
            });
        },
        render: function () {
            var player = this.props.player;
            var rows = [];
            for (var type in this.props.buildingTemplates) {
                var buildingTemplate = this.props.buildingTemplates[type];
                var playerCanBuildBuilding = true;
                var rowProps = {
                    key: buildingTemplate.type,
                    title: buildingTemplate.translate + "\n" + "Base profit: " + buildingTemplate.baseProfit
                };
                var costProps = { className: "money" };
                var nameProps = { className: "building-title" };

                var cost = player.getBuildCost(buildingTemplate);

                if (player.money < cost) {
                    playerCanBuildBuilding = false;
                    rowProps.className = "inactive";
                    costProps.className = "insufficient";
                }

                if (playerCanBuildBuilding) {
                    rowProps.onClick = rowProps.onTouchStart = this.handleSelectRow.bind(null, buildingTemplate.type);
                    rowProps.className = "active";
                }
                ;

                if (this.state.selected && this.state.selected === buildingTemplate.type) {
                    rowProps.className = "selected";
                }
                ;

                var image = this.props.buildingImages[buildingTemplate.frame];

                var row = React.DOM.tr(rowProps, React.DOM.td({ className: "building-image" }, React.DOM.img({
                    src: image.src,
                    width: image.width / 2,
                    height: image.height / 2
                })), React.DOM.td(nameProps, buildingTemplate.translate), React.DOM.td(costProps, cost + "$"));

                rows.push(row);
            }
            ;

            return (React.DOM.div({ className: "scrollable-wrapper" }, React.DOM.table({ className: "building-list" }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null), React.DOM.th(null, "Type"), React.DOM.th(null, "Cost"))), React.DOM.tbody(null, rows))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=buildinglist.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
/// <reference path="js/buildinglist.d.ts" />
///
/// <reference path="js/employeeaction.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    * player
    * buildingTemplates
    * buildingImages
    */
    UIComponents.BuildingListPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        getInitialState: function () {
            return {
                player: this.props.player,
                style: this.props.initialStyle
            };
        },
        componentWillRecieveProps: function (newProps) {
            this.setState({ player: newProps.player });
        },
        componentDidMount: function () {
            this.refs.okBtn.getDOMNode().focus();
        },
        handleOk: function (e) {
            var selectedTemplate = this.refs.buildingList.state.selected;
            var selected = selectedTemplate ? this.props.buildingTemplates[selectedTemplate] : null;
            if (!selected || this.props.player.money < selected.cost) {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup", content: { text: "No building selected" }
                });
                return false;
            }

            var callbackSuccessful = this.props.onOk.call(null, selected);
            if (callbackSuccessful !== false) {
                this.handleClose();
            }
        },
        handleClose: function () {
            this.props.onClose.call();
        },
        render: function () {
            var self = this;

            var text = this.splitMultilineText(this.props.text) || null;

            var buildingListProps = {
                ref: "buildingList",
                buildingTemplates: this.props.buildingTemplates,
                buildingImages: this.props.buildingImages,
                player: this.state.player,
                selected: null
            };
            var stopBubble = function (e) {
                e.stopPropagation();
            };

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: stopBubble
            }, this.props.okBtnText || "Build");

            var closeBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Cancel");

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.p({ className: "popup-text" }, text), React.DOM.div({ className: "popup-content", draggable: true, onDrag: stopBubble }, UIComponents.BuildingList(buildingListProps)), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=buildinglistpopup.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.ModifierList = React.createClass({
        render: function () {
            var rows = [];
            for (var i = 0; i < this.props.modifiers.length; i++) {
                var modifier = this.props.modifiers[i];
                var item = {
                    key: modifier.type,
                    data: {
                        title: modifier.title,
                        description: modifier.description,
                        modifier: modifier
                    }
                };
                if (this.props.excludeCost !== true) {
                    item.data.cost = modifier.cost || null;
                    item.data.costString = modifier.cost !== undefined ? beautify(modifier.cost) + "$" : null;
                }

                rows.push(item);
            }
            var columns = [];
            columns.push({
                label: "Title",
                key: "title"
            });

            if (this.props.excludeCost !== true) {
                columns.push({
                    label: "Cost",
                    key: "costString",
                    defaultOrder: "asc",
                    propToSortBy: "cost"
                });
            }

            columns.push({
                label: "Description",
                key: "description"
            });

            return (UIComponents.List({
                // TODO fix declaration file and remove
                // typescript qq without these
                selected: null,
                columns: null,
                sortBy: null,
                initialColumn: columns[1],
                ref: "list",
                className: "modifier-list",
                rowStylingFN: this.props.rowStylingFN,
                listItems: rows,
                initialColumns: columns
            }));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=modifierlist.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
/// <reference path="js/modifierlist.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.ModifierPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleClose: function () {
            this.props.onClose.call();
        },
        handleOk: function () {
            var selected = this.refs.modifierList.refs.list.state.selected;

            if (!selected) {
                if (this.props.modifierList.length < 1) {
                    this.handleClose();
                } else
                    return false;
            }

            var closeAfter = this.props.onOk.call(null, selected);

            if (closeAfter === true) {
                this.handleClose();
            } else {
                this.refs.modifierList.refs.list.shiftSelection(1);
            }
        },
        applyRowStyle: function (item, rowProps) {
            if (item.data.modifier.cost > this.props.player.money) {
                rowProps.className = "inactive";
                rowProps.onClick = rowProps.onTouchStart = null;
            }
            return rowProps;
        },
        render: function () {
            var stopBubble = function (e) {
                e.stopPropagation();
            };

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: stopBubble
            }, this.props.okBtnText || "Buy");

            var closeBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Close");

            var text = this.splitMultilineText(this.props.text) || null;

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.p({ className: "popup-text" }, text), React.DOM.div({
                className: "popup-content",
                draggable: true, onDrag: stopBubble }, UIComponents.ModifierList({
                ref: "modifierList",
                rowStylingFN: this.applyRowStyle,
                modifiers: this.props.modifierList,
                excludeCost: this.props.excludeCost || false
            })), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=modifierpopup.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.StatList = React.createClass({
        render: function () {
            var rows = [];
            for (var i = 0; i < this.props.stats.length; i++) {
                var stat = this.props.stats[i];

                var div = React.DOM.div({
                    className: "stat-container",
                    key: "" + i
                }, React.DOM.div({
                    className: "stat-main"
                }, React.DOM.span({ className: "stat-title" }, stat.title), React.DOM.span({ className: "stat-content" }, stat.content)), stat.subContent ? React.DOM.small({ className: "stat-subContent" }, stat.subContent) : null);

                rows.push(div);
            }
            ;

            return (React.DOM.div({ className: "stat-group" }, React.DOM.div({ className: "stat-header" }, this.props.header), rows));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=statlist.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../../data/js/levelupmodifiers.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
/// <reference path="js/modifierlist.d.ts" />
/// <reference path="js/statlist.d.ts" />
/// <reference path="js/employeelist.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Stats = React.createClass({
        mixins: [UIComponents.SplitMultilineText],
        toggleSelf: function () {
            eventManager.dispatchEvent({ type: "toggleFullScreenPopup", content: null });
        },
        render: function () {
            var player = this.props.player;
            var allStats = [];

            var clicks = player.clicks;

            var generalStats = [
                {
                    title: "Money:",
                    content: "$" + beautify(player.money)
                },
                {
                    title: "Clicks:",
                    content: player.clicks
                },
                {
                    title: "Money from clicks:",
                    content: "$" + (player.incomePerType.click ? beautify(player.incomePerType.click) : 0)
                },
                {
                    title: "Owned plots:",
                    content: player.ownedCellsAmount
                }
            ];
            var generalStatList = UIComponents.StatList({
                stats: generalStats,
                header: "General",
                key: "generalStatList"
            });

            allStats.push(generalStatList);

            var prestigeModifier = 1 + player.prestige * 0.005;
            if (player.levelUpModifiers.prestigeEffectIncrease1) {
                prestigeModifier *= (1 + player.prestige * 0.0025);
            }
            var prestigeStats = [
                {
                    title: "Times reset:",
                    content: player.timesReset
                },
                {
                    title: "Prestige:",
                    content: player.prestige.toFixed(),
                    subContent: "for a total of " + ((prestigeModifier - 1) * 100).toFixed(1) + "% " + "extra profit"
                },
                {
                    title: "Current experience:",
                    content: beautify(player.experience)
                },
                {
                    title: "Total experience:",
                    content: beautify(player.totalResetExperience + player.experience)
                }
            ];
            var prestigeStatList = UIComponents.StatList({
                stats: prestigeStats,
                header: "Prestige",
                key: "prestigeStatList"
            });

            allStats.push(prestigeStatList);

            if (player.permanentLevelupUpgrades.length > 0) {
                var permModifiers = [];
                for (var i = 0; i < player.permanentLevelupUpgrades.length; i++) {
                    permModifiers.push(levelUpModifiers[player.permanentLevelupUpgrades[i]]);
                }
                var permModifierList = UIComponents.ModifierList({
                    ref: "permModifierList",
                    modifiers: permModifiers,
                    excludeCost: true
                });

                allStats.push(React.DOM.div({ className: "stat-group", key: "permModifierList" }, React.DOM.div({ className: "stat-header" }, "Permanent perks"), permModifierList));
            }

            if (Object.keys(player.levelUpModifiers).length > 0) {
                var perks = [];
                for (var _mod in player.levelUpModifiers) {
                    if (player.permanentLevelupUpgrades.indexOf(_mod) > -1)
                        continue;
                    else
                        perks.push(player.levelUpModifiers[_mod]);
                }
                var perkList = UIComponents.ModifierList({
                    ref: "perkList",
                    modifiers: perks,
                    excludeCost: true
                });

                allStats.push(React.DOM.div({ className: "stat-group", key: "perkList" }, React.DOM.div({ className: "stat-header" }, "Unlocked perks"), perkList));
            }

            if (Object.keys(player.modifiers).length > 0) {
                var unlocks = [];
                for (var _mod in player.modifiers) {
                    unlocks.push(player.modifiers[_mod]);
                }
                var unlockList = UIComponents.ModifierList({
                    ref: "unlockList",
                    modifiers: unlocks,
                    excludeCost: true
                });

                allStats.push(React.DOM.div({ className: "stat-group", key: "unlockList" }, React.DOM.div({ className: "stat-header" }, "Upgrades"), unlockList));
            }
            if (Object.keys(player.employees).length > 0) {
                var employeeList = UIComponents.EmployeeList({
                    ref: "employeeList",
                    employees: player.employees
                });

                allStats.push(React.DOM.div({ className: "stat-group", key: "employeeList" }, React.DOM.div({ className: "stat-header" }, "Employees"), employeeList));
            }

            return (React.DOM.div({ className: "all-stats" }, React.DOM.a({
                id: "close-info", className: "close-popup", href: "#",
                onClick: this.toggleSelf,
                onTouchStart: this.toggleSelf
            }, "X"), allStats));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=stats.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.OptionList = React.createClass({
        render: function () {
            var rows = [];
            for (var i = 0; i < this.props.options.length; i++) {
                var option = this.props.options[i];

                var div = React.DOM.div({
                    className: "stat-container",
                    key: "" + i
                }, React.DOM.div({
                    className: "stat-main"
                }, option.content), option.subContent ? React.DOM.small({ className: "stat-subContent" }, option.subContent) : null);

                rows.push(div);
            }
            ;

            return (React.DOM.div({ className: "stat-group" }, React.DOM.div({ className: "stat-header" }, this.props.header), rows));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=optionlist.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/optionlist.d.ts" />
///
/// <reference path="../js/options.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.OptionsPopup = React.createClass({
        toggleSelf: function () {
            eventManager.dispatchEvent({ type: "toggleFullScreenPopup", content: null });
        },
        handleImport: function () {
            var imported = this.refs.importTextArea.getDOMNode().value;
            var decoded = LZString.decompressFromBase64(imported);

            localStorage.setItem("tempImported", decoded);

            eventManager.dispatchEvent({ type: "loadGame", content: "tempImported" });

            localStorage.removeItem("tempImported");
        },
        handleExport: function () {
            eventManager.dispatchEvent({ type: "saveGame", content: "tempImported" });

            var encoded = LZString.compressToBase64(localStorage.getItem("tempImported"));
            this.refs.importTextArea.getDOMNode().value = encoded;

            localStorage.removeItem("tempImported");
        },
        render: function () {
            var allOptions = [];

            var importExport = [
                {
                    content: React.DOM.div({ id: "import-export-container" }, React.DOM.div({ id: "import-export-buttons" }, React.DOM.button({
                        id: "import-button",
                        onClick: this.handleImport,
                        onTouchStart: this.handleImport
                    }, "Import"), React.DOM.button({
                        id: "export-button",
                        onClick: this.handleExport,
                        onTouchStart: this.handleExport
                    }, "Export")), React.DOM.textarea({ id: "import-export-text", ref: "importTextArea" }))
                }
            ];
            var importExportList = UIComponents.OptionList({
                options: importExport,
                header: "Import & Export",
                key: "importExportList"
            });

            allOptions.push(importExportList);

            var visualOptions = [
                {
                    content: React.DOM.div(null, React.DOM.input({
                        type: "checkbox",
                        id: "draw-click-popups",
                        name: "draw-click-popups",
                        defaultChecked: Options.drawClickPopups,
                        onChange: function () {
                            eventManager.dispatchEvent({
                                type: "toggleDrawClickPopups", content: ""
                            });
                        }
                    }), React.DOM.label({
                        htmlFor: "draw-click-popups"
                    }, "Draw click popups"))
                }
            ];
            var visualOptionList = UIComponents.OptionList({
                options: visualOptions,
                header: "Visual & Performance",
                key: "visualOptionList"
            });

            allOptions.push(visualOptionList);

            var otherOptions = [
                {
                    content: React.DOM.div(null, React.DOM.input({
                        type: "number",
                        id: "autosave-limit",
                        className: "small-number-input",
                        defaultValue: Options.autosaveLimit,
                        step: 1,
                        min: 1,
                        max: 9,
                        onChange: function (e) {
                            var _target = e.target;
                            var value = _target.value;
                            if (value === Options.autosaveLimit)
                                return;
                            eventManager.dispatchEvent({
                                type: "setAutosaveLimit",
                                content: value
                            });
                        }
                    }), React.DOM.label({
                        htmlFor: "autosave-limit"
                    }, "Autosave limit"))
                }
            ];
            var otherOptionList = UIComponents.OptionList({
                options: otherOptions,
                header: "Other",
                key: "otherOptionList"
            });

            allOptions.push(otherOptionList);

            return (React.DOM.div({ className: "all-options" }, React.DOM.a({
                id: "close-info", className: "close-popup", href: "#",
                onClick: this.toggleSelf,
                onTouchStart: this.toggleSelf
            }, "X"), allOptions));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=options.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuModifierButton = React.createClass({
        getInitialState: function () {
            return ({
                hasNewModifier: false,
                lastModifierCount: 0
            });
        },
        handleOpenModifiers: function () {
            this.setState({ hasNewModifier: false });
            eventManager.dispatchEvent({
                type: "makeModifierPopup",
                content: {
                    player: this.props.player,
                    modifierList: this.props.player.unlockedModifiers
                }
            });
        },
        componentWillReceiveProps: function (newProps) {
            var newModifierCount = newProps.player.unlockedModifiers.length;

            if (newModifierCount > this.state.lastModifierCount) {
                this.setState({ hasNewModifier: true });
            }

            this.setState({ lastModifierCount: newModifierCount });
        },
        render: function () {
            var player = this.props.player;
            var modifierCount = this.props.player.unlockedModifiers.length;

            if (modifierCount > this.state.lastModifierCount) {
                //this.setState({newModifier: true});
            }

            var divProps = {
                id: "side-menu-modifiers",
                className: "grid-cell interactive",
                onClick: this.handleOpenModifiers,
                onTouchStart: this.handleOpenModifiers
            };
            if (this.state.hasNewModifier) {
                //divProps.className += " new-modifier";
            }

            var divText = "Available upgrades: ";
            if (modifierCount > 0) {
                divText += modifierCount;
            }

            return (React.DOM.div(divProps, divText));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenumodifierbutton.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuTools = React.createClass({
        handleRecruit: function () {
            eventManager.dispatchEvent({
                type: "recruit",
                content: ""
            });
        },
        handleToolChange: function (type, e) {
            this.props.setSelectedTool(type);

            var continuous = false;

            if (type !== "click" && e && e.shiftKey)
                continuous = true;

            eventManager.dispatchEvent({
                type: "changeTool",
                content: {
                    type: type,
                    continuous: continuous
                }
            });
        },
        componentDidMount: function () {
            eventManager.addEventListener("buyHotkey", function (e) {
                ;
                this.handleToolChange("buy", e.content);
            }.bind(this));

            eventManager.addEventListener("sellHotkey", function (e) {
                this.handleToolChange("sell", e.content);
            }.bind(this));

            eventManager.addEventListener("clickHotkey", function (e) {
                this.handleToolChange("click", e.content);
            }.bind(this));

            eventManager.addEventListener("recruitHotkey", this.handleRecruit);
        },
        render: function () {
            var props = {
                click: {
                    ref: "click",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "click"),
                    onTouchStart: this.handleToolChange.bind(null, "click")
                },
                buy: {
                    ref: "buy",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "buy"),
                    onTouchStart: this.handleToolChange.bind(null, "buy")
                },
                sell: {
                    ref: "sell",
                    className: "grid-cell interactive",
                    onClick: this.handleToolChange.bind(null, "sell"),
                    onTouchStart: this.handleToolChange.bind(null, "sell")
                },
                recruit: {
                    ref: "recruit",
                    className: "grid-cell interactive",
                    onClick: this.handleRecruit,
                    onTouchStart: this.handleRecruit
                }
            };

            var selectedTool = this.props.selectedTool;
            if (Object.keys(this.props.player.employees).length < 1) {
                props.recruit.className += " new-modifier";

                props.buy.className = "grid-cell disabled";
                props.sell.className = "grid-cell disabled";
            } else if (selectedTool && props[selectedTool]) {
                props[selectedTool].className += " selected-tool";
            }

            return (React.DOM.div({ id: "side-menu-tools", className: "grid-column" }, React.DOM.div({ className: "grid-row" }, React.DOM.div(props.click, "click"), React.DOM.div(props.recruit, React.DOM.u(null, "r"), "ecruit")), React.DOM.div({ className: "grid-row" }, React.DOM.div(props.buy, "b", React.DOM.u(null, "u"), "y plot"), React.DOM.div(props.sell, React.DOM.u(null, "s"), "ell"))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenutools.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuStats = React.createClass({
        getInitialState: function () {
            return {
                hasLevelUpUpgrade: false,
                lastModifierCount: 0,
                canPrestige: false
            };
        },
        componentWillReceiveProps: function (newProps) {
            var newUpgradeCount = Object.keys(newProps.player.unlockedLevelUpModifiers).length;

            if (newUpgradeCount > 0) {
                this.setState({ hasLevelUpUpgrade: true });
            } else if (newProps.player.level >= 100) {
                this.setState({ canPrestige: true });
            }

            this.setState({ lastModifierCount: newUpgradeCount });
        },
        componentDidMount: function () {
            var money = this.refs.moneyText.getDOMNode();
            var profit = this.refs.profitText.getDOMNode();

            var exp = this.refs.exp.getDOMNode();

            var expText = this.refs.expText.getDOMNode();
            var levelText = this.refs.levelText.getDOMNode();

            eventManager.addEventListener("updatePlayerMoney", function (event) {
                money.innerHTML = event.content.total;
                profit.innerHTML = "$" + event.content.rolling + "/d";
            });

            eventManager.addEventListener("updatePlayerExp", function (event) {
                var expString = event.content.experience + " / " + event.content.nextLevel;
                var levelString = "Level   " + event.content.level + " ";

                exp.value = event.content.percentage;
                expText.innerHTML = expString;
                levelText.innerHTML = levelString;
            });

            // forces update, kinda dumb
            this.props.player.addMoney(0);
        },
        handleOpenModifiers: function () {
            var self = this;
            var player = this.props.player;
            var lastIndex = Object.keys(player.unlockedLevelUpModifiers).length - 1;
            var lowestLevel = Object.keys(player.unlockedLevelUpModifiers).sort(function (a, b) {
                return parseInt(a) < parseInt(b) ? 1 : -1;
            })[lastIndex];

            var lowestModifierList = player.unlockedLevelUpModifiers[lowestLevel];

            if (!lowestModifierList) {
                this.setState({
                    hasLevelUpUpgrade: false
                });

                return;
            }

            eventManager.dispatchEvent({
                type: "makeModifierPopup",
                content: {
                    player: player,
                    text: [
                        "Select your bonus perk for level " + lowestLevel,
                        "You only get to pick one"],
                    modifierList: lowestModifierList,
                    excludeCost: true,
                    okBtnText: "Select",
                    onOk: function (selected) {
                        var success = player.addLevelUpModifier(selected.data.modifier);
                        eventManager.dispatchEvent({ type: "updateReact", content: "" });

                        self.setState({
                            hasLevelUpUpgrade: false
                        });

                        if (success !== false)
                            return true;
                        else
                            return false;
                    }
                }
            });
        },
        handleOpenPrestige: function () {
            if (!this.state.canPrestige) {
                return;
            }
            var onResetFN = function () {
                this.setState({ canPrestige: false });
            }.bind(this);

            eventManager.dispatchEvent({
                type: "prestigeReset",
                content: onResetFN
            });
        },
        render: function () {
            var progressProps = {
                id: "player-level",
                ref: "exp",
                value: 0,
                max: 100
            };
            var divProps = {
                id: "player-level-wrapper"
            };

            if (this.state.hasLevelUpUpgrade) {
                progressProps.className = "new-modifier";

                divProps.onClick = this.handleOpenModifiers;
                divProps.onTouchStart = this.handleOpenModifiers;
                divProps.className = "interactive";
            } else if (this.state.canPrestige) {
                progressProps.className = "new-modifier";

                divProps.onClick = this.handleOpenPrestige;
                divProps.onTouchStart = this.handleOpenPrestige;
                divProps.className = "interactive";
            }

            return (React.DOM.div({ id: "side-menu-stats" }, React.DOM.div(divProps, React.DOM.progress(progressProps), React.DOM.div({
                id: "level-string-container"
            }, React.DOM.div({
                id: "level-string-wrapper",
                className: "stat-string-wrapper"
            }, React.DOM.span({
                ref: "levelText"
            }, null), React.DOM.span({
                ref: "expText"
            }, null)))), React.DOM.div({ id: "money-string-container" }, React.DOM.div({
                id: "money-string-wrapper",
                className: "stat-string-wrapper"
            }, React.DOM.span({
                ref: "moneyText"
            }, null), React.DOM.span({
                ref: "profitText"
            }, null)))));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenustats.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuSave = React.createClass({
        handleSave: function () {
            eventManager.dispatchEvent({
                type: "makeSavePopup", content: ""
            });
        },
        handleLoad: function () {
            eventManager.dispatchEvent({
                type: "makeLoadPopup", content: ""
            });
        },
        render: function () {
            return (React.DOM.div({ id: "save-buttons", className: "grid-row" }, React.DOM.div({
                className: "grid-cell interactive",
                onClick: this.handleSave,
                onTouchStart: this.handleSave
            }, "save"), React.DOM.div({
                className: "grid-cell interactive",
                onClick: this.handleLoad,
                onTouchStart: this.handleLoad
            }, "load")));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenusave.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuZoom = React.createClass({
        getInitialState: function () {
            return { zoom: 1 };
        },
        handleZoomChange: function (event) {
            var target = event.target;

            this.setState({ zoom: parseFloat(target.value) });
        },
        handleZoomSubmit: function (event) {
            event.preventDefault();
            eventManager.dispatchEvent({ type: "changeZoom", content: this.state.zoom });
            return false;
        },
        handleMapmodeChange: function (event) {
            var target = event.target;

            eventManager.dispatchEvent({ type: "changeMapmode", content: target.value });
        },
        componentDidMount: function () {
            var self = this;
            var el = this.refs.zoomValue.getDOMNode();

            eventManager.addEventListener("updateZoomValue", function (e) {
                el.value = e.content.toFixed(3);
                self.setState({ zoom: e.content });
            });
        },
        render: function () {
            var options = [];

            ["terrain", "landValue", "underground"].forEach(function (type) {
                var props = {
                    key: type,
                    value: type
                };
                var option = React.DOM.option(props, type);
            });

            return (React.DOM.select({
                id: "side-menu-mapmode-select",
                value: "landValue"
            }, options), React.DOM.form({
                id: "side-menu-zoom",
                className: "grid-row",
                onSubmit: this.handleZoomSubmit
            }, React.DOM.input({
                id: "zoom-amount",
                ref: "zoomValue",
                className: "grid-row",
                type: "number",
                defaultValue: "1",
                step: 0.1,
                onChange: this.handleZoomChange
            }), React.DOM.button({ id: "zoomBtn", className: "grid-row" }, "zoom")));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenuzoom.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuMapmode = React.createClass({
        handleMapmodeChange: function (event) {
            var target = event.target;

            eventManager.dispatchEvent({ type: "changeMapmode", content: target.value });
        },
        render: function () {
            var options = [];

            ["terrain", "landValue", "underground"].forEach(function (type) {
                var props = {
                    key: type,
                    value: type
                };

                var title = type === "landValue" ? "land value" : type;
                options.push(React.DOM.option(props, title));
            });

            return (React.DOM.select({
                id: "side-menu-mapmode-select",
                className: "grid-row",
                defaultValue: "landValue",
                title: "Map mode",
                onChange: this.handleMapmodeChange
            }, options));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenumapmode.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../../data/js/cg.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    *   player
    *   buildableTypes
    */
    UIComponents.SideMenuBuildings = React.createClass({
        getInitialState: function () {
            return ({
                beautifyIndex: 0,
                lastSelectedBuilding: playerBuildableBuildings[0],
                currentPopOver: null
            });
        },
        drawPopOver: function (building, parentRef) {
            if (this.state.currentPopOver === building.type)
                return;
            var popOverNode = this.refs.popOver.getDOMNode();

            var effectInfo = [
                { title: "Affected by", target: effectSourcesIndex[building.categoryType] },
                { title: "Affects", target: building.effectTargets }
            ];

            if (!this.indexedPopoverContent)
                this.indexedPopoverContent = {};
            if (!this.indexedPopoverContent[building.type]) {
                var content = "";
                content += "<div>Base profit $" + building.baseProfit + "/d</div>";

                effectInfo.forEach(function (info) {
                    if (!info.target || (info.target.positive.length < 1 && info.target.negative.length < 1)) {
                        return;
                    }
                    content += "<h4>" + info.title + "</h4>";
                    content += "<div class='tooltip-modifiers-container'>";
                    for (var polarity in info.target) {
                        var effects = info.target[polarity];

                        content += "<div class='tooltip-modifiers " + "tooltip-modifiers-" + polarity + "'>";

                        //content += "<h5 class='tooltip-modifiers-header'>";
                        //  content += capitalize(polarity);
                        //content += "</h5>";
                        content += "<ul>";
                        for (var i = 0; i < effects.length; i++) {
                            content += "<li>" + capitalize(effects[i]) + "</li>";
                        }
                        content += "</ul>";
                        content += "</div>";
                    }
                    content += "</div>";
                });
                this.indexedPopoverContent[building.type] = content;
            }

            popOverNode.innerHTML = this.indexedPopoverContent[building.type];

            popOverNode.classList.remove("hidden");
            popOverNode.style.top = this.refs[parentRef].getDOMNode().getBoundingClientRect().top + "px";

            this.setState({ currentPopOver: building.type });
        },
        hidePopOver: function () {
            if (!this.state.currentPopOver)
                return;
            this.refs.popOver.getDOMNode().classList.add("hidden");
            this.setState({ currentPopOver: null });
        },
        handleBuildingSelect: function (building, e) {
            if (this.props.player.money < this.props.player.getBuildCost(building)) {
                return;
            }
            this.props.setSelectedTool(building.type);
            this.setState({ lastSelectedBuilding: building });

            var continuous = e && e.shiftKey ? e.shiftKey : false;

            eventManager.dispatchEvent({
                type: "changeBuildingType",
                content: {
                    building: building,
                    continuous: continuous
                }
            });
        },
        componentDidMount: function () {
            eventManager.addEventListener("resizeSmaller", function (e) {
                this.setState({ beautifyIndex: 2 });
            }.bind(this));

            eventManager.addEventListener("resizeBigger", function (e) {
                this.setState({ beautifyIndex: 0 });
            }.bind(this));

            eventManager.addEventListener("buildHotkey", function (e) {
                this.handleBuildingSelect(this.state.lastSelectedBuilding, e.content);
            }.bind(this));
        },
        render: function () {
            var divs = [];
            var player = this.props.player;

            for (var i = 0; i < playerBuildableBuildings.length; i++) {
                var building = playerBuildableBuildings[i];

                var buildCost = player.getBuildCost(building);
                var canAfford = player.money >= buildCost;
                var amountBuilt = player.amountBuiltPerType[building.type];

                var divProps = {
                    className: "side-building",
                    key: building.type,
                    ref: building.type,
                    onMouseLeave: this.hidePopOver,
                    onTouchStart: this.handleBuildingSelect.bind(null, building),
                    onMouseEnter: this.drawPopOver.bind(null, building, building.type)
                };

                /*
                for (var polarity in building.effectTargets)
                {
                var targets = building.effectTargets[polarity];
                if (targets.length < 1) continue;
                else
                {
                var poleSign = (polarity === "negative") ? "-" : "+";
                divProps.title += "\n-----";
                divProps.title += "\n" + polarity + " effects:";
                
                for (var j = 0; j < targets.length; j++)
                {
                divProps.title += "\n" + targets[j] + " " + poleSign;
                }
                }
                }*/
                var imageProps = { className: "building-image" };
                var titleProps = { className: "building-title" };
                var costProps = { className: "building-cost" };
                var amountProps = { className: "building-amount" };

                if (!canAfford) {
                    divProps.className += " disabled";
                    costProps.className += " insufficient";
                } else {
                    divProps.className += " interactive";
                    divProps.onClick = this.handleBuildingSelect.bind(null, building);
                }

                if (this.props.selectedTool && this.props.selectedTool === building.type) {
                    divProps.className += " selected-tool";
                }

                var costText = "" + beautify(buildCost, this.state.beautifyIndex);

                if (this.state.beautifyIndex < 2) {
                    costText += "$";
                }

                var image = this.props.frameImages[building.icon];
                imageProps.src = image.src;

                var div = React.DOM.div(divProps, React.DOM.div({ className: "building-image-container" }, React.DOM.img(imageProps, null)), React.DOM.div({ className: "building-content" }, React.DOM.div({ className: "building-content-wrapper" }, React.DOM.div(titleProps, building.title), React.DOM.div(costProps, costText)), React.DOM.div(amountProps, amountBuilt)));

                divs.push(div);
            }

            return (React.DOM.div({ id: "side-menu-buildings", className: "grid-column" }, divs, React.DOM.div({
                id: "building-popover",
                className: "hidden",
                ref: "popOver"
            }, "asdjhksadhja")));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenubuildings.js.map

/// <reference path="../../lib/react.d.ts" />
/// <reference path="js/sidemenubuildings.d.ts" />
/// <reference path="js/sidemenuzoom.d.ts" />
/// <reference path="js/sidemenumapmode.d.ts" />
/// <reference path="js/sidemenusave.d.ts" />
/// <reference path="js/sidemenustats.d.ts" />
/// <reference path="js/sidemenutools.d.ts" />
/// <reference path="js/sidemenumodifierbutton.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenu = React.createClass({
        getInitialState: function () {
            return { selectedTool: null };
        },
        setSelectedTool: function (type) {
            this.setState({ selectedTool: type });
        },
        render: function () {
            return (React.DOM.div({ id: "react-side-menu" }, UIComponents.SideMenuTools({
                player: this.props.player,
                setSelectedTool: this.setSelectedTool,
                selectedTool: this.state.selectedTool
            }), UIComponents.SideMenuBuildings({
                player: this.props.player,
                frameImages: this.props.frameImages,
                setSelectedTool: this.setSelectedTool,
                selectedTool: this.state.selectedTool,
                // Todo react definitions
                beautifyIndex: null,
                lastSelectedBuilding: null
            }), React.DOM.div({ id: "side-menu-other-buttons", className: "grid-column" }, UIComponents.SideMenuSave(), UIComponents.SideMenuMapmode(), UIComponents.SideMenuZoom()), UIComponents.SideMenuStats({
                player: this.props.player,
                // Todo react definitions
                hasLevelUpUpgrade: null,
                lastModifierCount: null
            }), UIComponents.SideMenuModifierButton({
                player: this.props.player,
                // Todo react definitions
                hasNewModifier: null,
                lastModifierCount: null
            })));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenu.js.map

/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/sidemenu.d.ts" />
/// <reference path="js/stats.d.ts" />
/// <reference path="js/options.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Stage = React.createClass({
        getDefaultProps: function () {
            return ({
                fullScreenPopups: {
                    stats: function () {
                        return (React.DOM.div({ className: "fullscreen-popup-wrapper" }, React.DOM.div({ id: "stats-container", className: "fullscreen-popup" }, UIComponents.Stats({ player: this.props.player }))));
                    },
                    options: function () {
                        return (React.DOM.div({ className: "fullscreen-popup-wrapper" }, React.DOM.div({ id: "options-container", className: "fullscreen-popup" }, UIComponents.OptionsPopup(null))));
                    }
                }
            });
        },
        getInitialState: function () {
            return { showFullScreenPopup: null };
        },
        componentDidMount: function () {
            var self = this;
            eventManager.addEventListener("toggleFullScreenPopup", function (event) {
                if (event.content === self.state.showFullScreenPopup) {
                    self.setState({ showFullScreenPopup: null });
                } else {
                    self.setState({ showFullScreenPopup: event.content });
                }
            });
        },
        render: function () {
            var self = this;
            var popups = [];
            for (var _popup in this.props.popups) {
                var popup = this.props.popups[_popup];
                popups.push(UIComponents[popup.type].call(null, popup.props));
            }
            ;

            var fullScreenPopup = this.state.showFullScreenPopup ? this.props.fullScreenPopups[this.state.showFullScreenPopup].call(this) : null;

            return (React.DOM.div({ id: "react-wrapper" }, React.DOM.div({
                id: "react-popups",
                onDragEnter: function (e) {
                    e.preventDefault();
                },
                onDragOver: function (e) {
                    e.preventDefault();
                },
                onDrop: function (e) {
                    e.preventDefault();
                },
                onDragLeave: function (e) {
                    e.preventDefault();
                }
            }, popups), fullScreenPopup, UIComponents.SideMenu({
                player: this.props.player,
                frameImages: this.props.frameImages,
                // todo react definitions
                selectedTool: null
            })));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=stage.js.map

/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
///
/// <reference path="../../data/js/cg.d.ts" />
///
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/actions.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/employeeaction.d.ts" />
/// <reference path="js/modifierpopup.d.ts" />
/// <reference path="js/employeeactionpopup.d.ts" />
/// <reference path="js/inputpopup.d.ts" />
/// <reference path="js/actioninfo.d.ts" />
/// <reference path="js/stage.d.ts" />
var ReactUI = (function () {
    function ReactUI(player, frameImages) {
        this.idGenerator = 0;
        this.popups = {};
        this.topZIndex = 15;
        this.player = player;
        this.frameImages = frameImages;
        this.init();
    }
    ReactUI.prototype.init = function () {
        React.initializeTouchEvents(true);
        this.addEventListeners();

        this.updateReact();

        // chrome doesnt work when called via reuqestAnimationFrame
        this.updateInterval = window.setInterval(this.updateReact.bind(this), 1000);
    };
    ReactUI.prototype.addEventListeners = function () {
        var self = this;

        eventManager.addEventListener("makeEmployeeActionPopup", function (event) {
            self.makeEmployeeActionPopup(event.content);
        });
        eventManager.addEventListener("makeRecruitPopup", function (event) {
            self.makeRecruitPopup(event.content);
        });
        eventManager.addEventListener("makeRecruitCompletePopup", function (event) {
            self.makeRecruitCompletePopup(event.content);
        });
        eventManager.addEventListener("makeCellBuyPopup", function (event) {
            self.makeCellBuyPopup(event.content);
        });
        eventManager.addEventListener("makeConfirmPopup", function (event) {
            self.makeConfirmPopup(event.content);
        });
        eventManager.addEventListener("makePopup", function (event) {
            self.makePopup(event.content.type, event.content.props);
        });
        eventManager.addEventListener("makeInfoPopup", function (event) {
            self.makeInfoPopup(event.content);
        });
        eventManager.addEventListener("makeBuildingSelectPopup", function (event) {
            self.makeBuildingSelectPopup(event.content);
        });
        eventManager.addEventListener("makeBuildingConstructPopup", function (event) {
            self.makeBuildingConstructPopup(event.content);
        });
        eventManager.addEventListener("makeInputPopup", function (event) {
            self.makeInputPopup(event.content);
        });
        eventManager.addEventListener("makeLoadPopup", function (event) {
            self.makeLoadPopup();
        });
        eventManager.addEventListener("makeSavePopup", function (event) {
            self.makeSavePopup();
        });
        eventManager.addEventListener("makeModifierPopup", function (event) {
            self.makeModifierPopup(event.content);
        });
        eventManager.addEventListener("closeTopPopup", function (event) {
            self.closeTopPopup();
        });
        eventManager.addEventListener("updateReact", function (event) {
            self.updateReact();
        });
    };

    ///// /////
    ReactUI.prototype.makePopup = function (type, props) {
        var key = this.idGenerator++;

        var onCloseCallback = props.onClose;
        props.onClose = function () {
            this.destroyPopup(key, onCloseCallback);
        }.bind(this);

        var zIndex = this.incrementZIndex();
        var popupProps = {};
        for (var prop in props) {
            popupProps[prop] = props[prop];
        }
        ;
        popupProps.key = key;
        popupProps.initialStyle = {
            top: window.innerHeight / 3.5 - 60 + Object.keys(this.popups).length * 15,
            left: window.innerWidth / 3.5 - 60 + Object.keys(this.popups).length * 15,
            zIndex: zIndex
        };
        popupProps.incrementZIndex = this.incrementZIndex.bind(this, key);

        var popup = {
            type: type,
            props: popupProps,
            zIndex: zIndex
        };

        this.popups[key] = popup;
        this.updateReact();
    };

    ReactUI.prototype.makeEmployeeActionPopup = function (props) {
        this.makePopup("EmployeeActionPopup", props);
    };

    ReactUI.prototype.makeInfoPopup = function (props) {
        this.makePopup("InfoPopup", props);
    };
    ReactUI.prototype.makeLoadPopup = function () {
        this.makePopup("LoadPopup", {
            onOk: function (name) {
                eventManager.dispatchEvent({
                    type: "loadGame",
                    content: name
                });
            }
        });
    };

    ReactUI.prototype.makeSavePopup = function () {
        this.makePopup("SavePopup", {
            onOk: function (name) {
                eventManager.dispatchEvent({
                    type: "saveGame",
                    content: name
                });
            }
        });
    };

    ReactUI.prototype.makeModifierPopup = function (props) {
        var onOk = props.onOk || function (selected) {
            props.player.addModifier(selected.data.modifier);
            eventManager.dispatchEvent({ type: "updateReact", content: "" });

            return false;
        };

        this.makePopup("ModifierPopup", {
            player: props.player,
            text: props.text || null,
            modifierList: props.modifierList || props.player.unlockedModifiers,
            excludeCost: props.excludeCost || false,
            onOk: onOk,
            onClose: props.onClose || null,
            okBtnText: props.okBtnText || "Buy"
        });
    };

    ReactUI.prototype.makeRecruitPopup = function (props) {
        var self = this;
        var recruitWithSelected = function (selected) {
            actions.recruitEmployee({
                playerId: props.player.id,
                employeeId: selected.employee.id
            });
        };
        this.makeEmployeeActionPopup({
            player: props.player,
            relevantSkills: ["recruitment"],
            text: "Select employee in charge of recruitment",
            onOk: recruitWithSelected,
            okBtnText: "Select",
            action: {
                actionText: "Scouting new employees would take:",
                data: {
                    time: {
                        approximate: true,
                        amount: 14
                    }
                }
            }
        });
    };

    ReactUI.prototype.makeRecruitCompletePopup = function (props) {
        var self = this;
        var recruitConfirmFN = function (selected) {
            props.player.addEmployee(selected.employee);
        };

        if (!isFinite(props.delay))
            props.delay = 2000;

        var recruitCloseFN = function (selected) {
            if (props.recruitingEmployee) {
                props.recruitingEmployee.active = true;
                self.updateReact();
            }
        };
        this.makeEmployeeActionPopup({
            employees: props.employees,
            text: props.text || "Choose employee to recruit",
            onOk: recruitConfirmFN,
            onClose: recruitCloseFN,
            okBtnText: "Recruit",
            activationDelay: props.delay
        });
    };

    ReactUI.prototype.makeCellBuyPopup = function (props) {
        if (Object.keys(props.player.employees).length < 1) {
            this.makeInfoPopup({ text: "Recruit some employees first" });
            return;
        }

        if (props.player.ownedCells[props.cell.gridPos])
            return;
        if (props.cell.type.type === "water")
            return;

        var buyCost = props.player.getCellBuyCost(props.cell);

        var buySelected = function (selected) {
            var adjusted = actions.getActionCost([selected.employee.skills["negotiation"]], buyCost).actual;

            if (props.player.money < adjusted) {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup",
                    content: {
                        text: "Not enough funds"
                    }
                });

                return false;
            }

            actions.buyCell({
                gridPos: props.cell.gridPos,
                boardId: props.cell.board.id,
                playerId: props.player.id,
                employeeId: selected.employee.id
            });

            if (props.onOk)
                props.onOk.call();
            return true;
        };
        this.makeEmployeeActionPopup({
            player: props.player,
            relevantSkills: ["negotiation"],
            text: "Select employee in charge of purchasing the plot",
            onOk: buySelected,
            okBtnText: "Buy",
            action: {
                target: props.cell,
                actionText: "Buying this plot would take:",
                data: {
                    time: {
                        approximate: true,
                        amount: 14
                    },
                    cost: {
                        approximate: false,
                        amount: buyCost
                    }
                }
            }
        });
    };
    ReactUI.prototype.makeConfirmPopup = function (props) {
        this.makePopup("ConfirmPopup", props);
    };
    ReactUI.prototype.makeBuildingSelectPopup = function (props) {
        if (Object.keys(props.player.employees).length < 1) {
            this.makeInfoPopup({ text: "Recruit some employees first" });
            return;
        }

        this.makePopup("BuildingListPopup", {
            player: props.player,
            buildingTemplates: cg.content.buildings,
            buildingImages: this.frameImages,
            onOk: props.onOk
        });
    };
    ReactUI.prototype.makeBuildingConstructPopup = function (props) {
        var buildBuilding = function (selected) {
            if (selected) {
                actions.constructBuilding({
                    playerId: props.player.id,
                    gridPos: props.cell.gridPos,
                    boardId: props.cell.board.id,
                    buildingType: props.buildingTemplate.type,
                    employeeId: selected.employee.id
                });
                props.onOk.call();
            }
        };
        this.makeEmployeeActionPopup({
            player: props.player,
            relevantSkills: ["construction"],
            text: "Select employee in charge of construction",
            onOk: buildBuilding,
            okBtnText: "Build",
            action: {
                target: props.cell,
                actionText: "Constructing this building would take:",
                data: {
                    time: {
                        approximate: true,
                        amount: props.buildingTemplate.buildTime
                    },
                    cost: {
                        approximate: false,
                        amount: props.player.getBuildCost(props.buildingTemplate)
                    }
                },
                baseDuration: props.buildingTemplate.buildTime,
                exactCost: props.buildingTemplate.cost
            }
        });
    };

    ReactUI.prototype.makeInputPopup = function (props) {
        this.makePopup("InputPopup", props);
    };

    ///// OTHER METHODS /////
    ReactUI.prototype.incrementZIndex = function (key) {
        var newZIndex = this.topZIndex++;
        if (key) {
            this.popups[key].zIndex = newZIndex;
        }
        return newZIndex;
    };
    ReactUI.prototype.destroyPopup = function (key, callback) {
        if (callback)
            callback.call();

        this.popups[key] = null;
        delete this.popups[key];

        this.updateReact();
    };
    ReactUI.prototype.closeTopPopup = function () {
        if (Object.keys(this.popups).length < 1)
            return;
        else {
            var max = 0;
            var key;
            for (var popup in this.popups) {
                if (this.popups[popup].zIndex > max) {
                    max = this.popups[popup].zIndex;
                    key = popup;
                }
            }
            this.destroyPopup(key);
        }
    };
    ReactUI.prototype.clearAllPopups = function () {
        this.popups = {};
    };

    ReactUI.prototype.updateReact = function () {
        if (document.hidden) {
            return;
        }

        React.renderComponent(UIComponents.Stage({
            popups: this.popups, player: this.player,
            frameImages: this.frameImages, showStats: null }), document.getElementById("react-container"));
    };
    return ReactUI;
})();
//# sourceMappingURL=reactui.js.map

var arrayLogic = function (logic, array1, array2) {
    var regexes = {
        and: /(and)|&/i,
        not: /(not)|!/i,
        or: /(or)|\^/i
    };

    var mode;
    for (var re in regexes) {
        if (regexes[re].test(logic))
            mode = re;
    }
    if (!mode)
        throw new Error("faulty parameter: " + logic);
    switch (mode) {
        case "and": {
            return arrayLogic.and(array1, array2);
        }
        case "not": {
            return arrayLogic.not(array1, array2);
        }
        case "or": {
            return arrayLogic.or(array1, array2);
        }
    }
};

arrayLogic.and = function (array1, array2) {
    if (!arrayLogic.inputIsValid(array1, array2)) {
        return undefined;
    }
    var matchFound;
    for (var i = 0; i < array1.length; i++) {
        matchFound = false;
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] === array2[j]) {
                matchFound = true;
                break;
            }
        }
    }
    return matchFound;
};

arrayLogic.not = function (array1, array2) {
    if (!arrayLogic.inputIsValid(array1, array2)) {
        return undefined;
    }

    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] === array2[j]) {
                return false;
            }
        }
    }
    return true;
};

arrayLogic.or = function (array1, array2) {
    if (!arrayLogic.inputIsValid(array1, array2)) {
        return undefined;
    }
    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] === array2[j]) {
                return true;
            }
        }
    }
    return false;
};

arrayLogic.inputIsValid = function (array1, array2) {
    for (var i = 0; i < arguments.length; i++) {
        if (!arguments[i] || !arguments[i].length || arguments[i].length === 0) {
            return false;
        }
    }

    return true;
};
//# sourceMappingURL=arraylogic.js.map

var playerModifiers;
(function (playerModifiers) {
    playerModifiers.testModifier = {
        type: "testModifier",
        title: "testing",
        description: "test",
        effects: [
            {
                targets: ["global"],
                addedProfit: 50
            },
            {
                targets: ["fastfood"],
                multiplier: 4
            }
        ]
    };

    playerModifiers.prestigeDefault = {
        type: "prestigeDefault",
        title: "Default prestige modifier",
        description: "1% total profit per prestige",
        dynamicEffect: {
            "prestige": function (player) {
                player.addSpecialModifier({
                    type: "prestigeDefault",
                    title: "Default prestige modifier",
                    description: "0.5% total profit per prestige",
                    effects: [
                        {
                            targets: ["global"],
                            multiplier: 1 + player.prestige * 0.005
                        }
                    ]
                });
            }
        }
    };

    playerModifiers.clickModifier1 = {
        type: "clickModifier1",
        title: "Hardly working",
        description: "+0.2$ / click",
        cost: 50,
        unlockConditions: [
            {
                type: "level",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["click"],
                addedProfit: 0.2
            }
        ]
    };
    playerModifiers.clickModifier2 = {
        type: "clickModifier2",
        title: "Working hard",
        description: "+0.5$ / click",
        cost: 200,
        unlockConditions: [
            {
                type: "clicks",
                value: 200
            }
        ],
        effects: [
            {
                targets: ["click"],
                addedProfit: 0.5
            }
        ]
    };
    playerModifiers.clickModifier3 = {
        type: "clickModifier3",
        title: "Rolled up sleeves",
        description: "Clicking profit +20%",
        cost: 1000,
        unlockConditions: [
            {
                type: "clicks",
                value: 400
            },
            {
                type: "money",
                value: 250
            }
        ],
        effects: [
            {
                targets: ["click"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.clickModifier4 = {
        type: "clickModifier4",
        title: "A little bit of elbow grease",
        description: "Clicking profit +20%",
        cost: 5000,
        unlockConditions: [
            {
                type: "clicks",
                value: 600
            },
            {
                type: "money",
                value: 2000
            }
        ],
        effects: [
            {
                targets: ["click"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.clickModifier5 = {
        type: "clickModifier5",
        title: "A lot more elbow grease",
        description: "Clicking profit +50%",
        cost: 25000,
        unlockConditions: [
            {
                type: "clicks",
                value: 900
            },
            {
                type: "money",
                value: 10000
            }
        ],
        effects: [
            {
                targets: ["click"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.clickModifier6 = {
        type: "clickModifier6",
        title: "Way too much elbow grease",
        description: "Clicking profit +50%",
        cost: 100000,
        unlockConditions: [
            {
                type: "clicks",
                value: 1200
            },
            {
                type: "money",
                value: 50000
            }
        ],
        effects: [
            {
                targets: ["click"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.parkingModifier1 = {
        type: "parkingModifier1",
        title: "Boom gates",
        description: "Parking +0.1$ /s",
        cost: 50,
        unlockConditions: [
            {
                type: "parking",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["parking"],
                addedProfit: 0.1
            }
        ]
    };
    playerModifiers.parkingModifier2 = {
        type: "parkingModifier2",
        title: "Parking space effeciency",
        description: "Parking profits +20%",
        cost: 500,
        unlockConditions: [
            {
                type: "parking",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["parking"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.parkingModifier3 = {
        type: "parkingModifier3",
        title: "Parking elevators",
        description: "Parking profits +20%",
        cost: 2000,
        unlockConditions: [
            {
                type: "parking",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["parking"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.parkingModifier4 = {
        type: "parkingModifier4",
        title: "Parking hyperspace efficiency",
        description: "Parking profits +50%",
        cost: 10000,
        unlockConditions: [
            {
                type: "parking",
                value: 10
            }
        ],
        effects: [
            {
                targets: ["parking"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.parkingModifier5 = {
        type: "parkingModifier5",
        title: "Street parking meters",
        description: "Parking profits +50%",
        cost: 50000,
        unlockConditions: [
            {
                type: "parking",
                value: 15
            }
        ],
        effects: [
            {
                targets: ["parking"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.convenienceModifier1 = {
        type: "convenienceModifier1",
        title: "Newspaper stands",
        description: "Retail buildings +0.5$ /s",
        cost: 300,
        unlockConditions: [
            {
                type: "shopping",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["shopping"],
                addedProfit: 0.5
            }
        ]
    };
    playerModifiers.convenienceModifier2 = {
        type: "convenienceModifier2",
        title: "Lottery tickets",
        description: "Retail buildings +2$ /s",
        cost: 1500,
        unlockConditions: [
            {
                type: "shopping",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["shopping"],
                addedProfit: 2
            }
        ]
    };
    playerModifiers.convenienceModifier3 = {
        type: "convenienceModifier3",
        title: "Liquor license",
        description: "Retail profits +30%",
        cost: 5000,
        unlockConditions: [
            {
                type: "shopping",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["shopping"],
                multiplier: 1.3
            }
        ]
    };
    playerModifiers.convenienceModifier4 = {
        type: "convenienceModifier4",
        title: "Loss leaders",
        description: "Retail profits + 50%",
        cost: 50000,
        unlockConditions: [
            {
                type: "shopping",
                value: 10
            }
        ],
        effects: [
            {
                targets: ["shopping"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.convenienceModifier5 = {
        type: "convenienceModifier5",
        title: "Market saturation",
        description: "Retail profits + 50% - 1% per retail building",
        cost: 250000,
        unlockConditions: [
            {
                type: "shopping",
                value: 15
            }
        ],
        effects: [
            {
                targets: ["shopping"],
                multiplier: 1.5
            }
        ],
        dynamicEffect: {
            "shopping": function (player) {
                player.addSpecialModifier({
                    type: "convenienceModifier5",
                    title: "Market saturation",
                    description: "Retail profits + 50% - 1% per retail building",
                    effects: [
                        {
                            targets: ["shopping"],
                            multiplier: 1 - (player.amountBuiltPerCategory["shopping"] * 0.01)
                        }
                    ]
                });
            }
        }
    };
    playerModifiers.fastFoodModifier1 = {
        type: "fastFoodModifier1",
        title: "Jumbo-size fries",
        description: "Fast food restaurants +1.5$ /s",
        cost: 700,
        unlockConditions: [
            {
                type: "fastfood",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                addedProfit: 1.5
            }
        ]
    };
    playerModifiers.fastFoodModifier2 = {
        type: "fastFoodModifier2",
        title: "Jumbo-size soda cups",
        description: "Fast food restaurants +4$ /s",
        cost: 2500,
        unlockConditions: [
            {
                type: "fastfood",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                addedProfit: 4
            }
        ]
    };
    playerModifiers.fastFoodModifier3 = {
        type: "fastFoodModifier3",
        title: "Jumbo-size diet soda cups",
        description: "Fast food restaurant profits +30%",
        cost: 7500,
        unlockConditions: [
            {
                type: "fastfood",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                multiplier: 1.3
            }
        ]
    };
    playerModifiers.fastFoodModifier4 = {
        type: "fastFoodModifier4",
        title: "Jumbo-size set meals",
        description: "Fast food restaurant profits + 50%",
        cost: 35000,
        unlockConditions: [
            {
                type: "fastfood",
                value: 10
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.fastFoodModifier5 = {
        type: "fastFoodModifier5",
        title: "Chocolate chip cookies",
        description: "Fast food restaurant profits + 33%\nClicking profit +2% per restaurant",
        cost: 150000,
        unlockConditions: [
            {
                type: "fastfood",
                value: 15
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                multiplier: 1.33
            }
        ],
        dynamicEffect: {
            "fastfood": function (player) {
                player.addSpecialModifier({
                    type: "fastFoodModifier5",
                    title: "Chocolate chip cookies",
                    description: "Fast food restaurant profits + 33%\nClicking profit +2% per restaurant",
                    effects: [
                        {
                            targets: ["click"],
                            multiplier: 1 + (player.amountBuiltPerCategory["fastfood"] * 0.02)
                        }
                    ]
                });
            }
        }
    };
    playerModifiers.apartmentModifier1 = {
        type: "apartmentModifier1",
        title: "Central heating",
        description: "Apartments +4$ /s",
        cost: 1500,
        unlockConditions: [
            {
                type: "apartment",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                addedProfit: 4
            }
        ]
    };
    playerModifiers.apartmentModifier2 = {
        type: "apartmentModifier2",
        title: "Air conditioning",
        description: "Apartments +8$ /s",
        cost: 5000,
        unlockConditions: [
            {
                type: "apartment",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                addedProfit: 8
            }
        ]
    };
    playerModifiers.apartmentModifier3 = {
        type: "apartmentModifier3",
        title: "Soundproof Walls",
        description: "Apartment profits +20%",
        cost: 15000,
        unlockConditions: [
            {
                type: "apartment",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.apartmentModifier4 = {
        type: "apartmentModifier4",
        title: "Fitness centers",
        description: "Apartment profits + 50%",
        cost: 75000,
        unlockConditions: [
            {
                type: "apartment",
                value: 10
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.apartmentModifier5 = {
        type: "apartmentModifier5",
        title: "Modular apartment buildings",
        description: "Apartment building cost -33%",
        cost: 250000,
        unlockConditions: [
            {
                type: "apartment",
                value: 15
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                buildCost: {
                    multiplier: 0.67
                }
            }
        ]
    };
    playerModifiers.officeModifier1 = {
        type: "officeModifier1",
        title: "Red staplers",
        description: "Offices +8$ /s",
        cost: 5000,
        unlockConditions: [
            {
                type: "office",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["office"],
                addedProfit: 8
            }
        ]
    };
    playerModifiers.officeModifier2 = {
        type: "officeModifier2",
        title: "Ass-resistant photocopiers",
        description: "Office profits +20%",
        cost: 15000,
        unlockConditions: [
            {
                type: "office",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["office"],
                multiplier: 1.2
            }
        ]
    };
    playerModifiers.officeModifier3 = {
        type: "officeModifier3",
        title: "Ass-seeking photocopiers",
        description: "Office profits + 50%",
        cost: 50000,
        unlockConditions: [
            {
                type: "office",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["office"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.officeModifier4 = {
        type: "officeModifier4",
        title: "Middle management",
        description: "Office profits + 50%",
        cost: 200000,
        unlockConditions: [
            {
                type: "office",
                value: 10
            }
        ],
        effects: [
            {
                targets: ["office"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.officeModifier5 = {
        type: "officeModifier5",
        title: "Corporate real estate",
        description: "Office profits + 25%\nBuying plots 2% cheaper per office",
        cost: 500000,
        unlockConditions: [
            {
                type: "office",
                value: 15
            }
        ],
        effects: [
            {
                targets: ["office"],
                multiplier: 1.25
            }
        ],
        dynamicEffect: {
            "office": function (player) {
                player.addSpecialModifier({
                    type: "officeModifier5",
                    title: "Corporate real estate",
                    description: "Office profits + 25%\nBuying plots 2% cheaper per office",
                    effects: [
                        {
                            targets: ["global"],
                            buyCost: {
                                multiplier: 1 - player.amountBuiltPerCategory["office"] * 0.02
                            }
                        }
                    ]
                });
            }
        }
    };
    playerModifiers.factoryModifier1 = {
        type: "factoryModifier1",
        title: "Steam powered factories",
        description: "Factories +15$ /s",
        cost: 50000,
        unlockConditions: [
            {
                type: "factory",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["factory"],
                addedProfit: 15
            }
        ]
    };
    playerModifiers.factoryModifier2 = {
        type: "factoryModifier2",
        title: "Electricity powered factories",
        description: "Factories +40$ /s",
        cost: 150000,
        unlockConditions: [
            {
                type: "factory",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["factory"],
                addedProfit: 40
            }
        ]
    };
    playerModifiers.factoryModifier3 = {
        type: "factoryModifier3",
        title: "Baby animal powered factories",
        description: "Factory profits + 50%",
        cost: 350000,
        unlockConditions: [
            {
                type: "factory",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["factory"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.factoryModifier4 = {
        type: "factoryModifier4",
        title: "Lubricated crankshafts",
        description: "Factory profits + 50%",
        cost: 600000,
        unlockConditions: [
            {
                type: "factory",
                value: 7
            }
        ],
        effects: [
            {
                targets: ["factory"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.factoryModifier5 = {
        type: "factoryModifier5",
        title: "OSHA regulations",
        description: "Factory profits + 50%\nFactory build cost +15%",
        cost: 1500000,
        unlockConditions: [
            {
                type: "factory",
                value: 12
            }
        ],
        effects: [
            {
                targets: ["factory"],
                multiplier: 1.5,
                buildCost: {
                    multiplier: 1.15
                }
            }
        ]
    };
    playerModifiers.hotelModifier1 = {
        type: "hotelModifier1",
        title: "Heated swimming pool",
        description: "Hotels +30$ /s",
        cost: 200000,
        unlockConditions: [
            {
                type: "hotel",
                value: 1
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                addedProfit: 30
            }
        ]
    };
    playerModifiers.hotelModifier2 = {
        type: "hotelModifier2",
        title: "Imported cleaning staff",
        description: "Building hotels is 15% cheaper",
        cost: 400000,
        unlockConditions: [
            {
                type: "hotel",
                value: 3
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                buildCost: {
                    multiplier: 0.85
                }
            }
        ]
    };
    playerModifiers.hotelModifier3 = {
        type: "hotelModifier3",
        title: "Swim-up bar",
        description: "Hotel profits + 50%",
        cost: 500000,
        unlockConditions: [
            {
                type: "hotel",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.hotelModifier4 = {
        type: "hotelModifier4",
        title: "Guided tours",
        description: "Hotel profits + 50%",
        cost: 1000000,
        unlockConditions: [
            {
                type: "hotel",
                value: 7
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                multiplier: 1.5
            }
        ]
    };
    playerModifiers.hotelModifier5 = {
        type: "hotelModifier5",
        title: "Tourist pricing",
        description: "Hotel profits + 50%\ŋGlobal profit -5%",
        cost: 1000000,
        unlockConditions: [
            {
                type: "hotel",
                value: 12
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                multiplier: 1.5
            },
            {
                targets: ["global"],
                multiplier: 0.95
            }
        ]
    };

    /**
    * unlockConditions:
    * [
    *   {
    *     type: "buildings", "level", "money"
    *     value: 69
    *   }
    * ]
    * */
    /**
    * modifiersbyUnlock =
    * {
    *   money:
    *   {
    *     69: [playerModifiers.äbäbäbä]
    *   }
    * }
    */
    playerModifiers.modifiersByUnlock = (function () {
        var base = {};

        for (var _mod in playerModifiers) {
            var modifier = playerModifiers[_mod];
            if (modifier.unlockConditions) {
                for (var i = 0; i < modifier.unlockConditions.length; i++) {
                    var condition = modifier.unlockConditions[i];

                    if (condition === "default") {
                        if (!base.default)
                            base.default = [];
                        base.default.push(modifier);
                        continue;
                    }

                    if (!base[condition.type])
                        base[condition.type] = {};

                    if (!base[condition.type][condition.value]) {
                        base[condition.type][condition.value] = [];
                    }

                    base[condition.type][condition.value].push(modifier);
                }
            }
        }
        return base;
    })();

    playerModifiers.allModifiers = (function () {
        var all = [];
        for (var _mod in playerModifiers) {
            if (playerModifiers[_mod].type) {
                all.push(playerModifiers[_mod]);
            }
        }
        return all;
    })();
})(playerModifiers || (playerModifiers = {}));
//# sourceMappingURL=playermodifiers.js.map

/// <reference path="js/playermodifiers.d.ts" />
var levelUpModifiers;
(function (levelUpModifiers) {
    levelUpModifiers.testModifier = {
        type: "testModifier",
        title: "testing",
        description: "test",
        effects: [
            {
                targets: ["global"],
                addedProfit: 50
            },
            {
                targets: ["fastfood"],
                multiplier: 4
            }
        ]
    };

    /////////////
    // LEVEL 5 //
    /////////////
    levelUpModifiers.fundingBoost1 = {
        type: "fundingBoost1",
        title: "Starting capital",
        description: "+250$",
        unlockConditions: [
            {
                type: "level",
                value: 5
            }
        ],
        onAdd: {
            oneTime: true,
            effect: function (player) {
                player.money += 250;
            }
        }
    };

    levelUpModifiers.clicksPerParking1 = {
        type: "clicksPerParking1",
        title: "Clicks per parking",
        description: "+0.2$ / click for every parking lot",
        unlockConditions: [
            {
                type: "level",
                value: 5
            }
        ],
        dynamicEffect: {
            "parkinglot": function (player) {
                player.addSpecialModifier({
                    type: "clicksPerParking1",
                    title: "Clicks per parking",
                    description: "+0.2$ / click for every parking lot",
                    effects: [
                        {
                            targets: ["click"],
                            addedProfit: player.amountBuiltPerType["parkinglot"] * 0.2
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.clicksPerLevel1 = {
        type: "clicksPerLevel1",
        title: "Reverse carpal tunnel syndrome",
        description: "Clicking profit +2% per level",
        unlockConditions: [
            {
                type: "level",
                value: 5
            }
        ],
        dynamicEffect: {
            "level": function (player) {
                player.addSpecialModifier({
                    type: "clicksPerLevel1",
                    title: "Reverse carpal tunnel syndrome",
                    description: "Clicks * 1.02 per level",
                    effects: [
                        {
                            targets: ["click"],
                            multiplier: 1 + (player.level * 0.02)
                        }
                    ]
                });
            }
        }
    };

    /*
    export var increasedLevelUpModifiers1: playerModifiers.IPlayerModifier =
    {
    type: "increasedLevelUpModifiers1",
    title: "Increased knowledge",
    description: "Choose from one extra modifier (if available) on subsequent level ups",
    unlockConditions:
    [
    {
    type: "level",
    value: 5
    }
    ],
    onAdd:
    {
    oneTime: false,
    effect: function(player)
    {
    player.levelUpModifiersPerLevelUp++;
    }
    }
    }*/
    levelUpModifiers.shoppingCostReduction1 = {
        type: "shoppingCostReduction1",
        title: "Franchising",
        description: "Shopping and fast food buildings 10% cheaper to build",
        unlockConditions: [
            {
                type: "level",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["shopping", "fastfood"],
                buildCost: {
                    multiplier: 0.9
                }
            }
        ]
    };

    levelUpModifiers.parkingCostReduction1 = {
        type: "parkingCostReduction1",
        title: "Discount asphalt",
        description: "Parking lots 35% cheaper to build",
        unlockConditions: [
            {
                type: "level",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["parking"],
                buildCost: {
                    multiplier: 0.65
                }
            }
        ]
    };

    //////////////
    // LEVEL 10 //
    //////////////
    levelUpModifiers.fundingBoost2 = {
        type: "fundingBoost2",
        title: "More starting capital",
        description: "+1000$",
        unlockConditions: [
            {
                type: "level",
                value: 10
            }
        ],
        onAdd: {
            oneTime: true,
            effect: function (player) {
                player.money += 1000;
            }
        }
    };

    levelUpModifiers.america1 = {
        type: "america1",
        title: "The American way",
        description: "Fast food profit +10% per parking lot and vice versa",
        unlockConditions: [
            {
                type: "level",
                value: 10
            }
        ],
        dynamicEffect: {
            "parkinglot": function (player) {
                player.addSpecialModifier({
                    type: "america1_a",
                    title: "The American way A",
                    description: "Fast food profit +10% per parking",
                    effects: [
                        {
                            targets: ["fastfood"],
                            multiplier: 1 + player.amountBuiltPerType["parkinglot"] * 0.1
                        }
                    ]
                });
            },
            "fastfood": function (player) {
                player.addSpecialModifier({
                    type: "america1_b",
                    title: "The American way B",
                    description: "Parking lot profit +10% per fast food restaurant",
                    effects: [
                        {
                            targets: ["parking"],
                            multiplier: 1 + player.amountBuiltPerType["fastfood"] * 0.1
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.betterSellPrice1 = {
        type: "betterSellPrice1",
        title: "Real estate flipping",
        description: "Get back an additional 15% of the cost when selling buildings and land",
        unlockConditions: [
            {
                type: "level",
                value: 10
            }
        ],
        onAdd: {
            oneTime: false,
            effect: function (player) {
                player.modifierEffects.sellPrice += 0.15;
            }
        }
    };

    levelUpModifiers.increasedRecruitQuality1 = {
        type: "increasedRecruitQuality1",
        title: "Promising talent",
        description: "Better new recruits",
        unlockConditions: [
            {
                type: "level",
                value: 10
            }
        ],
        onAdd: {
            oneTime: false,
            effect: function (player) {
                player.modifierEffects.recruitQuality += 0.25;
            }
        }
    };

    //////////////
    // LEVEL 25 //
    //////////////
    levelUpModifiers.fundingBoost3 = {
        type: "fundingBoost3",
        title: "External investors",
        description: "+5000$",
        unlockConditions: [
            {
                type: "level",
                value: 25
            }
        ],
        onAdd: {
            oneTime: true,
            effect: function (player) {
                player.money += 5000;
            }
        }
    };

    levelUpModifiers.buildRush1 = {
        type: "buildRush1",
        title: "Construction boom",
        description: "All buildings 33% cheaper for 2 minutes",
        unlockConditions: [
            {
                type: "level",
                value: 25
            }
        ],
        onAdd: {
            oneTime: true,
            effect: function (player) {
                player.addTimedModifier({
                    type: "buildRush1",
                    title: "Construction boom",
                    description: "All buildings 33% cheaper for 2 minutes",
                    lifeTime: 1000 * 120,
                    effects: [
                        {
                            targets: ["global"],
                            buildCost: {
                                multiplier: 0.666
                            }
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.buildCostReduction1 = {
        type: "buildCostReduction1",
        title: "Deunionization",
        description: "All buildings are 5% cheaper to build",
        unlockConditions: [
            {
                type: "level",
                value: 25
            }
        ],
        effects: [
            {
                targets: ["global"],
                buildCost: {
                    multiplier: 0.95
                }
            }
        ]
    };

    levelUpModifiers.buyRush1 = {
        type: "buyRush1",
        title: "Land grab",
        description: "Buying plots 66% cheaper for 2 minutes",
        unlockConditions: [
            {
                type: "level",
                value: 25
            }
        ],
        onAdd: {
            oneTime: true,
            effect: function (player) {
                player.addTimedModifier({
                    type: "buildRush1",
                    title: "Land grab",
                    description: "Buying plots 66% cheaper for 2 minutes",
                    lifeTime: 1000 * 120,
                    effects: [
                        {
                            targets: ["global"],
                            buyCost: {
                                multiplier: 0.33
                            }
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.clickFrenzy1 = {
        type: "clickFrenzy1",
        title: "Click frenzy",
        description: "Clicking profits * 5 for 1 minutes",
        unlockConditions: [
            {
                type: "level",
                value: 25
            }
        ],
        onAdd: {
            oneTime: true,
            effect: function (player) {
                player.addTimedModifier({
                    type: "clickFrenzy1",
                    title: "Click frenzy",
                    description: "Clicking profits * 5 for 1 minutes",
                    lifeTime: 1000 * 60 * 1,
                    effects: [
                        {
                            targets: ["click"],
                            multiplier: 5
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.shoppingProfitPerApartment = {
        type: "shoppingProfitPerApartment",
        title: "Targeted marketing",
        description: "3% higher retail profit per owned apartment",
        unlockConditions: [
            {
                type: "level",
                value: 25
            }
        ],
        dynamicEffect: {
            "apartment": function (player) {
                player.addSpecialModifier({
                    type: "shoppingProfitPerApartment",
                    title: "Targeted marketing",
                    description: "3% higher retail profit per owned apartment",
                    effects: [
                        {
                            targets: ["shopping"],
                            multiplier: 1 + player.amountBuiltPerCategory["apartment"] * 0.03
                        }
                    ]
                });
            }
        }
    };

    //////////////
    // LEVEL 50 //
    //////////////
    levelUpModifiers.branchOffices1 = {
        type: "branchOffices1",
        title: "Branch offices",
        description: "2% higher global profit per office building",
        unlockConditions: [
            {
                type: "level",
                value: 50
            }
        ],
        dynamicEffect: {
            "office": function (player) {
                player.addSpecialModifier({
                    type: "branchOffices1",
                    title: "Branch offices",
                    description: "2% higher global profit per office building",
                    effects: [
                        {
                            targets: ["global"],
                            multiplier: 1 + player.amountBuiltPerCategory["office"] * 0.02
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.increasedRecruitQuality2 = {
        type: "increasedRecruitQuality2",
        title: "Talent scouts",
        description: "Significantly better recruits",
        unlockConditions: [
            {
                type: "level",
                value: 50
            }
        ],
        onAdd: {
            oneTime: false,
            effect: function (player) {
                player.modifierEffects.recruitQuality += 0.75;
            }
        }
    };

    levelUpModifiers.prestigeEffectIncrease1 = {
        type: "prestigeEffectIncrease1",
        title: "Increased prestige effect",
        description: "0.25% additional profit per prestige",
        unlockConditions: [
            {
                type: "level",
                value: 50
            },
            {
                type: "prestige",
                value: 1
            }
        ],
        dynamicEffect: {
            "prestige": function (player) {
                player.addSpecialModifier({
                    type: "prestigeEffectIncrease1",
                    title: "Increased prestige effect",
                    description: "0.25% additional profit per prestige",
                    effects: [
                        {
                            targets: ["global"],
                            multiplier: 1 + player.prestige * 0.0025
                        }
                    ]
                });
            }
        }
    };
    levelUpModifiers.shoppingCostReductionPerFactory = {
        type: "shoppingCostReductionPerFactory",
        title: "Supply chain",
        description: "Shopping buildings 2% cheaper per factory",
        unlockConditions: [
            {
                type: "level",
                value: 50
            }
        ],
        dynamicEffect: {
            "factory": function (player) {
                player.addSpecialModifier({
                    type: "shoppingCostReductionPerFactory",
                    title: "Supply chain",
                    description: "Shopping buildings 2% cheaper per factory",
                    effects: [
                        {
                            targets: ["shopping"],
                            buildCost: {
                                multiplier: 1 - 0.02 * player.amountBuiltPerCategory["factory"]
                            }
                        }
                    ]
                });
            }
        }
    };

    //////////////
    // LEVEL 75 //
    //////////////
    levelUpModifiers.hotelParking1 = {
        type: "hotelParking1",
        title: "Valet service",
        description: "Parking lot profits +50% per hotel",
        unlockConditions: [
            {
                type: "level",
                value: 75
            }
        ],
        dynamicEffect: {
            "hotel": function (player) {
                player.addSpecialModifier({
                    type: "hotelParking1",
                    title: "Valet service",
                    description: "Parking lot profits +50% per hotel",
                    effects: [
                        {
                            targets: ["parking"],
                            multiplier: 1 + player.amountBuiltPerCategory["hotel"] * 0.5
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.hotelFastfood1 = {
        type: "hotelFastfood1",
        title: "Local cuisine promotion",
        description: "Fast food profits +33% per hotel",
        unlockConditions: [
            {
                type: "level",
                value: 75
            }
        ],
        dynamicEffect: {
            "hotel": function (player) {
                player.addSpecialModifier({
                    type: "hotelFastfood1",
                    title: "Local cuisine promotion",
                    description: "Fast food profits +33% per hotel",
                    effects: [
                        {
                            targets: ["fastfood"],
                            multiplier: 1 + player.amountBuiltPerCategory["hotel"] * 0.33
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.factoryPerLevel1 = {
        type: "factoryPerLevel1",
        title: "Experienced foremen",
        description: "Factory profits +2% per level",
        unlockConditions: [
            {
                type: "level",
                value: 75
            }
        ],
        dynamicEffect: {
            "level": function (player) {
                player.addSpecialModifier({
                    type: "factoryPerLevel1",
                    title: "Experienced foremen",
                    description: "Factory profits +2% per level",
                    effects: [
                        {
                            targets: ["factory"],
                            multiplier: 1 + player.level * 0.02
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.prestigeHotel1 = {
        type: "prestigeHotel1",
        title: "Prestigious hotels",
        description: "Hotel profits +2% per prestige",
        unlockConditions: [
            {
                type: "level",
                value: 75
            },
            {
                type: "prestige",
                value: 1
            }
        ],
        dynamicEffect: {
            "prestige": function (player) {
                player.addSpecialModifier({
                    type: "prestigeHotel1",
                    title: "Prestigious hotels",
                    description: "Hotel profits +2% per prestige",
                    effects: [
                        {
                            targets: ["hotel"],
                            multiplier: 1 + player.prestige * 0.02
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.branchOffices2 = {
        type: "branchOffices2",
        title: "Company headquarters",
        description: "3% higher global profit per office building",
        unlockConditions: [
            {
                type: "level",
                value: 75
            }
        ],
        dynamicEffect: {
            "office": function (player) {
                player.addSpecialModifier({
                    type: "branchOffices2",
                    title: "Company headquarters",
                    description: "3% higher global profit per office building",
                    effects: [
                        {
                            targets: ["global"],
                            multiplier: 1 + player.amountBuiltPerCategory["office"] * 0.03
                        }
                    ]
                });
            }
        }
    };

    levelUpModifiers.modifiersByUnlock = (function () {
        var base = {};

        for (var _mod in levelUpModifiers) {
            var modifier = levelUpModifiers[_mod];
            if (modifier.unlockConditions) {
                for (var i = 0; i < modifier.unlockConditions.length; i++) {
                    var condition = modifier.unlockConditions[i];

                    if (condition === "default") {
                        if (!base.default)
                            base.default = [];
                        base.default.push(modifier);
                        continue;
                    }

                    if (!base[condition.type])
                        base[condition.type] = {};

                    if (!base[condition.type][condition.value]) {
                        base[condition.type][condition.value] = [];
                    }

                    base[condition.type][condition.value].push(modifier);
                }
            }
        }
        return base;
    })();

    levelUpModifiers.allModifiers = (function () {
        var all = [];
        for (var _mod in levelUpModifiers) {
            if (levelUpModifiers[_mod].type) {
                all.push(levelUpModifiers[_mod]);
            }
        }
        return all;
    })();
})(levelUpModifiers || (levelUpModifiers = {}));
//# sourceMappingURL=levelupmodifiers.js.map

/// <reference path="js/playermodifiers.d.ts" />
var employeeModifiers;
(function (employeeModifiers) {
    employeeModifiers.fastFoodTrait1 = {
        type: "fastFoodTrait1",
        title: "Burger flipping mastery",
        description: "Fast food profits +15%",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 5
            }
        ],
        effects: [
            {
                targets: ["fastfood"],
                multiplier: 1.15
            }
        ]
    };

    employeeModifiers.clicksPerShoppingTrait1 = {
        type: "clicksPerShoppingTrait1",
        title: "Product location manager",
        description: "Clicking profit +5% per retail building",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 10
            }
        ],
        dynamicEffect: {
            "shopping": function (player) {
                player.addSpecialModifier({
                    type: "clicksPerShoppingTrait1",
                    title: "Product location manager",
                    description: "Clicking profit +5% per retail building",
                    effects: [
                        {
                            targets: ["click"],
                            multiplier: 1 + player.amountBuiltPerCategory["shopping"] * 0.05
                        }
                    ]
                });
            }
        }
    };

    employeeModifiers.apartmentTrait1 = {
        type: "apartmentTrait1",
        title: "Landlord",
        description: "Apartment profits +20%",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 20
            }
        ],
        effects: [
            {
                targets: ["apartment"],
                multiplier: 1.20
            }
        ]
    };

    employeeModifiers.apartmentFactoriesTrait1 = {
        type: "apartmentFactoriesTrait1",
        title: "Union leader",
        description: "Factory profits +5% per apartment and vice versa.\nFactory & apartment cost +25%",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 50
            }
        ],
        effects: [
            {
                targets: ["factory", "apartment"],
                buildCost: {
                    multiplier: 1.25
                }
            }
        ],
        dynamicEffect: {
            "apartment": function (player) {
                player.addSpecialModifier({
                    type: "apartmentFactoriesTrait1_a",
                    title: "Union leader A",
                    description: "Factory profits +5% per apartment.",
                    effects: [
                        {
                            targets: ["factory"],
                            multiplier: 1 + 0.05 * player.amountBuiltPerCategory["apartment"]
                        }
                    ]
                });
            },
            "factory": function (player) {
                player.addSpecialModifier({
                    type: "apartmentFactoriesTrait1_b",
                    title: "Union leader B",
                    description: "Apartment profits +5% per factory.",
                    effects: [
                        {
                            targets: ["apartment"],
                            multiplier: 1 + 0.05 * player.amountBuiltPerCategory["factory"]
                        }
                    ]
                });
            }
        }
    };

    employeeModifiers.factoryBuildingsTrait1 = {
        type: "factoryBuildingsTrait1",
        title: "Industry connections",
        description: "All buildings 1% cheaper per factory",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 50
            }
        ],
        dynamicEffect: {
            "factory": function (player) {
                player.addSpecialModifier({
                    type: "factoryBuildingsTrait1",
                    title: "Industry connections",
                    description: "All buildings 1% cheaper per factory",
                    effects: [
                        {
                            targets: ["global"],
                            buildCost: {
                                multiplier: 1 - 0.01 * player.amountBuiltPerCategory["factory"]
                            }
                        }
                    ]
                });
            }
        }
    };

    employeeModifiers.hotelShoppingTrait1 = {
        type: "hotelShoppingTrait1",
        title: "Shopping tourism promoter",
        description: "Retail profits +5% per hotel",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 57
            }
        ],
        dynamicEffect: {
            "hotel": function (player) {
                player.addSpecialModifier({
                    type: "hotelShoppingTrait1",
                    title: "Shopping tourism promoter",
                    description: "Retail profits +5% per hotel",
                    effects: [
                        {
                            targets: ["global"],
                            multiplier: 1 + 0.05 * player.amountBuiltPerCategory["hotel"]
                        }
                    ]
                });
            }
        }
    };

    employeeModifiers.hotelTrait1 = {
        type: "hotelTrait1",
        title: "Concierge",
        description: "Hotel profits +10%",
        unlockConditions: [
            {
                type: "skillTotal",
                value: 57
            }
        ],
        effects: [
            {
                targets: ["hotel"],
                multiplier: 1.10
            }
        ]
    };

    /**
    * unlockConditions:
    * [
    *   {
    *     type: "buildings", "level", "money"
    *     value: 69
    *   }
    * ]
    * */
    /**
    * modifiersbyUnlock =
    * {
    *   money:
    *   {
    *     69: [playerModifiers.äbäbäbä]
    *   }
    * }
    */
    employeeModifiers.modifiersByUnlock = (function () {
        var base = {};

        for (var _mod in employeeModifiers) {
            var modifier = employeeModifiers[_mod];
            if (modifier.unlockConditions) {
                for (var i = 0; i < modifier.unlockConditions.length; i++) {
                    var condition = modifier.unlockConditions[i];

                    if (condition === "default") {
                        if (!base.default)
                            base.default = [];
                        base.default.push(modifier);
                        continue;
                    }

                    if (!base[condition.type])
                        base[condition.type] = {};

                    if (!base[condition.type][condition.value]) {
                        base[condition.type][condition.value] = [];
                    }

                    base[condition.type][condition.value].push(modifier);
                }
            }
        }
        return base;
    })();

    employeeModifiers.allModifiers = (function () {
        var all = [];
        for (var _mod in employeeModifiers) {
            if (employeeModifiers[_mod].type) {
                all.push(employeeModifiers[_mod]);
            }
        }
        return all;
    })();
})(employeeModifiers || (employeeModifiers = {}));
//# sourceMappingURL=employeemodifiers.js.map

/// <reference path="../src/js/arraylogic.d.ts" />
var cellModifiers;
(function (cellModifiers) {
    function niceEnviroment(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "niceEnviroment",
            title: "Nice enviroment",
            range: range,
            strength: strength,
            targets: ["apartment", "office", "hotel"],
            effect: {
                multiplier: 0.3
            },
            landValue: {
                radius: 4,
                multiplier: 0.1,
                scalingFN: function (strength) {
                    return 1 + Math.log(strength / 2);
                }
            }
        });
    }
    cellModifiers.niceEnviroment = niceEnviroment;

    function crowded(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "crowded",
            title: "Crowded",
            range: range,
            strength: strength,
            targets: ["apartment"],
            scaling: function (strength) {
                if (strength >= 5) {
                    return 1 + Math.log(strength);
                } else {
                    return 0;
                }
            },
            effect: {
                multiplier: -0.1
            }
        });
    }
    cellModifiers.crowded = crowded;

    function population(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "population",
            title: "Nearby customers",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping"],
            effect: {
                addedProfit: 0.3,
                multiplier: 0.2
            },
            scaling: function (strength) {
                return strength;
            },
            landValue: {
                radius: 4,
                multiplier: 0.01
            }
        });
    }
    cellModifiers.population = population;

    function fastfoodCompetition(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "fastfoodCompetition",
            title: "Competing restaurants",
            range: range,
            strength: strength,
            targets: ["fastfood"],
            effect: {
                addedProfit: -0.25,
                multiplier: -0.3
            }
        });
    }
    cellModifiers.fastfoodCompetition = fastfoodCompetition;

    function shoppingCompetition(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "shoppingCompetition",
            title: "Competing stores",
            range: range,
            strength: strength,
            targets: ["shopping"],
            effect: {
                addedProfit: -0.2,
                multiplier: -0.2
            }
        });
    }
    cellModifiers.shoppingCompetition = shoppingCompetition;

    function nearbyShopping(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyShopping",
            title: "Nearby stores",
            range: range,
            strength: strength,
            targets: ["fastfood", "parking"],
            effect: {
                multiplier: 0.2
            }
        });
    }
    cellModifiers.nearbyShopping = nearbyShopping;

    function nearbyStation(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyStation",
            title: "Nearby station",
            range: range,
            strength: strength,
            targets: [
                "fastfood", "shopping", "office",
                "apartment", "parking", "hotel", "stadium"],
            effect: {
                addedProfit: 0.25,
                multiplier: 0.25
            },
            landValue: {
                radius: 20,
                multiplier: 0.05,
                falloffFN: function (distance, invertedDistance, invertedDistanceRatio) {
                    return invertedDistance * invertedDistanceRatio;
                }
            }
        });
    }
    cellModifiers.nearbyStation = nearbyStation;

    function parkingCompetition(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "parkingCompetition",
            title: "Competing parking lots",
            range: range,
            strength: strength,
            targets: ["parking"],
            effect: {
                addedProfit: -0.2,
                multiplier: -0.2
            }
        });
    }
    cellModifiers.parkingCompetition = parkingCompetition;

    function nearbyParking(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyParking",
            title: "Nearby parking",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping"],
            effect: {
                addedProfit: 0.25,
                multiplier: 0.1
            }
        });
    }
    cellModifiers.nearbyParking = nearbyParking;

    function nearbyFactory(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyFactory",
            title: "Nearby Factory",
            range: range,
            strength: strength,
            targets: ["fastfood", "shopping", "apartment", "office", "hotel"],
            effect: {
                multiplier: -0.15
            },
            landValue: {
                radius: 5,
                multiplier: -0.07,
                falloffFN: function (distance, invertedDistance, invertedDistanceRatio) {
                    return invertedDistance * invertedDistanceRatio / 2;
                }
            }
        });
    }
    cellModifiers.nearbyFactory = nearbyFactory;

    function nearbyRoad(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyRoad",
            title: "Nearby Road",
            range: range,
            strength: strength,
            targets: ["parking"],
            effect: {
                multiplier: 0.15
            },
            scaling: function (strength) {
                return 1;
            }
        });
    }
    cellModifiers.nearbyRoad = nearbyRoad;

    function nearbyHotel(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyHotel",
            title: "Nearby Hotel",
            range: range,
            strength: strength,
            targets: ["office"],
            effect: {
                multiplier: 0.33
            },
            landValue: {
                radius: 6,
                multiplier: 0.05,
                falloffFN: function (distance, invertedDistance, invertedDistanceRatio) {
                    return invertedDistance * invertedDistanceRatio / 2;
                }
            }
        });
    }
    cellModifiers.nearbyHotel = nearbyHotel;

    function hotelCompetition(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "hotelCompetition",
            title: "Competing hotels",
            range: range,
            strength: strength,
            targets: ["hotel"],
            effect: {
                multiplier: -0.2
            }
        });
    }
    cellModifiers.hotelCompetition = hotelCompetition;
    function nearbyStadium(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "nearbyStadium",
            title: "Nearby stadium",
            range: range,
            strength: strength,
            targets: ["parking"],
            effect: {
                multiplier: 0.2
            }
        });
    }
    cellModifiers.nearbyStadium = nearbyStadium;
    function stadiumCompetition(range, strength) {
        if (typeof strength === "undefined") { strength = 1; }
        return ({
            type: "stadiumCompetition",
            title: "Competing stadiums",
            range: range,
            strength: strength,
            targets: ["stadium"],
            effect: {
                multiplier: -0.25
            }
        });
    }
    cellModifiers.stadiumCompetition = stadiumCompetition;
})(cellModifiers || (cellModifiers = {}));
//# sourceMappingURL=cellmodifiers.js.map

/// <reference path="js/cellmodifiers.d.ts" />
var cg = {
    "terrain": {
        "grass": {
            "type": "grass",
            "anchor": [0.5, 1],
            "frame": "grass.png",
            "interactive": true,
            "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
            "flags": ["ground", "grass"]
        },
        "water": {
            "type": "water",
            "anchor": [0.5, 1],
            "frame": "water.png",
            "interactive": true,
            "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
            "flags": ["water"],
            "effects": [
                {
                    "type": "niceEnviroment",
                    "range": 2,
                    "strength": 1
                }
            ]
        },
        "sand": {
            "type": "sand",
            "anchor": [0.5, 1],
            "frame": "sand.png",
            "interactive": true,
            "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
            "flags": ["ground", "sand"]
        },
        "snow": {
            "type": "snow",
            "anchor": [0.5, 1],
            "frame": "snow.png",
            "interactive": true,
            "hitArea": [[0, -32], [32, -16], [0, 0], [-32, -16]],
            "flags": ["ground", "snow"]
        }
    },
    "content": {
        "underConstruction": {
            "type": "underConstruction",
            "baseType": "underConstruction",
            "anchor": [0.5, 1],
            "frame": ["underconstruction.png"]
        },
        "plants": {
            "grass": {
                "tree1": {
                    "type": "tree1",
                    "baseType": "plant",
                    "anchor": [0.5, 1],
                    "frame": ["tree1.png"],
                    "canBuildOn": ["grass"],
                    "effects": [
                        {
                            "type": "niceEnviroment",
                            "range": 2,
                            "strength": 1
                        }
                    ]
                },
                "tree2": {
                    "type": "tree2",
                    "baseType": "plant",
                    "anchor": [0.5, 1],
                    "frame": ["tree2.png"],
                    "canBuildOn": ["grass"],
                    "effects": [
                        {
                            "type": "niceEnviroment",
                            "range": 2,
                            "strength": 1
                        }
                    ]
                },
                "tree3": {
                    "type": "tree3",
                    "baseType": "plant",
                    "anchor": [0.5, 1],
                    "frame": ["tree3.png"],
                    "canBuildOn": ["grass"],
                    "effects": [
                        {
                            "type": "niceEnviroment",
                            "range": 2,
                            "strength": 1
                        }
                    ]
                },
                "tree4": {
                    "type": "tree4",
                    "baseType": "plant",
                    "anchor": [0.5, 1],
                    "frame": ["tree4.png"],
                    "canBuildOn": ["grass"],
                    "effects": [
                        {
                            "type": "niceEnviroment",
                            "range": 2,
                            "strength": 1
                        }
                    ]
                },
                "tree5": {
                    "type": "tree5",
                    "baseType": "plant",
                    "anchor": [0.5, 1],
                    "frame": ["tree5.png"],
                    "canBuildOn": ["grass"],
                    "effects": [
                        {
                            "type": "niceEnviroment",
                            "range": 2,
                            "strength": 1
                        }
                    ]
                }
            },
            "sand": {
                "cactus": {
                    "type": "cactus",
                    "baseType": "plant",
                    "anchor": [0.5, 1.5],
                    "frame": ["cactus.png"],
                    "canBuildOn": ["sand"]
                }
            },
            "water": {
                "tentacle": {
                    "type": "tentacle",
                    "baseType": "plant",
                    "anchor": [0.5, 1.5],
                    "frame": ["tentacle.png"],
                    "canBuildOn": ["water"]
                }
            },
            "snow": {
                "snowman": {
                    "type": "snowman",
                    "baseType": "plant",
                    "anchor": [0.5, 1.25],
                    "frame": ["snowman.png"],
                    "canBuildOn": ["snow"]
                }
            }
        },
        "roads": {
            "road_h": {
                "type": "road_h",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_h.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_v": {
                "type": "road_v",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_v.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_ne": {
                "type": "road_ne",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_ne.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_nw": {
                "type": "road_nw",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_nw.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_sw": {
                "type": "road_sw",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_sw.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_es": {
                "type": "road_es",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_se.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_nesw": {
                "type": "road_nesw",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_news.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_new": {
                "type": "road_new",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_new.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_nsw": {
                "type": "road_nsw",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_nsw.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_esw": {
                "type": "road_esw",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_sew.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            },
            "road_nes": {
                "type": "road_nes",
                "baseType": "road",
                "categoryType": "road",
                "title": "Road",
                "anchor": [0.5, 1.0],
                "frame": ["road_nse.png"],
                "effects": [
                    {
                        "type": "nearbyRoad",
                        "range": 1,
                        "strength": 1
                    }
                ]
            }
        },
        "tubes": {
            "tube_h": {
                "type": "tube_h",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_h.png"]
            },
            "tube_v": {
                "type": "tube_v",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_v.png"]
            },
            "tube_ne": {
                "type": "tube_ne",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_ne.png"]
            },
            "tube_nw": {
                "type": "tube_nw",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_nw.png"]
            },
            "tube_sw": {
                "type": "tube_sw",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_sw.png"]
            },
            "tube_es": {
                "type": "tube_es",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_se.png"]
            },
            "tube_nesw": {
                "type": "tube_nesw",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_news.png"]
            },
            "tube_new": {
                "type": "tube_new",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_new.png"]
            },
            "tube_nsw": {
                "type": "tube_nsw",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_nsw.png"]
            },
            "tube_esw": {
                "type": "tube_esw",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_sew.png"]
            },
            "tube_nes": {
                "type": "tube_nes",
                "baseType": "tube",
                "anchor": [0.5, 1.0],
                "frame": ["tube_nse.png"]
            }
        },
        "buildings": {
            "house1": {
                "type": "house1",
                "baseType": "building",
                "categoryType": "apartment",
                "title": "Apartment 1",
                "baseProfit": 16,
                "daysForProfitTick": 1,
                "cost": 3000,
                "buildTime": 14,
                "anchor": [0.5, 1],
                "frame": ["house1.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "population": 5,
                "effects": [
                    {
                        "type": "crowded",
                        "range": 2,
                        "strength": 1
                    },
                    {
                        "type": "population",
                        "range": 3,
                        "strength": 1
                    }
                ]
            },
            "house2": {
                "type": "house2",
                "baseType": "building",
                "categoryType": "apartment",
                "title": "Apartment 2",
                "baseProfit": 200,
                "daysForProfitTick": 1,
                "cost": 100000,
                "buildTime": 21,
                "anchor": [0.5, 1],
                "frame": ["house2.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "population": 10,
                "effects": [
                    {
                        "type": "crowded",
                        "range": 2,
                        "strength": 2
                    },
                    {
                        "type": "population",
                        "range": 3,
                        "strength": 2
                    }
                ]
            },
            "house3": {
                "type": "house3",
                "baseType": "building",
                "categoryType": "apartment",
                "title": "Apartment 3",
                "baseProfit": 1.2,
                "daysForProfitTick": 1,
                "cost": 25,
                "buildTime": 14,
                "anchor": [0.5, 1],
                "frame": ["house3.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "population": 5,
                "effects": [
                    {
                        "type": "crowded",
                        "range": 2,
                        "strength": 1
                    },
                    {
                        "type": "population",
                        "range": 3,
                        "strength": 1
                    }
                ]
            },
            "house4": {
                "type": "house4",
                "baseType": "building",
                "categoryType": "apartment",
                "title": "Apartment 4",
                "baseProfit": 2.5,
                "daysForProfitTick": 1,
                "cost": 50,
                "buildTime": 21,
                "anchor": [0.5, 1],
                "frame": ["house4.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "population": 10,
                "effects": [
                    {
                        "type": "crowded",
                        "range": 2,
                        "strength": 2
                    },
                    {
                        "type": "population",
                        "range": 3,
                        "strength": 2
                    }
                ]
            },
            "house5": {
                "type": "house5",
                "baseType": "building",
                "categoryType": "apartment",
                "title": "Apartment 5",
                "baseProfit": 2.5,
                "daysForProfitTick": 1,
                "cost": 50,
                "buildTime": 21,
                "anchor": [0.5, 1],
                "frame": ["house5.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "population": 10,
                "effects": [
                    {
                        "type": "crowded",
                        "range": 2,
                        "strength": 2
                    },
                    {
                        "type": "population",
                        "range": 3,
                        "strength": 2
                    }
                ]
            },
            "house6": {
                "type": "house6",
                "baseType": "building",
                "categoryType": "apartment",
                "title": "Apartment 6",
                "baseProfit": 2.5,
                "daysForProfitTick": 1,
                "cost": 50,
                "buildTime": 21,
                "anchor": [0.5, 1],
                "frame": ["house6.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "population": 10,
                "effects": [
                    {
                        "type": "crowded",
                        "range": 2,
                        "strength": 2
                    },
                    {
                        "type": "population",
                        "range": 3,
                        "strength": 2
                    }
                ]
            },
            "house7": {
                "type": "house7",
                "baseType": "building",
                "categoryType": "apartment",
                "title": "Apartment 7",
                "baseProfit": 1.2,
                "daysForProfitTick": 1,
                "cost": 25,
                "buildTime": 14,
                "anchor": [0.425, 1],
                "frame": ["house7.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "population": 5,
                "effects": [
                    {
                        "type": "crowded",
                        "range": 2,
                        "strength": 1
                    },
                    {
                        "type": "population",
                        "range": 3,
                        "strength": 1
                    }
                ]
            },
            "fastfood": {
                "type": "fastfood",
                "baseType": "building",
                "categoryType": "fastfood",
                "title": "Fast food restaurant",
                "baseProfit": 3,
                "daysForProfitTick": 1,
                "cost": 150,
                "buildTime": 14,
                "anchor": [0.5, 1],
                "frame": ["fastfood.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "fastfoodCompetition",
                        "range": 3,
                        "strength": 1
                    }
                ]
            },
            "conveniencestore": {
                "type": "conveniencestore",
                "baseType": "building",
                "categoryType": "shopping",
                "title": "Convenience store",
                "baseProfit": 8,
                "daysForProfitTick": 1,
                "cost": 1000,
                "buildTime": 10,
                "anchor": [0.5, 1],
                "frame": ["conveniencestore.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "shoppingCompetition",
                        "range": 2,
                        "strength": 1
                    },
                    {
                        "type": "nearbyShopping",
                        "range": 2,
                        "strength": 1
                    }
                ]
            },
            "smalloffice": {
                "type": "smalloffice",
                "baseType": "building",
                "categoryType": "office",
                "title": "Small office",
                "baseProfit": 40,
                "daysForProfitTick": 1,
                "cost": 10000,
                "buildTime": 21,
                "anchor": [0.5, 1],
                "frame": ["smalloffice.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "population",
                        "range": 3,
                        "strength": 1
                    }
                ]
            },
            "smallstation": {
                "type": "smallstation",
                "baseType": "building",
                "categoryType": "station",
                "title": "Small station",
                "cost": 0,
                "buildTime": 1,
                "anchor": [0.5, 1],
                "frame": ["smallstation.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "underground": "tube_nesw",
                "effects": [
                    {
                        "type": "nearbyStation",
                        "range": 3,
                        "strength": 1
                    }
                ]
            },
            "parkinglot": {
                "type": "parkinglot",
                "baseType": "building",
                "categoryType": "parking",
                "title": "Parking lot",
                "baseProfit": 1,
                "daysForProfitTick": 1,
                "cost": 25,
                "buildTime": 7,
                "anchor": [0.5, 1],
                "frame": ["parkinglot.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "nearbyParking",
                        "range": 2,
                        "strength": 1
                    }
                ]
            },
            "stretchystore": {
                "type": "stretchystore",
                "baseType": "building",
                "categoryType": "shopping",
                "title": "Convenience store 2",
                "size": [2, 1],
                "baseProfit": 60,
                "daysForProfitTick": 1,
                "cost": 25000,
                "buildTime": 14,
                "anchor": [0.5, 1],
                "frame": ["stretchystore_f0.png", "stretchystore_f1.png"],
                "icon": "stretchystore.png",
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "shoppingCompetition",
                        "range": 3,
                        "strength": 1
                    },
                    {
                        "type": "nearbyShopping",
                        "range": 3,
                        "strength": 1
                    }
                ]
            },
            "factory": {
                "type": "factory",
                "baseType": "building",
                "categoryType": "factory",
                "title": "Factory",
                "baseProfit": 100,
                "daysForProfitTick": 1,
                "cost": 50000,
                "buildTime": 21,
                "anchor": [0.5, 1],
                "frame": ["factory.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "nearbyFactory",
                        "range": 4,
                        "strength": 1
                    }
                ]
            },
            "hotel": {
                "type": "hotel",
                "baseType": "building",
                "categoryType": "hotel",
                "title": "Hotel",
                "baseProfit": 100,
                "daysForProfitTick": 1,
                "cost": 250000,
                "buildTime": 21,
                "anchor": [0.5, 1],
                "frame": ["hotel.png"],
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "nearbyHotel",
                        "range": 4,
                        "strength": 1
                    },
                    {
                        "type": "hotelCompetition",
                        "range": 3,
                        "strength": 1
                    }
                ]
            },
            "departmentStore": {
                "type": "departmentStore",
                "baseType": "building",
                "categoryType": "shopping",
                "title": "Department store",
                "size": [1, 2],
                "baseProfit": 60,
                "daysForProfitTick": 1,
                "cost": 25000,
                "buildTime": 21,
                "anchor": [0.5, 1],
                "frame": ["departmentstore_f0.png", "departmentstore_f1.png"],
                "icon": "departmentstore.png",
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "shoppingCompetition",
                        "range": 3,
                        "strength": 2
                    },
                    {
                        "type": "nearbyShopping",
                        "range": 4,
                        "strength": 2
                    }
                ]
            },
            "soccerStadium": {
                "type": "soccerStadium",
                "baseType": "building",
                "categoryType": "stadium",
                "title": "Soccer stadium",
                "size": [2, 2],
                "baseProfit": 60,
                "daysForProfitTick": 1,
                "cost": 25000,
                "buildTime": 30,
                "anchor": [0.5, 1],
                "frame": [
                    "soccerstadium_f0.png", "soccerstadium_f2.png",
                    "soccerstadium_f1.png", "soccerstadium_f3.png"],
                "icon": "soccerstadium.png",
                "canNotBuildOn": ["water", "building", "road"],
                "effects": [
                    {
                        "type": "stadiumCompetition",
                        "range": 3,
                        "strength": 1
                    },
                    {
                        "type": "nearbyStadium",
                        "range": 2,
                        "strength": 1
                    }
                ]
            }
        }
    }
};

var buildingTypeIndexes = {};

function findType(typeName, target) {
    if (typeof target === "undefined") { target = cg; }
    if (buildingTypeIndexes[typeName]) {
        return buildingTypeIndexes[typeName];
    }

    for (var prop in target) {
        if (target[prop].type === typeName) {
            buildingTypeIndexes[typeName] = target[prop];
            return target[prop];
        } else if (typeof target[prop] === "object" && !target[prop].type) {
            var matchFound = findType(typeName, target[prop]);
            if (matchFound)
                return matchFound;
        }
    }
}
;

(function translateModifierEffects(target) {
    for (var prop in target) {
        if (prop === "effects") {
            var newEffects = [];
            var effectTargets = {
                negative: {},
                positive: {}
            };

            for (var i = 0; i < target.effects.length; i++) {
                var e = target.effects[i];
                if (!cellModifiers[e.type])
                    console.error("Invalid effect defined on ", target);

                var translated = cellModifiers[e.type].call(null, e.range, e.strength);

                translated.center = target.size || [1, 1];

                translated.scaling = translated.scaling || function (strength) {
                    return 1 + Math.log(strength);
                };

                newEffects.push(translated);

                for (var effect in translated.effect) {
                    var typeOfEffect = "positive";
                    if (translated.effect[effect] < 0) {
                        typeOfEffect = "negative";
                    }
                    for (var j = 0; j < translated.targets.length; j++) {
                        effectTargets[typeOfEffect][translated.targets[j]] = true;
                    }
                }
            }
            target.translatedEffects = newEffects;
            target.effectTargets = {
                positive: Object.keys(effectTargets.positive),
                negative: Object.keys(effectTargets.negative)
            };
        } else if (typeof target[prop] === "object") {
            translateModifierEffects(target[prop]);
        }
    }
}(cg));

var effectSourcesIndex = {};

(function getEffectSources(target) {
    for (var prop in target) {
        if (prop === "effectTargets") {
            for (var polarity in target[prop]) {
                var flags = target[prop][polarity];

                for (var i = 0; i < flags.length; i++) {
                    var flag = flags[i];
                    if (!effectSourcesIndex[flag])
                        effectSourcesIndex[flag] = {
                            positive: [],
                            negative: []
                        };
                    var type = target.categoryType || "enviroment";
                    if (effectSourcesIndex[flag][polarity].indexOf(type) < 0) {
                        effectSourcesIndex[flag][polarity].push(type);
                    }
                }
            }
        } else if (typeof target[prop] === "object") {
            getEffectSources(target[prop]);
        }
    }
}(cg));

(function addIcons(target) {
    for (var prop in target) {
        if (prop === "frame") {
            if (!target.icon && target.frame.length === 1) {
                target.icon = target.frame[0];
            }
        } else if (typeof target[prop] === "object") {
            addIcons(target[prop]);
        }
    }
}(cg));

var playerBuildableBuildings = [];
[
    "parkinglot",
    "conveniencestore",
    "fastfood",
    "house1",
    "smalloffice",
    "stretchystore",
    "house2",
    "factory",
    "hotel",
    "departmentStore"
].forEach(function (type) {
    playerBuildableBuildings.push(findType(type));
});

// easier balancing
// cost, base profit
var basevalues = [
    [25, 0.3],
    [300, 0.7],
    [700, 1.5],
    [1500, 3],
    [5000, 10],
    [20000, 13],
    [50000, 20],
    [100000, 50],
    [250000, 75],
    [750000, 90],
    [1250000, 120]
];

for (var i = 0; i < playerBuildableBuildings.length; i++) {
    var type = playerBuildableBuildings[i];

    type.cost = basevalues[i][0];
    type.baseProfit = basevalues[i][1];
}
//# sourceMappingURL=cg.js.map

/*
"":
{
"male":
[
],
"female":
[
],
"surnames":
[
]
},
*/
var names = {
    "american": {
        "male": [
            "James",
            "Christopher",
            "Ronald",
            "John",
            "Daniel",
            "Anthony",
            "Robert",
            "Paul",
            "Kevin",
            "Michael",
            "Mark",
            "Jason",
            "William",
            "Donald",
            "Robin",
            "Jeff",
            "David",
            "George",
            "Richard",
            "Kenneth",
            "Charles",
            "Steven",
            "Joseph",
            "Edward",
            "Thomas",
            "Brian",
            "Davis"
        ],
        "female": [
            "Mary",
            "Lisa",
            "Michelle",
            "Patricia",
            "Nancy",
            "Laura",
            "Linda",
            "Karen",
            "Sarah",
            "Barbara",
            "Betty",
            "Kimberly",
            "Elizabeth",
            "Helen",
            "Deborah",
            "Jennifer",
            "Sandra",
            "Maria",
            "Donna",
            "Susan",
            "Carol",
            "Margaret",
            "Ruth"
        ],
        "surnames": [
            "Smith",
            "Anderson",
            "Clark",
            "Wright",
            "Mitchell",
            "Johnson",
            "Thomas",
            "Rodriguez",
            "Lopez",
            "Perez",
            "Williams",
            "Jackson",
            "Lewis",
            "Hill",
            "Roberts",
            "Jones",
            "White",
            "Lee",
            "Scott",
            "Turner",
            "Brown",
            "Harris",
            "Walker",
            "Green",
            "Phillips",
            "Davis",
            "Martin",
            "Hall",
            "Adams",
            "Campbell",
            "Miller",
            "Farmer",
            "Thompson",
            "Allen",
            "Baker",
            "Parker",
            "Wilson",
            "Garcia",
            "Young",
            "Gonzalez",
            "Evans",
            "Moore",
            "Martinez",
            "Hernandez",
            "Nelson",
            "Edwards",
            "Taylor",
            "Robinson",
            "King",
            "Carter",
            "Collins"
        ]
    },
    "british": {
        "male": [
            "Abdul",
            "Mark",
            "David",
            "Andrew",
            "Richard",
            "Christopher",
            "James",
            "Simon",
            "Michael",
            "Matthew",
            "Stephen",
            "Lee",
            "John",
            "Robert",
            "Darren",
            "Daniel",
            "Steven",
            "Jason",
            "Nicholas",
            "Jonathan",
            "Ian",
            "Neil",
            "Peter",
            "Stuart",
            "Anthony",
            "Martin",
            "Kevin",
            "Craig",
            "Philip",
            "Gary",
            "Scott",
            "Wayne",
            "Timothy",
            "Benjamin",
            "Adam",
            "Alan",
            "Dean",
            "Adrian",
            "Carl",
            "Thomas",
            "William",
            "Graham",
            "Alexander",
            "Colin",
            "Jamie",
            "Gareth",
            "Justin",
            "Barry",
            "Christian",
            "Karl",
            "Brian",
            "Edward",
            "Keith",
            "Marc",
            "Nigel",
            "Sean",
            "Shaun",
            "Nathan",
            "Joseph",
            "Russell",
            "Mohammed",
            "Jeremy",
            "Phillip",
            "Damian",
            "Shane",
            "Duncan",
            "Patrick",
            "Julian",
            "Dominic",
            "Charles",
            "Marcus",
            "Gavin",
            "Tony",
            "Antony",
            "Robin",
            "Trevor",
            "Glen",
            "Iain",
            "Ryan",
            "Martyn",
            "Gregory",
            "Samuel",
            "George",
            "Oliver",
            "Raymond",
            "Abdul",
            "Mathew",
            "Stewart",
            "Malcolm",
            "Garry",
            "Leon",
            "Brett",
            "Terry",
            "Kenneth",
            "Luke",
            "Roger",
            "Glenn",
            "Leigh",
            "Terence",
            "Derek"
        ],
        "female": [
            "Sarah",
            "Claire",
            "Nicola",
            "Emma",
            "Lisa",
            "Joanne",
            "Michelle",
            "Helen",
            "Samantha",
            "Karen",
            "Amanda",
            "Rachel",
            "Louise",
            "Julie",
            "Clare",
            "Rebecca",
            "Sharon",
            "Victoria",
            "Caroline",
            "Susan",
            "Alison",
            "Catherine",
            "Elizabeth",
            "Deborah",
            "Donna",
            "Tracey",
            "Tracy",
            "Angela",
            "Jane",
            "Zoe",
            "Kerry",
            "Melanie",
            "Sally",
            "Jennifer",
            "Dawn",
            "Andrea",
            "Suzanne",
            "Lucy",
            "Joanna",
            "Anna",
            "Charlotte",
            "Paula",
            "Katherine",
            "Maria",
            "Marie",
            "Fiona",
            "Kelly",
            "Natalie",
            "Kathryn",
            "Jacqueline",
            "Wendy",
            "Sara",
            "Hayley",
            "Laura",
            "Natasha",
            "Ruth",
            "Lorraine",
            "Tina",
            "Rachael",
            "Anne",
            "Stephanie",
            "Kirsty",
            "Christine",
            "Julia",
            "Gillian",
            "Cheryl",
            "Hannah",
            "Vanessa",
            "Ann",
            "Jayne",
            "Diane",
            "Heather",
            "Sandra",
            "Teresa",
            "Kate",
            "Linda",
            "Mary",
            "Elaine",
            "Georgina",
            "Emily",
            "Katie",
            "Alexandra",
            "Nichola",
            "Carol",
            "Sophie",
            "Heidi",
            "Kim",
            "Tanya",
            "Patricia",
            "Beverley",
            "Leanne",
            "Denise",
            "Tara",
            "Clair",
            "Sonia",
            "Debbie",
            "Lesley",
            "Anita",
            "Lindsey",
            "Debra"
        ],
        "surnames": [
            "Smith",
            "Jones",
            "Taylor",
            "Williams",
            "Brown",
            "Davies",
            "Evans",
            "Wilson",
            "Thomas",
            "Roberts",
            "Johnson",
            "Lewis",
            "Walker",
            "Robinson",
            "Wood",
            "Thompson",
            "White",
            "Watson",
            "Jackson",
            "Wright",
            "Green",
            "Harris",
            "Cooper",
            "King",
            "Lee",
            "Martin",
            "Clarke",
            "James",
            "Morgan",
            "Hughes",
            "Edwards",
            "Hill",
            "Moore",
            "Clark",
            "Harrison",
            "Scott",
            "Young",
            "Morris",
            "Hall",
            "Ward",
            "Turner",
            "Carter",
            "Phillips",
            "Mitchell",
            "Patel",
            "Adams",
            "Campbell",
            "Anderson",
            "Allen",
            "Cook",
            "Bailey",
            "Parker",
            "Miller",
            "Davis",
            "Murphy",
            "Price",
            "Bell",
            "Baker",
            "Griffiths",
            "Kelly",
            "Simpson",
            "Marshall",
            "Collins",
            "Bennett",
            "Cox",
            "Richardson",
            "Fox",
            "Gray",
            "Rose",
            "Chapman",
            "Hunt",
            "Robertson",
            "Shaw",
            "Reynolds",
            "Lloyd",
            "Ellis",
            "Richards",
            "Russell",
            "Wilkinson",
            "Khan",
            "Graham",
            "Stewart",
            "Reid",
            "Murray",
            "Powell",
            "Palmer",
            "Holmes",
            "Rogers",
            "Stevens",
            "Walsh",
            "Hunter",
            "Thomson",
            "Matthews",
            "Ross",
            "Owen",
            "Mason",
            "Knight",
            "Kennedy",
            "Butler",
            "Saunders"
        ]
    },
    "german": {
        "male": [
            "Christian",
            "Michael",
            "Stefan",
            "Andreas",
            "Thomas",
            "Marcus",
            "Matthias",
            "Sven",
            "Jan",
            "Alexander",
            "Oliver",
            "Martin",
            "Torsten",
            "Frank",
            "Marco",
            "Marc",
            "Daniel",
            "Jens",
            "Karsten",
            "Andre",
            "Dirk",
            "Lars",
            "Sebastian",
            "Tobias",
            "Sascha",
            "Jörg",
            "Kai",
            "Björn",
            "Florian",
            "Christoph",
            "Peter",
            "Dennis",
            "Maik",
            "Ralf",
            "Robert",
            "René",
            "Patrick",
            "Holger",
            "Nils",
            "Heiko",
            "Mario",
            "Philip",
            "Olaf",
            "Steffen",
            "Timo",
            "Tim",
            "Ingo",
            "Jürgen",
            "Marcel",
            "Volker",
            "Benjamin",
            "Bernd",
            "Arne",
            "Axel",
            "Klaus",
            "David",
            "Jörn",
            "Felix",
            "Boris",
            "Mirko",
            "Henning",
            "Uwe",
            "Torben",
            "Wolfgang",
            "Nico",
            "Mohammed",
            "Ali",
            "Manuel",
            "Malte",
            "Johannes",
            "Jochen",
            "Simon",
            "Joachim",
            "Roland"
        ],
        "female": [
            "Nicole",
            "Stefanie",
            "Sandra",
            "Katrin",
            "Claudia",
            "Tanja",
            "Anja",
            "Melanie",
            "Andrea",
            "Daniela",
            "Julia",
            "Susanne",
            "Christina",
            "Katja",
            "Kerstin",
            "Ivonne",
            "Silke",
            "Sabine",
            "Sonja",
            "Alexandra",
            "Nadine",
            "Nina",
            "Simone",
            "Maike",
            "Christine",
            "Petra",
            "Britta",
            "Anna",
            "Martina",
            "Michaela",
            "Manuela",
            "Bianka",
            "Silvia",
            "Katharina",
            "Bettina",
            "Ulrike",
            "Heike",
            "Anke",
            "Birgit",
            "Christiane",
            "Jessica",
            "Monika",
            "Maren",
            "Anne",
            "Antje",
            "Eva",
            "Jana",
            "Diana",
            "Cornelia",
            "Wiebke",
            "Tina",
            "Kirsten",
            "Miriam",
            "Carolin",
            "Maria",
            "Astrid",
            "Jennifer",
            "Tatjana",
            "Annika",
            "Angela",
            "Corinna",
            "Barbara",
            "Elena",
            "Annette",
            "Jasmin",
            "Olga",
            "Birte",
            "Verena",
            "Ines",
            "Natalie",
            "Inga",
            "Iris",
            "Ina",
            "Irina"
        ],
        "surnames": [
            "Müller",
            "Schmidt",
            "Schneider",
            "Fischer",
            "Meyer",
            "Weber",
            "Schulz",
            "Wagner",
            "Becker",
            "Hoffmann",
            "Schäfer",
            "Koch",
            "Bauer",
            "Schröder",
            "Klein",
            "Richter",
            "Wolf",
            "Neumann",
            "Schwarz",
            "Schmitz",
            "Krüger",
            "Braun",
            "Zimmermann",
            "Schmitt",
            "Lange",
            "Hartmann",
            "Hofmann",
            "Krause",
            "Werner",
            "Meier",
            "Schmid",
            "Schulze",
            "Lehmann",
            "Köhler",
            "Maier",
            "Herrmann",
            "König",
            "Mayer",
            "Walter",
            "Peters",
            "Möller",
            "Huber",
            "Kaiser",
            "Fuchs",
            "Scholz",
            "Weiss",
            "Lang",
            "Jung",
            "Hahn",
            "Keller"
        ]
    },
    "chinese": {
        "props": {
            "surname_first": true
        },
        "male": [
            "An",
            "Bo",
            "Cheng",
            "De",
            "Dong",
            "Feng",
            "Gang",
            "Guo",
            "Hui",
            "Jian",
            "Jie",
            "Kang",
            "Liang",
            "Ning",
            "Peng",
            "Tao",
            "Wei",
            "Yong",
            "Wen"
        ],
        "female": [
            "Ai",
            "Bi",
            "Cai",
            "Dan",
            "Fang",
            "Hong",
            "Hui",
            "Juan",
            "Lan",
            "Li",
            "Li",
            "Lian",
            "Na",
            "Ni",
            "Qian",
            "Qiong",
            "Shan",
            "Shu",
            "Ting",
            "Xia",
            "Xian",
            "Yan",
            "Yun",
            "Zhen"
        ],
        "surnames": [
            "Wang",
            "Lei",
            "Chang",
            "Liu",
            "Chen",
            "Yang",
            "Wong",
            "Chao",
            "Wu",
            "Chou",
            "Hsü",
            "Sun",
            "Ma",
            "Chu",
            "Hu"
        ]
    },
    "japanese": {
        "props": {
            "surname_first": true
        },
        "male": [
            "Akira",
            "Atsushi",
            "Daiki",
            "Daisuke",
            "Eiichi",
            "Fumio",
            "Hideo",
            "Hiroshi",
            "Hisao",
            "Hisashi",
            "Hitoshi",
            "Hosei",
            "Ichiro",
            "Jiro",
            "Jun",
            "Junichi",
            "Katsumi",
            "Kazuo",
            "Kazuya",
            "Keiichi",
            "Ken",
            "Kenichi",
            "Kiyoshi",
            "Koichi",
            "Makoto",
            "Manabu",
            "Masahiro",
            "Masatoshi",
            "Michio",
            "Naoki",
            "Nobuo",
            "Norio",
            "Osamu",
            "Seiji",
            "Shigeru",
            "Shinichi",
            "Shinji",
            "Shouji",
            "Shouta",
            "Shozo",
            "Susumu",
            "Tadao",
            "Takashi",
            "Takeo",
            "Takeshi",
            "Takuya",
            "Teruo",
            "Tetsuo",
            "Yasuo",
            "Yasushi",
            "Yoichi",
            "Yoshihiro",
            "Yoshio",
            "Yutaka"
        ],
        "female": [
            "Akiko",
            "Hiroko",
            "Kaori",
            "Kaoru",
            "Kazuko",
            "Keiko",
            "Kumiko",
            "Kyouko",
            "Mai",
            "Mami",
            "Masako",
            "Mayumi",
            "Megumi",
            "Michiko",
            "Noriko",
            "Reiko",
            "Sachiko",
            "Tomoko",
            "Toshiko",
            "Yoshiko",
            "Youko",
            "Yumiko",
            "Yuuko"
        ],
        "surnames": [
            "Satou",
            "Suzuki",
            "Takahashi",
            "Tanaka",
            "Watanabe",
            "Itou",
            "Nakamura",
            "Kobayashi",
            "Yamamoto",
            "Katou",
            "Yoshida",
            "Yamada",
            "Sasaki",
            "Yamaguchi",
            "Hamada",
            "Matsumoto",
            "Inoue",
            "Kimura",
            "Shimizu",
            "Hayashi",
            "Saitou",
            "Yamasaki",
            "Nakajima",
            "Mori",
            "Abe",
            "Ikeda",
            "Hashimoto",
            "Ishikawa",
            "Yamashita",
            "Ogawa",
            "Ishii",
            "Hasegawa",
            "Gotou",
            "Okada",
            "Kondō",
            "Maeda",
            "Fujita",
            "Endo",
            "Aoki",
            "Sakamoto",
            "Murakami",
            "Ota",
            "Kaneko",
            "Fujii",
            "Fukuda",
            "Nishimura",
            "Miura",
            "Takeuchi",
            "Nakagawa",
            "Okamoto",
            "Matsuda",
            "Harada",
            "Nakano"
        ]
    },
    "korean": {
        "props": {
            "surname_first": true
        },
        "male": [
            "Dong-hyun",
            "Hyun-woo",
            "Ji-hoon",
            "Jin-ho",
            "Joon-ho",
            "Jun-young",
            "Jung-hoon",
            "Min-ho",
            "Sung-hoon",
            "Sung-min"
        ],
        "female": [
            "Ji-hye",
            "Hye-jin",
            "Ji-young",
            "Ji-eun",
            "Soo-jin",
            "Eun-jung",
            "Jiyeon",
            "Eun-young",
            "Sun-young",
            "Hyun-jung"
        ],
        "surnames": [
            "Kim",
            "Lee",
            "Park",
            "Choi",
            "Jeong",
            "Kang",
            "Cho",
            "Yoon",
            "Jang",
            "Lim",
            "Han",
            "O",
            "Shin",
            "Seo",
            "Kwon",
            "Hwang",
            "Ahn",
            "Song",
            "Yoo",
            "Hong",
            "Jeon",
            "Ko",
            "Mun",
            "Son",
            "Yang"
        ]
    }
};
//# sourceMappingURL=names.js.map

/// <reference path="../lib/pixi.d.ts" />
var eventManager = new PIXI.EventTarget();
//# sourceMappingURL=eventlistener.js.map

/// <reference path="../lib/pixi.d.ts" />
function getFrom2dArray(target, arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if ((arr[i] !== undefined) && (arr[i][0] >= 0 && arr[i][0] < target.length) && (arr[i][1] >= 0 && arr[i][1] < target.length)) {
            result.push(target[arr[i][0]][arr[i][1]]);
        }
    }
    ;
    return result;
}

function getRandomKey(target) {
    var _targetKeys = Object.keys(target);
    var _rnd = Math.floor(Math.random() * (_targetKeys.length));
    return _targetKeys[_rnd];
}

function getRandomProperty(target) {
    var _rndProp = target[getRandomKey(target)];
    return _rndProp;
}

function getRandomArrayItem(target) {
    var _rnd = Math.floor(Math.random() * (target.length));
    return target[_rnd];
}

function setDeepProperties(baseObj, target, props) {
    if (target.length <= 0) {
        for (var prop in props) {
            baseObj[prop] = props[prop];
        }
        return baseObj;
    } else {
        var targetProp = target.shift();

        if (!baseObj.hasOwnProperty(targetProp)) {
            baseObj[targetProp] = {};
        }
        var newBaseObj = baseObj[targetProp];

        return setDeepProperties(newBaseObj, target, props);
    }
}

function deepDestroy(object) {
    if (object.texture) {
        if (object.texture.baseTexture.source._pixiId) {
            PIXI.Texture.removeTextureFromCache(object.texture.baseTexture.source._pixiId);
        }
        object.texture.destroy(true);
    }

    if (!object.children || object.children.length <= 0) {
        return;
    } else {
        for (var i = 0; i < object.children.length; i++) {
            deepDestroy(object.children[i]);
        }
    }
}

function rectToIso(width, height) {
    var top = [width / 2, 0];
    var right = [width, height / 2];
    var bot = [width / 2, height];
    var left = [0, height / 2];

    return [top, right, bot, left];
}

function getOrthoCoord(click, tileSize, worldSize) {
    var tileX = click[0] / tileSize[0] + click[1] / tileSize[1] - worldSize[0] / 2;
    var tileY = click[1] / tileSize[1] - click[0] / tileSize[0] + worldSize[1] / 2;

    return [Math.floor(tileX), Math.floor(tileY)];
}

function getIsoCoord(x, y, width, height, offset) {
    var _w2 = width / 2;
    var _h2 = height / 2;
    var _isoX = (x - y) * _w2;
    var _isoY = (x + y) * _h2;
    if (offset) {
        _isoX += offset[0];
        _isoY += offset[1];
    }
    return [_isoX, _isoY];
}

function getTileScreenPosition(x, y, tileSize, worldSize, container) {
    var wt = container.worldTransform;
    var zoom = wt.a;
    var offset = [
        wt.tx + worldSize[0] / 2 * zoom,
        wt.ty + tileSize[1] / 2 * zoom];
    tileSize[0] *= zoom;
    tileSize[1] *= zoom;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

function rollDice(dice, sides) {
    var total = 0;
    for (var i = 0; i < dice; i++) {
        total += randInt(1, sides);
    }
    return total;
}

function spritesheetToImages(sheetData, baseUrl) {
    var sheetImg = new Image();
    sheetImg.src = baseUrl + sheetData.meta.image;

    var frames = {};

    (function splitSpritesheetFN() {
        for (var sprite in sheetData.frames) {
            var frame = sheetData.frames[sprite].frame;
            var newFrame = frames[sprite] = new Image(frame.w, frame.h);

            var canvas = document.createElement("canvas");
            canvas.width = frame.w;
            canvas.height = frame.h;
            var context = canvas.getContext("2d");

            context.drawImage(sheetImg, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);

            newFrame.src = canvas.toDataURL();
            frames[sprite] = newFrame;
        }
    }());

    return frames;
}

function addClickAndTouchEventListener(target, callback) {
    function execClickCallback(e) {
        e.preventDefault();
        callback.call();
    }
    target.addEventListener("click", execClickCallback);
    target.addEventListener("touchend", execClickCallback);
}

/**
* http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
*
* Converts an HSL color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes h, s, and l are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   Number  h       The hue
* @param   Number  s       The saturation
* @param   Number  l       The lightness
* @return  Array           The RGB representation
*/
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r, g, b];
}

function hslToHex(h, s, l) {
    return PIXI.rgb2hex(hslToRgb(h, s, l));
}

function getNeighbors(targetArray, gridPos, diagonal) {
    if (typeof diagonal === "undefined") { diagonal = false; }
    var neighbors = {
        n: undefined,
        e: undefined,
        s: undefined,
        w: undefined,
        ne: undefined,
        nw: undefined,
        se: undefined,
        sw: undefined
    };
    var hasNeighbor = {
        n: undefined,
        e: undefined,
        s: undefined,
        w: undefined
    };
    var cells = targetArray;
    var sizeX = targetArray.length;
    var sizeY = targetArray[0].length;
    var x = gridPos[0];
    var y = gridPos[1];

    hasNeighbor.s = (y + 1 < sizeY) ? true : false;
    hasNeighbor.e = (x + 1 < sizeX) ? true : false;
    hasNeighbor.n = (y - 1 >= 0) ? true : false;
    hasNeighbor.w = (x - 1 >= 0) ? true : false;

    neighbors.s = hasNeighbor["s"] ? cells[x][y + 1] : undefined;
    neighbors.e = hasNeighbor["e"] ? cells[x + 1][y] : undefined;
    neighbors.n = hasNeighbor["n"] ? cells[x][y - 1] : undefined;
    neighbors.w = hasNeighbor["w"] ? cells[x - 1][y] : undefined;

    if (diagonal === true) {
        neighbors.ne = (hasNeighbor["n"] && hasNeighbor["e"]) ? cells[x + 1][y - 1] : undefined;
        neighbors.nw = (hasNeighbor["n"] && hasNeighbor["w"]) ? cells[x - 1][y - 1] : undefined;
        neighbors.se = (hasNeighbor["s"] && hasNeighbor["e"]) ? cells[x + 1][y + 1] : undefined;
        neighbors.sw = (hasNeighbor["s"] && hasNeighbor["w"]) ? cells[x - 1][y + 1] : undefined;
    }

    return neighbors;
}

// TODO really stupid and inefficient
function getDistanceFromCell(cells, center, maxDistance, diagonal) {
    if (typeof diagonal === "undefined") { diagonal = false; }
    maxDistance++;

    var toAnalyze = [];
    var indexedDistances = {};
    for (var i = 0; i < center.length; i++) {
        indexedDistances[center[i].gridPos] = {
            item: center[i],
            distance: 1,
            invertedDistance: maxDistance,
            invertedDistanceRatio: 1
        };
        toAnalyze.push(center[i]);
    }

    while (toAnalyze.length > 0) {
        var current = toAnalyze.shift();
        var neighbors;
        if (current.getNeighbors !== undefined) {
            neighbors = current.getNeighbors(diagonal);
        } else {
            neighbors = getNeighbors(cells, current.gridPos, diagonal);
        }

        for (var direction in neighbors) {
            var neigh = neighbors[direction];
            if (neigh !== undefined && indexedDistances[neigh.gridPos] === undefined) {
                var weight = 1;
                if (diagonal && ["ne", "nw", "se", "sw"].indexOf(direction) !== -1) {
                    weight = 1.375;
                }

                var dist = indexedDistances[current.gridPos].distance + weight;
                if (dist > maxDistance) {
                    break;
                }

                indexedDistances[neigh.gridPos] = {
                    item: neigh,
                    distance: dist,
                    invertedDistance: maxDistance + 1 - dist,
                    invertedDistanceRatio: (maxDistance + 1 - dist) / maxDistance
                };
                toAnalyze.push(neigh);
            }
        }
    }
    return indexedDistances;
}

function getArea(props) {
    var targetArray = props.targetArray;

    var centerSize = props.centerSize || [1, 1];

    var start = props.start;
    var end = [start[0] + centerSize[0] - 1, start[1] + centerSize[1] - 1];

    var size = props.size;
    var anchor = props.anchor || "center";
    var excludeStart = props.excludeStart || false;

    var newStart = start.slice(0);
    var newEnd = end.slice(0);

    var adjust = [[0, 0], [0, 0]];

    if (anchor === "center") {
        adjust = [[-1, -1], [1, 1]];
    }
    ;
    if (anchor === "ne") {
        adjust[1] = [-1, 1];
    }
    ;
    if (anchor === "se") {
        adjust[1] = [-1, -1];
    }
    ;
    if (anchor === "sw") {
        adjust[1] = [1, -1];
    }
    ;
    if (anchor === "nw") {
        adjust[1] = [1, 1];
    }
    ;

    for (var i = 0; i < size; i++) {
        newStart[0] += adjust[0][0];
        newStart[1] += adjust[0][1];
        newEnd[0] += adjust[1][0];
        newEnd[1] += adjust[1][1];
    }
    var rect = rectSelect(newStart, newEnd);

    if (excludeStart) {
        rect = rect.filter(function (pos) {
            if (!(pos[0] >= start[0] && pos[0] <= end[0] && pos[1] >= start[1] && pos[1] <= end[1])) {
                return pos;
            }
        });
    }

    return getFrom2dArray(targetArray, rect);
}

function singleSelect(a, b) {
    return [b];
}

function rectSelect(a, b) {
    var cells = [];
    var xLen = Math.abs(a[0] - b[0]);
    var yLen = Math.abs(a[1] - b[1]);
    var xDir = (b[0] < a[0]) ? -1 : 1;
    var yDir = (b[1] < a[1]) ? -1 : 1;
    var x, y;
    for (var i = 0; i <= xLen; i++) {
        x = a[0] + i * xDir;
        for (var j = 0; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([x, y]);
        }
    }
    return cells;
}

function manhattanSelect(a, b) {
    var xLen = Math.abs(a[0] - b[0]);
    var yLen = Math.abs(a[1] - b[1]);
    var xDir = (b[0] < a[0]) ? -1 : 1;
    var yDir = (b[1] < a[1]) ? -1 : 1;
    var y, x;
    var cells = [];
    if (xLen >= yLen) {
        for (var i = 0; i <= xLen; i++) {
            x = a[0] + i * xDir;
            cells.push([x, a[1]]);
        }
        for (var j = 1; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([b[0], y]);
        }
    } else {
        for (var j = 0; j <= yLen; j++) {
            y = a[1] + j * yDir;
            cells.push([a[0], y]);
        }
        for (var i = 1; i <= xLen; i++) {
            x = a[0] + i * xDir;
            cells.push([x, b[1]]);
        }
    }
    return cells;
}
function arrayToPolygon(points) {
    var _points = [];
    for (var i = 0; i < points.length; i++) {
        _points.push(new PIXI.Point(points[i][0], points[i][1]));
    }
    return new PIXI.Polygon(_points);
}

function arrayToPoint(point) {
    return new PIXI.Point(point[0], point[1]);
}

function getReverseDir(dir) {
    switch (dir) {
        case "n": {
            return "s";
        }
        case "s": {
            return "n";
        }
        case "e": {
            return "w";
        }
        case "w": {
            return "e";
        }
        case "ne": {
            return "sw";
        }
        case "nw": {
            return "se";
        }
        case "se": {
            return "nw";
        }
        case "sw": {
            return "ne";
        }
    }
}

// https://github.com/Icehawk78/FrozenCookies/blob/master/fc_main.js#L132
// license?: https://github.com/Icehawk78/FrozenCookies/issues/45
function formatEveryThirdPower(notations, precision) {
    return function (value) {
        var base = 0, notationValue = '';
        if (value >= 1000000 && isFinite(value)) {
            value /= 1000;
            while (Math.round(value) >= 1000) {
                value /= 1000;
                base++;
            }
            if (base > notations.length) {
                return 'Infinity';
            } else {
                notationValue = notations[base];
            }
        }
        return ((Math.round(value * 1000) / 1000).toFixed(precision)) + notationValue;
    };
}

function rawFormatter(value) {
    return Math.round((value * 1000) / 1000);
}

var numberFormatters = [
    rawFormatter,
    formatEveryThirdPower([
        '',
        ' million',
        ' billion',
        ' trillion',
        ' quadrillion',
        ' quintillion',
        ' sextillion',
        ' septillion',
        ' octillion',
        ' nonillion',
        ' decillion'
    ], 2),
    formatEveryThirdPower([
        '',
        ' M',
        ' B',
        ' T',
        ' Qa',
        ' Qi',
        ' Sx',
        ' Sp',
        ' Oc',
        ' No',
        ' De'
    ], 2),
    formatEveryThirdPower([
        '',
        ' M',
        ' B',
        ' T',
        ' Qa',
        ' Qi',
        ' Sx',
        ' Sp',
        ' Oc',
        ' No',
        ' De'
    ], 3)
];

function beautify(value, formatterIndex) {
    if (typeof formatterIndex === "undefined") { formatterIndex = 0; }
    var negative = (value < 0);
    value = Math.abs(value);
    var formatter = numberFormatters[formatterIndex];
    var output = formatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return negative ? '-' + output : output;
}

function toggleDebugmode() {
    var react = document.getElementById("react-side-menu");
    var edit = document.getElementById("side-menu");
    var speed = document.getElementById("speed");

    [react, edit, speed].forEach(function (menu) {
        menu.classList.toggle("debug-hidden");
    });
}

function capitalize(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function cloneObject(toClone) {
    var result = {};
    for (var prop in toClone) {
        result[prop] = toClone[prop];
    }
    return result;
}
//# sourceMappingURL=utility.js.map

/// <reference path="js/eventlistener.d.ts" />
var Options;
(function (Options) {
    Options.drawClickPopups = true;
    eventManager.addEventListener("toggleDrawClickPopups", function () {
        Options.drawClickPopups = !Options.drawClickPopups;
        eventManager.dispatchEvent({ type: "saveOptions", content: null });
    });

    Options.autosaveLimit = 3;
    eventManager.addEventListener("setAutosaveLimit", function (e) {
        Options.autosaveLimit = e.content;
        eventManager.dispatchEvent({ type: "saveOptions", content: null });
    });
})(Options || (Options = {}));
//# sourceMappingURL=options.js.map

var Strawb;
(function (Strawb) {
    /**
    * @class Timer
    * @classdesc Timing module
    * @memberof Strawb
    *
    * @param    autostart      {boolean}
    *
    * @property startTime      First start
    * @property totalTime      Time since clock first started
    * @property runningTime    Time clock has been running since start
    * @property deltaTime      Time since last deltaTime call or start in ms
    * @property _runStartTime  Time clock last started running
    * @property _previousTime  Same as delta
    *
    */
    var Timer = (function () {
        function Timer(autoStart) {
            this.autoStart = autoStart;
            this.runningTime = 0;
            this.running = false;
            // sets the getTime mehtod to use highest resolution timing available
            this.getTime = Date.now;
            var performance = window.performance;
            if (!performance) {
                if (performance.now) {
                    this.getTime = function getTimeFn() {
                        return performance.now();
                    };
                }
            }

            // autostart
            if (autoStart !== false) {
                this.start();
            }
        }
        /////////////
        // Methods //
        /////////////
        /**
        * @method Strawb.Timer#start
        */
        Timer.prototype.start = function () {
            if (this.running) {
                return;
            }
            var now = this.getTime();
            if (!this.startTime) {
                this.startTime = now;
            }
            this._runStartTime = now;
            this._previousTime = now;
            this.running = true;
        };

        /**
        * @method Strawb.Timer#stop
        */
        Timer.prototype.stop = function () {
            this.getRunningTime();
            this.running = false;
        };

        /**
        * @method Strawb.Timer#getTotalTime
        */
        Timer.prototype.getTotalTime = function () {
            this.totalTime = this.getTime() - this.startTime;
            return this.totalTime;
        };

        /**
        * @method Strawb.Timer#getRunningTime
        */
        Timer.prototype.getRunningTime = function () {
            if (!this.running) {
                return this.runningTime;
            }
            var now = this.getTime();
            this.runningTime += now - this._runStartTime;
            this._runStartTime = now;
            return this.runningTime;
        };

        /**
        * @method Strawb.Timer#getDelta
        */
        Timer.prototype.getDelta = function () {
            var now = this.getTime();
            this.deltaTime = (now - this._previousTime) * 0.001;
            this._previousTime = now;
            return this.deltaTime;
        };
        return Timer;
    })();
    Strawb.Timer = Timer;
})(Strawb || (Strawb = {}));
//# sourceMappingURL=timer.js.map

/// <reference path="../lib/pixi.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SortedDisplayObjectContainer = (function (_super) {
    __extends(SortedDisplayObjectContainer, _super);
    // arr[1] = index 1
    // when adding new displayobject increment following indexes
    function SortedDisplayObjectContainer(layers) {
        this._sortingIndexes = new Array(layers);
        _super.call(this);
        this.init();
    }
    SortedDisplayObjectContainer.prototype.init = function () {
        for (var i = 0; i < this._sortingIndexes.length; i++) {
            this._sortingIndexes[i] = 0;
        }
        ;
    };
    SortedDisplayObjectContainer.prototype.incrementIndexes = function (start) {
        for (var i = start + 1; i < this._sortingIndexes.length; i++) {
            this._sortingIndexes[i]++;
        }
    };
    SortedDisplayObjectContainer.prototype.decrementIndexes = function (start) {
        for (var i = start + 1; i < this._sortingIndexes.length; i++) {
            this._sortingIndexes[i]--;
        }
    };

    SortedDisplayObjectContainer.prototype._addChildAt = function (element, index) {
        _super.prototype.addChildAt.call(this, element, this._sortingIndexes[index]);
        this.incrementIndexes(index);
    };
    SortedDisplayObjectContainer.prototype._removeChildAt = function (element, index) {
        _super.prototype.removeChild.call(this, element);
        this.decrementIndexes(index);
    };
    return SortedDisplayObjectContainer;
})(PIXI.DisplayObjectContainer);
//# sourceMappingURL=sorteddisplaycontainer.js.map

/// <reference path="../data/js/cg.d.ts" />
/// <reference path="js/utility.d.ts" />
var mapGeneration;
(function (mapGeneration) {
    var typeIndexes = {};
    function getIndexedType(typeName) {
        if (!typeIndexes[typeName]) {
            typeIndexes[typeName] = findType(typeName);
        }

        return typeIndexes[typeName];
    }

    function makeBlankCells(props) {
        props.height = props.height || props.width;

        var cells = [];

        for (var i = 0; i < props.width; i++) {
            cells[i] = [];
            for (var j = 0; j < props.height; j++) {
                cells[i][j] = "grass";
            }
        }

        return cells;
    }
    mapGeneration.makeBlankCells = makeBlankCells;

    function convertCells(cells, board, autoInit) {
        // TODO circular refernce
        var _ = window;
        var Cell = _.Cell;

        for (var i = 0; i < cells.length; i++) {
            for (var j = 0; j < cells[i].length; j++) {
                cells[i][j] = new Cell([i, j], getIndexedType(cells[i][j]), board, autoInit);
            }
        }
        if (autoInit !== true) {
            for (var i = 0; i < cells.length; i++) {
                for (var j = 0; j < cells[i].length; j++) {
                    cells[i][j].init();
                }
            }
        }
    }
    mapGeneration.convertCells = convertCells;

    function readSavedMap(props) {
        var cells = props.board.cells;

        for (var i = 0; i < props.board.width; i++) {
            for (var j = 0; j < props.board.height; j++) {
                var cell = cells[i][j];
                var savedCell = props.savedCells[i][j];

                cell.replace(getIndexedType(savedCell.type));

                if (savedCell.player) {
                    savedCell.player.addCell(cell);
                }
                if (savedCell.content) {
                    cell.changeContent(getIndexedType(savedCell.content.type), true, savedCell.content.player, false);
                }
                if (savedCell.undergroundContent) {
                    cell.changeUndergroundContent(cg["content"]["tubes"]["tube_nesw"]);
                }
            }
        }
    }
    mapGeneration.readSavedMap = readSavedMap;

    function generateCellNoise(props) {
        props.mapHeight = props.mapHeight || props.width;

        var coasts = (function getcoastDirectionsFN(props) {
            if (props.coasts) {
                return props.coasts;
            } else {
                var amountOfCoasts = props.amount;
                var directionOfCoasts = {
                    n: { hasCoast: false },
                    e: { hasCoast: false },
                    s: { hasCoast: false },
                    w: { hasCoast: false }
                };

                if (amountOfCoasts === undefined) {
                    var amountOfCoasts = 0;
                    var amountWeights = props.amountWeights || [1, 0.5, 0.5, 0];

                    for (var i = 0; i < amountWeights.length; i++) {
                        if (1 - Math.random() < amountWeights[i]) {
                            amountOfCoasts++;
                        } else
                            break;
                    }
                }
                if (amountOfCoasts === 0) {
                    for (var dir in directionOfCoasts) {
                        directionOfCoasts[dir].hasCoast = false;
                    }
                } else if (amountOfCoasts === 4) {
                    for (var dir in directionOfCoasts) {
                        directionOfCoasts[dir].hasCoast = true;
                    }
                } else {
                    var primaryCoast = getRandomKey(directionOfCoasts);
                    directionOfCoasts[primaryCoast].hasCoast = true;

                    var dirKeys = Object.keys(directionOfCoasts);

                    var primaryIndex = dirKeys.indexOf(primaryCoast);

                    var nextIndexOffset = Math.round(Math.random()) * 2 - 1;

                    for (var i = 1; i < amountOfCoasts; i++) {
                        var nextIndex = (primaryIndex + nextIndexOffset) % dirKeys.length;
                        if (nextIndex < 0)
                            nextIndex += dirKeys.length;

                        var nextKey = dirKeys[nextIndex];
                        directionOfCoasts[nextKey].hasCoast = true;
                        nextIndexOffset *= -1;
                    }
                }
                ;

                return directionOfCoasts;
            }
        })(props);

        for (var _dir in coasts) {
            var dir = coasts[_dir];
            if (dir.hasCoast) {
                var isHorizontal = (_dir === "n" || _dir === "s");
                var x = props.width;
                var y = props.mapHeight;

                dir.depth = dir.depth || props.depth || Math.floor(y / 4);
                dir.variation = dir.variation || props.variation || 0.05;
                dir.baseVariation = dir.baseVariation || props.baseVariation || [0, 1];
                dir.yFalloff = dir.yFalloff || props.yFalloff || dir.depth / 50;
                dir.yFalloffType = dir.yFalloffType || props.yFalloffType || "logarithmic";
                dir.xCutoff = dir.xCutoff || props.xCutoff || 0.3;
                dir.xFalloff = dir.xFalloff || props.xFalloff || props.width / 150;
                dir.xFalloffType = dir.xFalloffType || props.xFalloffType || "logarithmic";
                dir.landThreshhold = dir.landThreshhold || props.landThreshhold || 0.20;
                dir.xFalloffPerY = dir.xFalloffPerY || props.xFalloffPerY || 0;
            }
            var finalCoast = dir.finalCoast = [];

            for (var i = 0; i < dir.depth; i++) {
                finalCoast[i] = [];

                var yFalloff;

                switch (dir.yFalloffType) {
                    case "linear": {
                        yFalloff = 1 - dir.yFalloff * i;
                        break;
                    }
                    case "logarithmic": {
                        //yFalloff = 1 - dir.yFalloff * Math.log(1.5*i);
                        yFalloff = 1 - Math.log(1 + dir.yFalloff * i);

                        if (yFalloff < 0)
                            yFalloff = 0;
                        break;
                    }
                }
                var distanceOfCutoffStart = props.width / 2 - props.width / 2 * dir.xCutoff;
                for (var j = 0; j < x; j++) {
                    var xFalloff = 1;
                    var distanceFromCenter = Math.abs(props.width / 2 - (j + 0.5));

                    var relativeX = 1 - distanceFromCenter / (props.width / 2);

                    if (relativeX < dir.xCutoff) {
                        var xDepth = (distanceFromCenter - distanceOfCutoffStart);
                        switch (dir.xFalloffType) {
                            case "linear": {
                                xFalloff = 1 - dir.xFalloff * xDepth;
                                break;
                            }
                            case "logarithmic": {
                                xFalloff = 1 - dir.xFalloff * Math.log(xDepth);
                                if (xFalloff < 0)
                                    xFalloff = 0;
                                break;
                            }
                        }
                        xFalloff *= 1 - dir.xFalloffPerY * Math.log(i);
                    }
                    var n = (randRange(dir.baseVariation[0], dir.baseVariation[1]) + randRange(-dir.variation, dir.variation)) * yFalloff * xFalloff;
                    n = n > dir.landThreshhold ? 1 : 0;
                    finalCoast[i][j] = n;
                }
            }
            ;
        }
        ;
        return coasts;
    }
    mapGeneration.generateCellNoise = generateCellNoise;

    function applyCoastsToCells(props) {
        var coasts = props.coasts;

        for (var _dir in coasts) {
            var coast = coasts[_dir];
            var offset = coast.offset ? [Math.round(coast.offset[0]), Math.round(coast.offset[1])] : [0, 0];
            if (coast.hasCoast) {
                switch (_dir) {
                    case "n":
                    case "w": {
                        coast.finalCoast = coast.finalCoast.reverse();
                        break;
                    }
                }
                ;

                switch (_dir) {
                    case "e":
                    case "w": {
                        var rotated = [];
                        for (var i = 0; i < coast.finalCoast.length; i++) {
                            for (var j = 0; j < coast.finalCoast[i].length; j++) {
                                if (!rotated[j])
                                    rotated[j] = [];
                                rotated[j][i] = coast.finalCoast[i][j];
                            }
                        }
                        coast.finalCoast = rotated;
                        break;
                    }
                }
                ;
                switch (_dir) {
                    case "w": {
                        coast.startPoint = [offset[1], offset[0]];
                        break;
                    }
                    case "n": {
                        coast.startPoint = offset;
                        break;
                    }
                    case "e": {
                        coast.startPoint = [props.cells.length - coast.depth + offset[1], offset[0]];
                        break;
                    }
                    case "s": {
                        coast.startPoint = [offset[0], props.cells.length - coast.depth + offset[1]];
                        break;
                    }
                }

                for (var i = 0; i < coast.finalCoast.length; i++) {
                    for (var j = 0; j < coast.finalCoast[i].length; j++) {
                        var x = coast.startPoint[0] + j;
                        var y = coast.startPoint[1] + i;

                        var type = (coast.finalCoast[i][j] === 1) ? props.primaryType : props.subType;

                        props.cells[x][y] = type;
                    }
                }
            }
        }
    }
    mapGeneration.applyCoastsToCells = applyCoastsToCells;
    function makeRivers(coasts, genChance, riverProps, offset, maxCoastsToDrawRiver) {
        if (typeof maxCoastsToDrawRiver === "undefined") { maxCoastsToDrawRiver = 1; }
        var coastDirs = [];
        for (var dir in coasts) {
            if (coasts[dir].hasCoast) {
                coastDirs.push(dir);
            }
        }
        if (coastDirs.length < 1) {
            genChance += 0.2;
            riverProps.xFalloffPerY = 0;
            riverProps.yFalloff = 0.0000001;
            coastDirs.push(getRandomArrayItem(["n", "e", "s", "w"]));
        }

        if (coastDirs.length > maxCoastsToDrawRiver || Math.random() > genChance)
            return null;
        else {
            var randomDir = getRandomArrayItem(coastDirs);
            var directionToFlowFrom = getReverseDir(randomDir);

            riverProps.coasts = {
                n: { hasCoast: false },
                e: { hasCoast: false },
                s: { hasCoast: false },
                w: { hasCoast: false }
            };
            riverProps.coasts[directionToFlowFrom].hasCoast = true;
            riverProps.coasts[directionToFlowFrom].offset = offset;

            var river = generateCellNoise(riverProps);
            return river;
            //return generateCellNoise(riverProps);
        }
    }
    mapGeneration.makeRivers = makeRivers;
    function smoothCells(cells, minToChange, radius, times) {
        if (typeof minToChange === "undefined") { minToChange = 0.4; }
        if (typeof radius === "undefined") { radius = 1; }
        if (typeof times === "undefined") { times = 1; }
        var newCells = [];
        for (var i = 0; i < cells.length; i++) {
            newCells[i] = [];
            for (var j = 0; j < cells[i].length; j++) {
                var cell = cells[i][j];

                var neighbors = getArea({
                    targetArray: cells,
                    start: [i, j],
                    size: radius,
                    excludeStart: false
                });
                var totalNeighborCount = 0;

                var neighborTypes = {};
                for (var k = 0; k < neighbors.length; k++) {
                    var neigh = neighbors[k];

                    if (neigh !== undefined) {
                        if (!neighborTypes[neigh]) {
                            neighborTypes[neigh] = 0;
                        }
                        neighborTypes[neigh]++;
                        totalNeighborCount++;
                    }
                }

                var mostNeighborsType = undefined;
                var mostNeighborsCount = 0;
                for (var _type in neighborTypes) {
                    if (neighborTypes[_type] > mostNeighborsCount) {
                        mostNeighborsType = _type;
                        mostNeighborsCount = neighborTypes[_type];
                    }
                }
                ;
                if (mostNeighborsCount / totalNeighborCount >= minToChange) {
                    newCells[i][j] = mostNeighborsType;
                } else {
                    newCells[i][j] = cells[i][j];
                }
            }
        }
        ;

        times--;
        if (times > 0) {
            return smoothCells(newCells, minToChange, times);
        } else {
            return newCells;
        }
    }
    mapGeneration.smoothCells = smoothCells;
})(mapGeneration || (mapGeneration = {}));

function drawCoastInConsole(coast) {
    for (var i = 0; i < coast.finalCoast.length; i++) {
        var line = "" + i;
        var args = [""];
        for (var j = 0; j < coast.finalCoast[i].length; j++) {
            var c = (coast.finalCoast[i][j] === 1) ? "#0F0" : "#00F";
            line += "%c  ";
            args.push("background: " + c);
        }
        args[0] = line;
        console.log.apply(console, args);
    }
    ;
}

function drawNeighbors(neighs, center) {
    var dirs = [
        ["nw", "n", "ne"],
        ["w", "_c", "e"],
        ["sw", "s", "se"]
    ];

    neighs._c = center;

    for (var i = 0; i < dirs.length; i++) {
        var line = "" + i;
        var args = [""];
        for (var j = 0; j < dirs[i].length; j++) {
            var dir = dirs[i][j];

            if (!neighs[dir])
                continue;

            var c = (neighs[dir] === "grass") ? "#0F0" : "#00F";
            line += "%c    ";
            args.push("background: " + c);
        }
    }
    args[0] = line;
    console.log.apply(console, args);
}
//# sourceMappingURL=mapgeneration.js.map

/// <reference path="../data/js/cg.d.ts" />
/// <reference path="js/utility.d.ts" />
/// <reference path="js/arraylogic.d.ts" />
var cityGeneration;
(function (cityGeneration) {
    var typeIndexes = {};
    function getIndexedType(typeName) {
        if (!typeIndexes[typeName]) {
            typeIndexes[typeName] = findType(typeName);
        }

        return typeIndexes[typeName];
    }

    function getPlacability(cell, type, exclusions) {
        var canPlace = true;

        if (exclusions) {
            for (var i = 0; i < exclusions.length; i++) {
                var excludedFlags = exclusions[i].flags;

                var neighs = cell.getArea({ size: exclusions[i].radius });

                for (var j = 0; j < neighs.length; j++) {
                    if (arrayLogic.or(excludedFlags, neighs[j].flags)) {
                        canPlace = false;
                        break;
                    } else if (neighs[j].content && arrayLogic.or(excludedFlags, neighs[j].content.flags)) {
                        canPlace = false;
                        break;
                    }
                }
            }
        }
        ;

        if (!cell.checkBuildable(type)) {
            canPlace = false;
        }
        ;

        return canPlace;
    }

    function placeBuilding(board, _buildingType, includedArea, exclusions) {
        var buildingType = getIndexedType(_buildingType);

        var invertedIncludedArea = 1 - includedArea;
        var horBorder = board.width / 2 * invertedIncludedArea;
        var vertBorder = board.height / 2 * invertedIncludedArea;
        var min = [horBorder, vertBorder];
        var max = [board.width - horBorder - 1, board.height - vertBorder - 1];

        var finalPosition;

        for (var i = 0; i < 100; i++) {
            var randX = randInt(min[0], max[0]);
            var randY = randInt(min[1], max[1]);

            var cell = board.getCell([randX, randY]);

            var canPlace = getPlacability(cell, buildingType, exclusions);

            if (canPlace) {
                finalPosition = [randX, randY];
                break;
            }
        }

        if (!finalPosition)
            throw new Error("Couldn't place building");
        else {
            cell.changeContent(buildingType);
            return finalPosition;
        }
    }
    cityGeneration.placeBuilding = placeBuilding;

    function placeMainSubwayLines(board) {
        var connectedToLand = [];

        for (var dir in board.mapGenInfo.coasts) {
            if (board.mapGenInfo.coasts[dir].hasCoast !== true) {
                connectedToLand.push(dir);
            }
        }
        if (connectedToLand.length < 1) {
            connectedToLand.push(getRandomArrayItem(["n", "e", "s", "w"]));
        }

        var start = board.mapGenInfo.mainStationPos.slice(0);

        for (var i = 0; i < connectedToLand.length; i++) {
            var dir = connectedToLand[i];
            var end;

            switch (dir) {
                case "w": {
                    end = [0, start[1]];
                    break;
                }
                case "n": {
                    end = [start[0], 0];
                    break;
                }
                case "e": {
                    end = [board.width - 1, start[1]];
                    break;
                }
                case "s": {
                    end = [start[0], board.height - 1];
                    break;
                }
            }

            var toChange = board.getCells(manhattanSelect(start, end));
            for (var j = 0; j < toChange.length; j++) {
                toChange[j].changeUndergroundContent(cg["content"]["tubes"]["tube_nesw"]);
            }
        }
    }
    cityGeneration.placeMainSubwayLines = placeMainSubwayLines;

    function placeStationRoads(board) {
        var connectedToLand = {};
        var hasConnection = false;

        for (var dir in board.mapGenInfo.coasts) {
            if (board.mapGenInfo.coasts[dir].hasCoast !== true) {
                connectedToLand[dir] = true;
                hasConnection = true;
            }
        }
        if (!hasConnection) {
            var randDir = getRandomArrayItem(["n", "e", "s", "w"]);
            connectedToLand[randDir] = true;
        }
        var start = board.mapGenInfo.mainStationPos.slice(0);

        var adjust = [0, 0];
        var adjustMappings = {
            n: [0, 1],
            s: [0, -1],
            e: [-1, 0],
            w: [1, 0]
        };

        var landDirs = Object.keys(connectedToLand);
        var horDirs = [];
        var verDirs = [];

        [["n", "s"], ["e", "w"]].forEach(function (dirSet) {
            var roads = [];
            dirSet.forEach(function (dir) {
                if (landDirs.indexOf(dir) > -1)
                    roads.push(dir);
            });
            if (roads.length > 0) {
                if (landDirs.length <= 1) {
                    adjust[0] += adjustMappings[roads[0]][1];
                    adjust[1] += adjustMappings[roads[0]][0];
                } else if (roads.length === 1) {
                    adjust[0] += adjustMappings[roads[0]][0];
                    adjust[1] += adjustMappings[roads[0]][1];
                } else {
                    var dirToUse = getRandomArrayItem(dirSet);
                    adjust[0] += adjustMappings[dirToUse][0];
                    adjust[1] += adjustMappings[dirToUse][1];
                }
            }
        });

        start[0] += adjust[0];
        start[1] += adjust[1];

        for (var dir in connectedToLand) {
            var end;

            switch (dir) {
                case "w": {
                    end = [0, start[1]];
                    break;
                }
                case "n": {
                    end = [start[0], 0];
                    break;
                }
                case "e": {
                    end = [board.width - 1, start[1]];
                    break;
                }
                case "s": {
                    end = [start[0], board.height - 1];
                    break;
                }
            }

            var toChange = board.getCells(manhattanSelect(start, end));
            for (var j = 0; j < toChange.length; j++) {
                toChange[j].changeContent(cg["content"]["roads"]["road_nesw"]);
            }
        }
    }
    cityGeneration.placeStationRoads = placeStationRoads;

    function placeInitialHousing(board) {
        var populationToPlace = board.population;

        // TODO
        var apartmentBuildings = [];
        for (var _b in cg.content.buildings) {
            if (cg.content.buildings[_b].categoryType === "apartment" && cg.content.buildings[_b].population === 5) {
                apartmentBuildings.push(_b);
            }
        }

        while (populationToPlace > 0) {
            var buildingToPlace = getRandomArrayItem(apartmentBuildings);

            placeBuilding(board, buildingToPlace, 0.9, [
                { radius: 1, flags: ["water"] }
            ]);
            populationToPlace -= getIndexedType(buildingToPlace).population;
        }
    }
    cityGeneration.placeInitialHousing = placeInitialHousing;
})(cityGeneration || (cityGeneration = {}));
//# sourceMappingURL=citygeneration.js.map

/// <reference path="js/utility.d.ts" />
/// <reference path="js/sorteddisplaycontainer.d.ts" />
/// <reference path="js/mapgeneration.d.ts" />
/// <reference path="js/citygeneration.d.ts" />
///
/// <reference path="../lib/pixi.d.ts" />
var idGenerator = idGenerator || {};
idGenerator.board = 0;

var Board = (function () {
    function Board(props) {
        this.mapGenInfo = {};
        this.layers = {};
        this.id = props.id !== undefined ? props.id : idGenerator.board++;
        this.name = "City " + this.id;

        this.width = props.width;
        this.height = props.height || props.width;

        this.totalSize = this.width * this.height;

        this.initLayers();

        this.population = props.population || randInt(this.totalSize / 15, this.totalSize / 10);

        this.cells = mapGeneration.makeBlankCells({
            width: this.width,
            height: this.height
        });

        if (props.savedCells) {
            mapGeneration.convertCells(this.cells, this, true);
            mapGeneration.readSavedMap({
                board: this,
                savedCells: props.savedCells
            });
        } else {
            this.generateMap();
            this.generateCity();
        }
    }
    Board.prototype.generateMap = function () {
        var startTime = window.performance ? window.performance.now() : Date.now();

        var coasts = this.mapGenInfo.coasts = mapGeneration.generateCellNoise({
            width: this.width,
            mapHeight: this.height,
            amountWeights: [1, 0.5, 0.4, 0],
            variation: 0.5,
            yFalloff: 0.14,
            xCutoff: 0.3,
            xFalloff: 0.1,
            xFalloffPerY: 0.3,
            landThreshhold: 0.4
        });
        mapGeneration.applyCoastsToCells({
            cells: this.cells,
            primaryType: "grass",
            subType: "water",
            coasts: coasts
        });

        var rivers = this.mapGenInfo.rivers = mapGeneration.makeRivers(coasts, 0.7, {
            width: this.width / 4,
            mapHeight: this.height,
            depth: this.height,
            variation: 0.000001,
            baseVariation: [0.8, 1],
            yFalloff: 0.00001,
            xCutoff: 0.7,
            xFalloff: 0.6,
            xFalloffPerY: 0.4,
            landThreshhold: 0.2
        }, [this.width / 2 - this.width / 8, 0]);

        this.cells = mapGeneration.smoothCells(this.cells, 0.6, 1, 4);
        this.cells = mapGeneration.smoothCells(this.cells, 0.6, 2, 2);
        this.cells = mapGeneration.smoothCells(this.cells, 0.7, 3, 1);

        if (rivers) {
            mapGeneration.applyCoastsToCells({
                cells: this.cells,
                primaryType: "water",
                subType: "grass",
                coasts: rivers
            });
        }

        this.cells = mapGeneration.smoothCells(this.cells, 0.5, 1, 2);

        mapGeneration.convertCells(this.cells, this, false);

        var finishTime = window.performance ? window.performance.now() : Date.now();
        var elapsed = finishTime - startTime;
        console.log("map gen in " + Math.round(elapsed) + " ms");
    };

    Board.prototype.generateCity = function () {
        this.mapGenInfo.mainStationPos = cityGeneration.placeBuilding(this, "smallstation", 0.4, [{ flags: ["water"], radius: 4 }]);
        cityGeneration.placeStationRoads(this);
        cityGeneration.placeMainSubwayLines(this);
        cityGeneration.placeInitialHousing(this);
    };

    Board.prototype.getCell = function (arr) {
        if (this.cells[arr[0]] && this.cells[arr[1]]) {
            return this.cells[arr[0]][arr[1]];
        } else
            return false;
    };
    Board.prototype.getCells = function (arr) {
        return getFrom2dArray(this.cells, arr);
    };
    Board.prototype.destroy = function () {
        for (var i = 0; i < this.cells.length; i++) {
            for (var j = 0; j < this.cells[i].length; j++) {
                this.cells[i][j] = null;
            }
        }
    };
    Board.prototype.initLayers = function () {
        for (var i = 1; i <= 1; i++) {
            var zoomStr = "zoom" + i;

            var zoomLayer = this.layers[zoomStr] = {};

            zoomLayer["undergroundContent"] = new SortedDisplayObjectContainer(this.totalSize * 2);
            zoomLayer["ground"] = new PIXI.DisplayObjectContainer();
            zoomLayer["landValueOverlay"] = new PIXI.DisplayObjectContainer();
            zoomLayer["cellOverlay"] = new SortedDisplayObjectContainer(this.totalSize * 2);
            zoomLayer["content"] = new SortedDisplayObjectContainer(this.totalSize * 2);
        }
    };
    Board.prototype.addSpriteToLayer = function (layerToAddTo, spriteToAdd, gridPos) {
        for (var zoomLevel in this.layers) {
            var layer = this.layers[zoomLevel][layerToAddTo];

            if (layer._addChildAt) {
                layer._addChildAt(spriteToAdd, gridPos[0] + gridPos[1]);
            } else {
                layer.addChild(spriteToAdd);
            }
        }
    };
    Board.prototype.removeSpriteFromLayer = function (layerToRemoveFrom, spriteToRemove, gridPos) {
        for (var zoomLevel in this.layers) {
            var layer = this.layers[zoomLevel][layerToRemoveFrom];

            if (layer._removeChildAt) {
                layer._removeChildAt(spriteToRemove, gridPos[0] + gridPos[1]);
            } else {
                layer.removeChild(spriteToRemove);
            }
        }
    };
    return Board;
})();
//# sourceMappingURL=board.js.map

/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/utility.d.ts" />
function makeLandValueOverlay(board) {
    var cellsToOverlay = [];
    var minValue, maxValue;
    var colorIndexes = {};

    function getRelativeValue(val) {
        var difference = maxValue - minValue;
        if (difference < 1)
            difference = 1;

        // clamps to n different colors
        var threshhold = difference / 6;
        if (threshhold < 1)
            threshhold = 1;
        var relative = (Math.round(val / threshhold) * threshhold - minValue) / (difference);
        return relative;
    }

    for (var i = 0; i < board.width; i++) {
        for (var j = 0; j < board.height; j++) {
            var cell = board.cells[i][j];
            if (cell.type.type !== "water") {
                if (!minValue) {
                    minValue = maxValue = cell.landValue;
                } else {
                    if (cell.landValue < minValue)
                        minValue = cell.landValue;
                    else if (cell.landValue > maxValue)
                        maxValue = cell.landValue;
                }

                cellsToOverlay.push({
                    value: cell.landValue,
                    sprite: cell.sprite
                });
            }
        }
    }

    var container = new PIXI.DisplayObjectContainer();

    for (var i = 0; i < cellsToOverlay.length; i++) {
        var cell = cellsToOverlay[i];

        if (!colorIndexes[cell.value]) {
            var relativeValue = getRelativeValue(cell.value);

            //relativeValue += relativeValue * 0.3;
            if (relativeValue < 0)
                relativeValue = 0;
            else if (relativeValue > 1)
                relativeValue = 1;

            var hue = 100 - 100 * relativeValue;
            var saturation = 1 - 0.2 * relativeValue;
            var luminesence = 0.75 + 0.25 * relativeValue;

            colorIndexes[cell.value] = hslToHex(hue / 360, saturation, luminesence / 2);
        }

        var color = colorIndexes[cell.value];

        var _s = PIXI.Sprite.fromFrame("blank.png");
        _s.position = cell.sprite.position.clone();
        _s.anchor = cell.sprite.anchor.clone();
        _s.tint = color;

        container.addChild(_s);
    }

    return container;
}
//# sourceMappingURL=landvalueoverlay.js.map

/// <reference path="../lib/pixi.d.ts" />
///
/// <reference path="js/eventlistener.d.ts" />
///
var Highlighter = (function () {
    function Highlighter() {
        this.currHighlighted = [];
        this.currTransparent = [];
    }
    Highlighter.prototype.tintSprites = function (sprites, color, shouldGroup) {
        if (typeof shouldGroup === "undefined") { shouldGroup = true; }
        for (var i = 0; i < sprites.length; i++) {
            var _sprite = sprites[i];
            _sprite.tint = color;

            if (shouldGroup)
                this.currHighlighted.push(sprites[i]);
        }
    };
    Highlighter.prototype.clearSprites = function (shouldClear) {
        if (typeof shouldClear === "undefined") { shouldClear = true; }
        for (var i = 0; i < this.currHighlighted.length; i++) {
            var _sprite = this.currHighlighted[i];
            _sprite.tint = 0xFFFFFF;
        }
        if (shouldClear)
            this.clearHighlighted();
    };
    Highlighter.prototype.clearHighlighted = function () {
        this.currHighlighted = [];
    };
    Highlighter.prototype.tintCells = function (cells, color, shouldGroup) {
        if (typeof shouldGroup === "undefined") { shouldGroup = true; }
        var _sprites = [];
        for (var i = 0; i < cells.length; i++) {
            _sprites.push(cells[i].sprite);
            if (cells[i].content !== undefined) {
                _sprites = _sprites.concat(cells[i].content.sprites);
            }
        }
        this.tintSprites(_sprites, color, shouldGroup);
    };
    Highlighter.prototype.alphaBuildings = function (cells, value) {
        var _sprites = [];
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].content !== undefined) {
                var content = cells[i].content;
                for (var j = 0; j < content.sprites.length; j++) {
                    var sprite = content.sprites[j];
                    if (sprite.height < 53)
                        continue;
                    sprite.alpha = value;
                    this.currTransparent.push(sprite);
                }
            }
        }
    };
    Highlighter.prototype.clearAlpha = function () {
        for (var i = 0; i < this.currTransparent.length; i++) {
            this.currTransparent[i].alpha = 1;
        }
        this.currTransparent = [];
    };
    return Highlighter;
})();
//# sourceMappingURL=spritehighlighter.js.map

/// <reference path="../lib/pixi.d.ts" />
///
/// <reference path="js/spritehighlighter.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
///
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Blinker = (function (_super) {
    __extends(Blinker, _super);
    function Blinker(delay, color, repeat, autoStart) {
        if (typeof autoStart === "undefined") { autoStart = true; }
        _super.call(this);
        this.delay = delay;
        this.color = color;
        this.repeat = repeat;
        this.toBlink = {};
        this.idGenerator = 0;
        this.blinkFunctions = [];
        this.onRemoveCallbacks = {};

        this.repeat = repeat * 2;

        this.makeBlinkFunctions();

        if (autoStart)
            this.start();

        return this;
    }
    Blinker.prototype.getToBlink = function (id) {
        if (id)
            return this.toBlink[id];
        else {
            var cells = [];

            for (var group in this.toBlink) {
                cells = cells.concat(this.toBlink[group]);
            }
            return cells;
        }
    };
    Blinker.prototype.makeBlinkFunctions = function () {
        // allows dynamic assignment
        var getColor = function getColorFN() {
            return this.color;
        }.bind(this);

        var tintFN = function () {
            this.tintCells(this.getToBlink(), getColor(), false);
        }.bind(this);
        var clearFN = this.clearFN = function (id) {
            this.tintCells(this.getToBlink(id), 0xFFFFFF, false);
        }.bind(this);
        this.blinkFunctions = [tintFN, clearFN];

        this.blink = function loopFN() {
            this.blinkFunctions[0].call();
            this.blinkFunctions[this.blinkFunctions.length - 1] = this.blinkFunctions.shift();
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });

            if (this.repeat > 0) {
                this.repeat--;
                if (this.repeat <= 0)
                    this.stop();
            }
        }.bind(this);
    };
    Blinker.prototype.addCells = function (cells, onRemove, id) {
        if (typeof id === "undefined") { id = this.idGenerator++; }
        if (!this.toBlink[id])
            this.toBlink[id] = cells;
        else {
            this.toBlink[id] = this.toBlink[id].concat(cells);
        }

        if (onRemove) {
            this.onRemoveCallbacks[id] = onRemove;
        }

        return id;
    };
    Blinker.prototype.removeCells = function (id) {
        if (!this.toBlink[id])
            return;
        else {
            if (Object.keys(this.toBlink).length <= 1) {
                this.stop();
            } else {
                this.clearFN(id);
                this.toBlink[id] = null;
                delete this.toBlink[id];
            }

            if (this.onRemoveCallbacks[id]) {
                this.onRemoveCallbacks[id].call();
                this.onRemoveCallbacks[id] = null;
                delete this.onRemoveCallbacks[id];
            }
        }

        return id;
    };
    Blinker.prototype.start = function () {
        // already running
        if (this.intervalFN)
            return this;

        var self = this;

        self.blink();
        this.intervalFN = window.setInterval(self.blink, self.delay);

        return this;
    };
    Blinker.prototype.pause = function () {
        window.clearInterval(this.intervalFN);
        this.intervalFN = null;

        return this;
    };
    Blinker.prototype.stop = function () {
        this.pause();
        this.clearFN();
        eventManager.dispatchEvent({ type: "updateWorld", content: "" });

        this.toBlink = {};

        return this;
    };
    return Blinker;
})(Highlighter);
//# sourceMappingURL=spriteblinker.js.map

/// <reference path="js/eventlistener.d.ts" />
var keyboardStates = {
    "default": {
        "keydown": {
            // space
            "32": function () {
                //eventManager.dispatchEvent({type: "togglePause", content:""});
            },
            // numpad plus
            "107": function () {
                eventManager.dispatchEvent({ type: "incrementSpeed", content: "" });
            },
            // plus
            "187": function () {
                eventManager.dispatchEvent({ type: "incrementSpeed", content: "" });
            },
            // numpad minus
            "109": function () {
                eventManager.dispatchEvent({ type: "decrementSpeed", content: "" });
            },
            // minus
            "189": function () {
                eventManager.dispatchEvent({ type: "decrementSpeed", content: "" });
            },
            // r
            // recruit
            "82": function () {
                eventManager.dispatchEvent({
                    type: "recruitHotkey",
                    content: ""
                });
                //document.getElementById("recruitBtn").click();
            },
            // u
            // buy
            "85": function (e) {
                eventManager.dispatchEvent({
                    type: "buyHotkey",
                    content: e
                });
                //document.getElementById("buyBtn").click();
            },
            // b
            // build
            "66": function (e) {
                eventManager.dispatchEvent({
                    type: "buildHotkey",
                    content: e
                });
                //document.getElementById("buildBtn").click();
            },
            // c
            // click
            "67": function (e) {
                eventManager.dispatchEvent({
                    type: "clickHotkey",
                    content: e
                });
            },
            // s
            // sell
            "83": function (e) {
                eventManager.dispatchEvent({
                    type: "sellHotkey",
                    content: e
                });
            }
        }
    }
};

var KeyboardEventHandler = (function () {
    function KeyboardEventHandler(initialState) {
        if (typeof initialState === "undefined") { initialState = "default"; }
        this.listeners = {};
        this.statesObj = keyboardStates;
        this.setState(initialState);
    }
    KeyboardEventHandler.prototype.setState = function (state) {
        this.removeListeners();
        this.addEventListeners(state);
        this.currState = state;
    };
    KeyboardEventHandler.prototype.addEventListeners = function (state) {
        for (var type in this.statesObj[state]) {
            var eventHandler;
            if (type === "keydown") {
                eventHandler = this.handleKeydown.bind(this);
            } else if (type === "keyup") {
                eventHandler = this.handleKeyup.bind(this);
            } else {
                console.warn("Tried to bind invalid keyboard event ", type);
                return;
            }
            this.listeners[type] = document.addEventListener(type, eventHandler);
        }
    };
    KeyboardEventHandler.prototype.removeListeners = function () {
        for (var type in this.listeners) {
            document.removeEventListener(type, this.listeners[type]);
        }
        this.listeners = {};
    };
    KeyboardEventHandler.prototype.handleKeydown = function (event) {
        if (this.statesObj[this.currState]["keydown"][event.keyCode]) {
            if ((event.target.tagName === "INPUT" && event.target.type === "text") || event.target.tagName === "TEXTAREA") {
                return;
            }
            event.preventDefault();
            this.statesObj[this.currState]["keydown"][event.keyCode].call(null, event);
        }
    };
    KeyboardEventHandler.prototype.handleKeyup = function (event) {
    };
    return KeyboardEventHandler;
})();
//# sourceMappingURL=keyboardinput.js.map

/// <reference path="js/utility.d.ts" />
/// <reference path="../data/js/names.d.ts" />
/// <reference path="../data/js/employeemodifiers.d.ts" />
///
var idGenerator = idGenerator || {};
idGenerator.employee = 0;

var Employee = (function () {
    function Employee(names, params) {
        this.active = true;
        this.id = params.id || "employee" + idGenerator.employee++;

        this.gender = params.gender || getRandomArrayItem(["male", "female"]);
        this.ethnicity = params.ethnicity || getRandomKey(names);
        this.name = params.name || this.getName(names, this.gender, this.ethnicity);

        var skillVariance = Math.round(params.skillVariance) || 1;

        // legacy
        if (params.skills && params.skills["management"])
            delete params.skills["management"];

        this.skills = params.skills || this.setSkillsByLevel(params.skillLevel, skillVariance);
        this.growth = params.growth || this.setGrowthByLevel(params.growthLevel);
        this.potential = params.potential || 60;

        //40 * params.skillLevel + 20 * Math.random();
        if (params.trait)
            this.addTrait(employeeModifiers[params.trait]);

        this.setSkillTotal();
        if (params.id === undefined) {
            var traitThreshold = isFinite(params.traitChance) ? params.traitChance : 0.05;
            var rand = Math.random();

            if (rand <= traitThreshold) {
                this.addRandomTrait();
            }
        }
    }
    Employee.prototype.getName = function (names, gender, ethnicity) {
        var first = getRandomArrayItem(names[ethnicity][gender]);
        var last = getRandomArrayItem(names[ethnicity]["surnames"]);

        var final = "";
        if (names[ethnicity].props && names[ethnicity].props.surname_first) {
            final += last + " " + first;
        } else {
            final += first + " " + last;
        }

        return final;
    };
    Employee.prototype.setSkillsByLevel = function (skillLevel, variance) {
        var skills = {
            negotiation: 1,
            recruitment: 1,
            construction: 1
        };
        var min = 8 * skillLevel + 1;
        var max = 16 * skillLevel + 1 + variance;

        for (var skill in skills) {
            skills[skill] = randInt(min, max);
            if (skills[skill] > 20)
                skills[skill] = 20;
        }
        return skills;
    };
    Employee.prototype.setGrowthByLevel = function (growthLevel) {
        var skills = {
            negotiation: 1,
            recruitment: 1,
            construction: 1
        };

        for (var skill in skills) {
            var _growth = Math.random() * growthLevel;
            skills[skill] = _growth > 0.4 ? _growth : 0.4;
        }
        return skills;
    };
    Employee.prototype.setSkillTotal = function () {
        var total = 0;
        for (var skill in this.skills) {
            total += this.skills[skill];
        }
        this.skillTotal = total;
    };
    Employee.prototype.trainSkill = function (skill) {
        // don't train if potential is already reached
        if (this.skillTotal >= this.potential)
            return;
        else if (this.skills[skill] >= 20)
            return;
        else {
            var rand = Math.random();

            var adjustedGrowth = this.growth[skill] * (2 / Math.log(this.skills[skill] + 0.5));

            if (rand + adjustedGrowth > 1) {
                this.skills[skill]++;
                this.skillTotal++;
            }
        }
    };
    Employee.prototype.addTrait = function (modifier) {
        this.trait = modifier;

        if (this.player) {
            this.player.addEmployeeModifier(modifier);
        }
    };
    Employee.prototype.addRandomTrait = function () {
        var toAdd = getRandomArrayItem(this.getAvailableTraits());
        this.addTrait(toAdd);
    };
    Employee.prototype.getAvailableTraits = function () {
        var available = [];
        var byUnlock = employeeModifiers.modifiersByUnlock.skillTotal;

        for (var _total in byUnlock) {
            if (this.skillTotal >= parseInt(_total)) {
                available = available.concat(byUnlock[_total]);
            }
        }

        return available;
    };
    return Employee;
})();

function makeNewEmployees(employeeCount, recruitingSkill) {
    var newEmployees = [];

    // sets skill level linearly between 0 and 1 with 1 = 0 and 20 = 1
    var recruitSkillLevel = function (recruitingSkill) {
        // i love you wolfram alpha
        return 0.0526316 * recruitingSkill - 0.0526316;
    };

    // logarithmic: 1 = 3, >=6 = 1
    // kiss me wolfram alpha
    var skillVariance = recruitingSkill > 6 ? 1 : 3 - 0.868589 * Math.log(recruitingSkill);

    for (var i = 0; i < employeeCount; i++) {
        var newEmployee = new Employee(names, {
            skillLevel: recruitSkillLevel(recruitingSkill),
            growthLevel: Math.random(),
            skillVariance: skillVariance
        });

        newEmployees.push(newEmployee);
    }

    return newEmployees;
}
//# sourceMappingURL=employee.js.map

/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
/// <reference path="../data/js/playermodifiers.d.ts" />
/// <reference path="../data/js/levelupmodifiers.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/utility.d.ts" />
var Player = (function () {
    function Player(id, color) {
        if (typeof color === "undefined") { color = 0xFF0000; }
        this.money = 0;
        this.clicks = 0;
        this.level = 1;
        this.experience = 0;
        this.experienceForCurrentLevel = 0;
        this.experienceToNextLevel = 0;
        this.timesReset = 0;
        this.prestige = 0;
        this.totalResetExperience = 0;
        this.permanentLevelupUpgrades = [];
        this.ownedContent = {};
        this.amountBuiltPerType = {};
        this.amountBuiltPerCategory = {};
        this.ownedCells = {};
        this.ownedCellsAmount = 0;
        this.employees = {};
        this.usedInitialRecruit = false;
        this.incomePerDate = {};
        this.incomePerType = {};
        this.rollingIncome = [0, 0, 0];
        this.modifiers = {};
        this.dynamicModifiers = {};
        this.timedModifiers = {};
        this.levelUpModifiers = {};
        this.specialModifiers = {};
        this.defaultModifiers = {};
        this.employeeModifiers = {};
        this.modifierEffects = {
            profit: {},
            buildCost: {},
            buyCost: {},
            recruitQuality: 1,
            sellPrice: 0.5
        };
        this.unlockedModifiers = [];
        this.lockedModifiers = [];
        this.unlockedLevelUpModifiers = {};
        this.levelUpModifiersPerLevelUp = 4;
        this.levelsAlreadyPicked = {};
        this.recentlyCheckedUnlockConditions = {};
        this.indexedProfits = {};
        this.indexedProfitsWithoutGlobals = {};
        this.id = id;
        this.color = color;
        this.init();
        this.updateElements();
    }
    Player.prototype.updateElements = function () {
        var moneyBeautifyIndex = this.money > 999999 ? 3 : 0;
        var beautified = "$" + beautify(this.money, moneyBeautifyIndex);
        var expBeautifyIndex = this.experienceToNextLevel > 999999 ? 2 : 0;

        /*
        var rolling = this.rollingIncome.reduce(function(a,b)
        {
        return a+b;
        }) / 3;
        */
        var rolling = this.rollingIncome[2];

        var money = {
            total: beautified,
            rolling: rolling.toFixed(1)
        };

        eventManager.dispatchEvent({ type: "updatePlayerMoney", content: money });
        eventManager.dispatchEvent({
            type: "updatePlayerExp",
            content: {
                experience: beautify(this.experience, expBeautifyIndex),
                nextLevel: beautify(this.experienceToNextLevel, expBeautifyIndex),
                level: this.level,
                percentage: this.getExperiencePercentage()
            }
        });
    };
    Player.prototype.init = function () {
        for (var building in cg.content.buildings) {
            var type = cg.content.buildings[building];

            if (!this.ownedContent[type.categoryType]) {
                this.ownedContent[type.categoryType] = [];
            }
            if (this.amountBuiltPerType[type.type] === undefined) {
                this.amountBuiltPerType[type.type] = 0;
            }
            if (this.amountBuiltPerCategory[type.categoryType] === undefined) {
                this.amountBuiltPerCategory[type.categoryType] = 0;
            }
            if (this.incomePerType[type.categoryType] === undefined) {
                this.incomePerType[type.categoryType] = 0;
            }

            this.modifierEffects.profit[type.categoryType] = {
                addedProfit: 0,
                multiplier: 1
            };
            this.modifierEffects.buildCost[type.categoryType] = {
                addedCost: 0,
                multiplier: 1
            };
        }
        this.modifierEffects.profit["global"] = {
            addedProfit: 0,
            multiplier: 1
        };
        this.modifierEffects.buildCost["global"] = {
            addedCost: 0,
            multiplier: 1
        };
        this.modifierEffects.buyCost["global"] = {
            addedCost: 0,
            multiplier: 1
        };
        this.modifierEffects.profit["click"] = {
            addedProfit: 1,
            multiplier: 1
        };

        this.setExperienceToNextLevel();
        this.setInitialAvailableModifiers();

        this.addModifier(playerModifiers.prestigeDefault, "defaultModifiers");
    };

    Player.prototype.addEmployee = function (employee) {
        this.employees[employee.id] = employee;
        employee.player = this;
        if (employee.trait) {
            this.addEmployeeModifier(employee.trait);
        }
    };
    Player.prototype.removeEmployee = function (employee) {
        if (employee.trait) {
            this.removeModifier(employee.trait, "employeeModifiers");
            for (var _id in this.employees) {
                var _employee = this.employees[_id];

                if (_employee.trait && _employee.trait.type === employee.trait.type) {
                    this.addEmployeeModifier(_employee.trait);
                }
            }
        }
        this.employees[employee.id] = null;
        delete this.employees[employee.id];
    };
    Player.prototype.getEmployees = function () {
        var employees = [];
        for (var employee in this.employees) {
            employees.push(this.employees[employee]);
        }
        ;

        return employees;
    };
    Player.prototype.getActiveEmployees = function () {
        var active = [];
        for (var employee in this.employees) {
            if (employee.active !== false)
                active.push(this.employees[employee]);
        }
        ;

        return active;
    };

    Player.prototype.addCell = function (cell) {
        if (!this.ownedCells[cell.gridPos]) {
            this.ownedCells[cell.gridPos] = cell;

            cell.player = this;
            cell.addOverlay(this.color);

            this.ownedCellsAmount++;
        }
    };
    Player.prototype.removeCell = function (cell) {
        if (this.ownedCells[cell.gridPos]) {
            if (cell.overlay)
                cell.removeOverlay();

            delete this.ownedCells[cell.gridPos];
            cell.player = null;
            this.ownedCellsAmount--;
        }
    };
    Player.prototype.sellCell = function (cell) {
        var value = this.getCellBuyCost(cell) * this.modifierEffects.sellPrice;

        this.addMoney(value, "sell");
        this.removeCell(cell);
    };
    Player.prototype.addContent = function (content) {
        // for trees etc.
        if (!this.ownedContent[content.categoryType])
            return;

        this.ownedContent[content.categoryType].push(content);
        this.amountBuiltPerType[content.type.type]++;
        this.amountBuiltPerCategory[content.type.categoryType]++;

        this.checkLockedModifiers(content.type.type, -1);
        this.checkLockedModifiers(content.type.categoryType, -1);
        content.player = this;
        this.updateDynamicModifiers(content.type.type);
        this.updateDynamicModifiers(content.type.categoryType);
    };
    Player.prototype.removeContent = function (content) {
        this.ownedContent[content.categoryType] = this.ownedContent[content.categoryType].filter(function (building) {
            return building.id !== content.id;
        });

        this.amountBuiltPerType[content.type.type]--;
        this.amountBuiltPerCategory[content.type.categoryType]--;

        this.updateDynamicModifiers(content.type.type);
        this.updateDynamicModifiers(content.type.categoryType);
    };
    Player.prototype.sellContent = function (content) {
        var type = content.type;
        if (!type.cost)
            return;
        if (!content.player || content.player.id !== this.id)
            return;

        var value = this.getBuildCost(type) * this.modifierEffects.sellPrice;

        this.addMoney(value, "sell");
    };
    Player.prototype.addMoney = function (initialAmount, incomeType, baseMultiplier, date) {
        var amount = initialAmount;

        if (incomeType && ["sell", "initial"].indexOf(incomeType) < 0) {
            amount = this.getIndexedProfit(incomeType, initialAmount, baseMultiplier);
        }

        if (amount > 0 && incomeType !== "sell" && incomeType !== "initial") {
            this.addExperience(amount);
        }

        if (incomeType) {
            if (this.incomePerType[incomeType] === undefined) {
                this.incomePerType[incomeType] = 0;
            }
            this.incomePerType[incomeType] += amount;
        }
        if (date) {
            this.incomePerDate[date.year] = this.incomePerDate[date.year] || { total: 0 };
            var _y = this.incomePerDate[date.year];
            _y.total += amount;

            _y[date.month] = _y[date.month] || { total: 0 };
            var _m = _y[date.month];
            _m.total += amount;

            _m[date.day] ? _m[date.day] += amount : _m[date.day] = amount;
            this.addToRollingIncome(amount, date);
        }

        if (!isFinite(amount))
            throw new Error("Infinite amount of money added");
        this.money += amount;
        this.checkLockedModifiers("money");
        this.updateElements();

        return amount;
    };
    Player.prototype.subtractCost = function (amount) {
        if (!isFinite(amount))
            throw new Error("Infinite amount of money subtracted");
        this.money -= amount;
        this.checkLockedModifiers("money");
        this.updateElements();

        return amount;
    };
    Player.prototype.addModifier = function (modifier, collection, firstTime) {
        if (typeof collection === "undefined") { collection = "modifiers"; }
        if (typeof firstTime === "undefined") { firstTime = true; }
        if (this[collection][modifier.type])
            return;
        if (firstTime) {
            if (modifier.cost && modifier.cost > this.money)
                return;

            if (modifier.cost) {
                this.subtractCost(modifier.cost);
            }
        }

        var index = this.unlockedModifiers.indexOf(modifier);
         {
            if (index > -1) {
                this.unlockedModifiers.splice(index, 1);
            }
        }
        this[collection][modifier.type] = Object.create(modifier);

        if (modifier.effects) {
            this.applyModifier(modifier);
        }
        if (modifier.onAdd) {
            if (!modifier.onAdd.oneTime || firstTime === true) {
                modifier.onAdd.effect.call(null, this);
            }
        }
        if (modifier.dynamicEffect) {
            this.addDynamicModifier(modifier);
        }
    };
    Player.prototype.addSpecialModifier = function (modifier) {
        if (this.specialModifiers[modifier.type]) {
            this.removeModifier(this.specialModifiers[modifier.type], "specialModifiers");
        }
        this.addModifier(modifier, "specialModifiers");
    };
    Player.prototype.addTimedModifier = function (modifier) {
        if (!modifier.lifeTime) {
            throw new Error("Timed modifier" + modifier.type + "has no life time set");
        }
        if (this.timedModifiers[modifier.type]) {
            window.clearTimeout(this.timedModifiers[modifier.type]);
        }

        var removeTimedModifierFN = function () {
            this.removeModifier(this.specialModifiers[modifier.type], "specialModifiers");
            window.clearTimeout(this.timedModifiers[modifier.type]);
        }.bind(this);

        this.timedModifiers[modifier.type] = window.setTimeout(removeTimedModifierFN, modifier.lifeTime);

        this.addSpecialModifier(modifier);
    };
    Player.prototype.addDynamicModifier = function (sourceModifier) {
        for (var condition in sourceModifier.dynamicEffect) {
            var modifier = sourceModifier.dynamicEffect[condition];

            if (!this.dynamicModifiers[condition]) {
                this.dynamicModifiers[condition] = {};
            }

            this.dynamicModifiers[condition][sourceModifier.type] = modifier;

            this.updateDynamicModifiers(condition);
        }
    };
    Player.prototype.addEmployeeModifier = function (modifier) {
        this.addModifier(modifier, "employeeModifiers");
    };
    Player.prototype.applyModifier = function (modifier) {
        for (var ii = 0; ii < modifier.effects.length; ii++) {
            var effect = modifier.effects[ii];

            for (var jj = 0; jj < effect.targets.length; jj++) {
                var type = effect.targets[jj];

                if (effect.addedProfit) {
                    this.modifierEffects.profit[type].addedProfit += effect.addedProfit;
                }
                if (effect.multiplier) {
                    this.modifierEffects.profit[type].multiplier *= effect.multiplier;
                }
                if (effect.buildCost) {
                    if (effect.buildCost.addedProfit) {
                        this.modifierEffects.buildCost[type].addedCost += effect.buildCost.addedCost;
                    }
                    if (effect.buildCost.multiplier) {
                        this.modifierEffects.buildCost[type].multiplier *= effect.buildCost.multiplier;
                    }
                }
                if (effect.buyCost) {
                    if (effect.buyCost.addedProfit) {
                        this.modifierEffects.buyCost.addedCost += effect.buyCost.addedCost;
                    }
                    if (effect.buyCost.multiplier) {
                        this.modifierEffects.buyCost.multiplier *= effect.buyCost.multiplier;
                    }
                }
                this.clearIndexedProfits();
            }
        }
    };
    Player.prototype.applyAllModifiers = function () {
        for (var _modifier in this.modifiers) {
            this.applyModifier(this.modifiers[_modifier]);
        }
        ;
    };
    Player.prototype.removeModifier = function (modifier, collection) {
        if (typeof collection === "undefined") { collection = "modifiers"; }
        if (!this[collection][modifier.type]) {
            console.warn("Modifier ", modifier, " does not exist on player ", this);
            return;
        }

        for (var ii = 0; ii < modifier.effects.length; ii++) {
            var effect = modifier.effects[ii];

            for (var jj = 0; jj < effect.targets.length; jj++) {
                var type = effect.targets[jj];

                if (effect.addedProfit) {
                    this.modifierEffects.profit[type].addedProfit -= effect.addedProfit;
                }
                if (effect.multiplier) {
                    this.modifierEffects.profit[type].multiplier *= (1 / effect.multiplier);
                }
                if (effect.buildCost) {
                    if (effect.buildCost.addedProfit) {
                        this.modifierEffects.buildCost[type].addedCost -= effect.buildCost.addedCost;
                    }
                    if (effect.buildCost.multiplier) {
                        this.modifierEffects.buildCost[type].multiplier *= (1 / effect.buildCost.multiplier);
                    }
                }
                if (effect.buycost) {
                    if (effect.buycost.addedProfit) {
                        this.modifierEffects.buyCost.addedCost -= effect.buycost.addedCost;
                    }
                    if (effect.buycost.multiplier) {
                        this.modifierEffects.buyCost.multiplier *= (1 / effect.buycost.multiplier);
                    }
                }
                this.clearIndexedProfits();
            }
        }

        this[collection][modifier.type] = null;
        delete this.modifiers[modifier.type];
    };
    Player.prototype.getBuildCost = function (type) {
        var cost = type.cost;
        var alreadyBuilt = this.amountBuiltPerType[type.type];

        var baseCost = cost * Math.pow(1.4, alreadyBuilt);

        cost += this.modifierEffects.buildCost[type.categoryType].addedCost;
        cost += this.modifierEffects.buildCost["global"].addedCost;

        cost *= this.modifierEffects.buildCost[type.categoryType].multiplier;
        cost *= this.modifierEffects.buildCost["global"].multiplier;

        cost *= Math.pow(1.4, alreadyBuilt);

        if (cost < baseCost * 0.2) {
            cost = baseCost * 0.2;
        }

        return Math.round(cost);
    };
    Player.prototype.getCellBuyCost = function (cell) {
        var base = cell.landValue * Math.pow(1.1, this.ownedCellsAmount);
        var adjusted = base;

        adjusted += this.modifierEffects.buyCost["global"].addedCost;
        adjusted *= this.modifierEffects.buyCost["global"].multiplier;

        if (adjusted < base * 0.2) {
            adjusted = base * 0.2;
        }

        return adjusted;
    };
    Player.prototype.addExperience = function (amount) {
        this.experience += amount;

        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    };
    Player.prototype.levelUp = function (callSize) {
        if (typeof callSize === "undefined") { callSize = 0; }
        this.level++;
        this.setExperienceToNextLevel();
        this.unlockLevelUpModifiers(this.level);
        this.updateDynamicModifiers("level");

        if (this.experience >= this.experienceToNextLevel) {
            if (callSize > 101) {
                throw new Error();
                return;
            }
            this.levelUp(callSize++);
        }
    };
    Player.prototype.getExperienceForLevel = function (level) {
        if (level <= 0)
            return 0;
        else {
            return Math.round(100 * Math.pow(1.12, level - 1));
        }
    };
    Player.prototype.setExperienceToNextLevel = function () {
        this.experienceForCurrentLevel = this.experienceToNextLevel;
        this.experienceToNextLevel += this.getExperienceForLevel(this.level);
    };
    Player.prototype.getExperiencePercentage = function () {
        var current = this.experience - this.experienceForCurrentLevel;

        return Math.floor(100 * (current / this.getExperienceForLevel(this.level)));
    };
    Player.prototype.getModifiedProfit = function (initialAmount, type, baseMultiplier, includeGlobal) {
        if (typeof includeGlobal === "undefined") { includeGlobal = true; }
        var amount = initialAmount;
        var baseMultiplier = baseMultiplier || 1;

        if (includeGlobal) {
            amount += this.modifierEffects.profit["global"].addedProfit * baseMultiplier;
        }

        if (type) {
            if (this.modifierEffects.profit[type]) {
                amount += this.modifierEffects.profit[type].addedProfit * baseMultiplier;
                if (amount > 0) {
                    amount *= this.modifierEffects.profit[type].multiplier;
                }
            }
        }
        if (includeGlobal && amount > 0) {
            amount *= this.modifierEffects.profit["global"].multiplier;
        }

        if (initialAmount > 0 && amount < 0)
            amount = 0;

        return amount;
    };
    Player.prototype.getIndexedProfit = function (type, amount, baseMultiplier) {
        if (!this.indexedProfits[type])
            this.indexedProfits[type] = {};

        if (!this.indexedProfits[type][amount]) {
            this.indexedProfits[type][amount] = this.getModifiedProfit(amount, type, baseMultiplier);
        }

        return this.indexedProfits[type][amount];
    };
    Player.prototype.getIndexedProfitWithoutGlobals = function (type, amount) {
        if (!this.indexedProfitsWithoutGlobals[type])
            this.indexedProfitsWithoutGlobals[type] = {};

        if (!this.indexedProfitsWithoutGlobals[type][amount]) {
            this.indexedProfitsWithoutGlobals[type][amount] = this.getModifiedProfit(amount, type, 1, false);
        }

        return this.indexedProfitsWithoutGlobals[type][amount];
    };
    Player.prototype.clearIndexedProfits = function () {
        this.indexedProfits = {};
        this.indexedProfitsWithoutGlobals = {};
    };
    Player.prototype.getUnlockConditionVariable = function (conditionType) {
        if (["clicks", "money", "level", "prestige"].indexOf(conditionType) !== -1) {
            return this[conditionType];
        } else if (this.amountBuiltPerType[conditionType] !== undefined) {
            return this.amountBuiltPerType[conditionType];
        } else if (this.amountBuiltPerCategory[conditionType] !== undefined) {
            return this.amountBuiltPerCategory[conditionType];
        }
    };
    Player.prototype.checkIfUnlocked = function (modifier) {
        if (!modifier.unlockConditions)
            return false;

        var unlocked = true;

        for (var i = 0; i < modifier.unlockConditions.length; i++) {
            var condition = modifier.unlockConditions[i];

            var toCheckAgainst = this.getUnlockConditionVariable(condition.type);

            if (toCheckAgainst < condition.value)
                unlocked = false;
        }
        return unlocked;
    };
    Player.prototype.setInitialAvailableModifiers = function () {
        var allModifiers = playerModifiers.allModifiers;
        this.lockedModifiers = allModifiers.slice(0);
        this.unlockedModifiers = [];

        for (var i = 0; i < this.lockedModifiers.length; i++) {
            var mod = this.lockedModifiers[i];

            if (this.checkIfUnlocked(mod)) {
                this.unlockModifier(mod);
            }
        }
    };
    Player.prototype.checkLockedModifiers = function (conditionType, timeout) {
        if (typeof timeout === "undefined") { timeout = 1000; }
        var unlocks = playerModifiers.modifiersByUnlock[conditionType];
        if (!unlocks)
            return;

        if (this.recentlyCheckedUnlockConditions[conditionType]) {
            return;
        } else if (timeout > 0) {
            this.recentlyCheckedUnlockConditions[conditionType] = true;
            window.setTimeout(function () {
                this.recentlyCheckedUnlockConditions[conditionType] = false;
            }.bind(this), timeout);
        }

        var unlockValues = Object.keys(unlocks);

        for (var i = 0; i < unlockValues.length; i++) {
            var toCheckAgainst = this.getUnlockConditionVariable(conditionType);

            if (toCheckAgainst >= parseInt(unlockValues[i])) {
                var modifiers = unlocks[unlockValues[i]];
                for (var j = 0; j < modifiers.length; j++) {
                    if (this.modifiers[modifiers[j].type])
                        continue;
                    else if (this.unlockedModifiers.indexOf(modifiers[j]) > -1)
                        continue;

                    var unlocked = this.checkIfUnlocked(modifiers[j]);

                    if (unlocked) {
                        this.unlockModifier(modifiers[j]);
                    }
                }
            }
        }
    };
    Player.prototype.unlockModifier = function (modifier) {
        if (!this.modifiers[modifier.type] && this.unlockedModifiers.indexOf(modifier) <= -1) {
            this.unlockedModifiers.push(modifier);
        }

        var index = this.lockedModifiers.indexOf(modifier);
        if (index > -1)
            this.lockedModifiers.splice(index, 1);
    };
    Player.prototype.updateDynamicModifiers = function (conditionType) {
        for (var _mod in this.dynamicModifiers[conditionType]) {
            var dynamicEffect = this.dynamicModifiers[conditionType][_mod];
            dynamicEffect.call(null, this);
        }
    };
    Player.prototype.addClicks = function (amount) {
        this.clicks += amount;
        this.checkLockedModifiers("clicks");
    };
    Player.prototype.unlockLevelUpModifiers = function (level) {
        var self = this;
        if (!levelUpModifiers.modifiersByUnlock.level[level])
            return;

        var modifiersForThisLevel = levelUpModifiers.modifiersByUnlock.level[level].slice(0);

        if (this.levelsAlreadyPicked[level])
            return;

        modifiersForThisLevel = modifiersForThisLevel.filter(function (mod) {
            if (self.levelUpModifiers[mod.type])
                return false;
            else
                return (self.checkIfUnlocked(mod));
        });

        var toUnlock = [];

        if (modifiersForThisLevel.length <= this.levelUpModifiersPerLevelUp) {
            for (var _mod in modifiersForThisLevel) {
                toUnlock.push(modifiersForThisLevel[_mod]);
            }
        } else {
            for (var i = 0; i < this.levelUpModifiersPerLevelUp; i++) {
                if (modifiersForThisLevel.length < 1)
                    break;

                var indexToAdd = randInt(0, modifiersForThisLevel.length - 1);
                var toAdd = modifiersForThisLevel.splice(indexToAdd, 1);

                toUnlock.push(toAdd[0]);
            }
        }

        if (toUnlock.length < 1) {
            this.unlockedLevelUpModifiers[level] = null;
            delete this.unlockedLevelUpModifiers[level];

            return;
        }

        this.unlockedLevelUpModifiers[level] = toUnlock;
    };
    Player.prototype.addLevelUpModifier = function (modifier, preventMultiplePerLevel, firstTime) {
        if (typeof preventMultiplePerLevel === "undefined") { preventMultiplePerLevel = true; }
        if (typeof firstTime === "undefined") { firstTime = true; }
        var level = modifier.unlockConditions[0].value;

        if (preventMultiplePerLevel && this.levelsAlreadyPicked[level])
            return false;

        this.addModifier(modifier, "levelUpModifiers", firstTime);

        if (preventMultiplePerLevel) {
            this.unlockedLevelUpModifiers[level] = null;
            delete this.unlockedLevelUpModifiers[level];

            this.levelsAlreadyPicked[level] = true;
        }
    };
    Player.prototype.applyPermedModifiers = function (firstTime) {
        if (typeof firstTime === "undefined") { firstTime = true; }
        for (var i = 0; i < this.permanentLevelupUpgrades.length; i++) {
            var modType = this.permanentLevelupUpgrades[i];

            var modifier = levelUpModifiers[modType];

            this.addLevelUpModifier(modifier, false, firstTime);
        }
    };
    Player.prototype.getPrestige = function (exp) {
        return Math.pow(exp / 1000000, 0.7);
    };
    Player.prototype.applyPrestige = function () {
        this.prestige = this.getPrestige(this.totalResetExperience);

        this.updateDynamicModifiers("prestige");
    };
    Player.prototype.addToRollingIncome = function (amount, date) {
        if (date.day !== this.lastRollingIncomeDay) {
            this.lastRollingIncomeDay = date.day;
            this.rollingIncome = this.rollingIncome.slice(1, 3);
            this.rollingIncome.push(0);
        }
        this.rollingIncome[this.rollingIncome.length - 1] += amount;
    };
    return Player;
})();
//# sourceMappingURL=player.js.map

/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/utility.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spriteblinker.d.ts" />
///
/// <reference path="../data/js/cg.d.ts" />
var actions;
(function (actions) {
    var blinkerTODO = new Blinker(600, 0x880055, -1, false);

    function buyCell(props) {
        // TODO circular reference
        var _ = window;
        var game = _.game;

        var cell = game.getCell(props);
        var player = game.players[props.playerId];

        if (!cell || !player)
            throw new Error();

        var employee = player.employees[props.employeeId];
        var data = cloneObject(props);

        if (data.finishedOn === undefined) {
            data.time = getActionTime([employee.skills["negotiation"]], 14).approximate;
        }

        var price = player.getCellBuyCost(cell);
        price = getActionCost([employee.skills["negotiation"]], price).actual;

        var blinkerId = blinkerTODO.idGenerator++;

        var onStartFN = function () {
            employee.active = false;
            employee.currAction = "buyCell";
            player.subtractCost(price);
            player.ownedCellsAmount++;
        };
        var onCompleteFN = function () {
            employee.active = true;
            employee.currAction = undefined;
            employee.trainSkill("negotiation");
            player.ownedCellsAmount--;
            player.addCell(cell);

            blinkerTODO.removeCells(blinkerId);
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });
            return true;
        };

        var startBlinkFN = function () {
            blinkerTODO.addCells([cell], null, blinkerId);
            blinkerTODO.start();

            window.setTimeout(onCompleteFN, 2400);
        };

        onStartFN.call(null);

        eventManager.dispatchEvent({
            type: "delayedAction",
            content: {
                type: "buyCell",
                data: data,
                onComplete: startBlinkFN
            }
        });
    }
    actions.buyCell = buyCell;
    ;

    function recruitEmployee(props) {
        // TODO circular reference
        var _ = window;
        var game = _.game;

        var player = game.players[props.playerId];
        if (!player)
            throw new Error("No player with that id found");
        var employee = player.employees[props.employeeId];

        var data = cloneObject(props);
        if (data.finishedOn === undefined) {
            data.time = getActionTime([employee.skills["recruitment"]], 14).approximate;
        }

        var onStartFN = function () {
            employee.active = false;
            employee.currentAction = "recruit";
        };

        var employeeCount = getSkillAdjust([employee.skills["recruitment"]], 4, function employeeCountAdjustFN(avgSkill) {
            return 1 / (1.5 / Math.log(avgSkill + 1));
        }, 0.33);

        if (!employee.player)
            throw new Error("No player on employee");
        var adjustedSkill = employee.skills["recruitment"] * employee.player.modifierEffects.recruitQuality;

        var recruitCompleteFN = function () {
            employee.active = true;
            employee.currentAction = undefined;
            employee.trainSkill("recruitment");

            var newEmployees = makeNewEmployees(employeeCount.actual, adjustedSkill);
            eventManager.dispatchEvent({
                type: "makeRecruitCompletePopup",
                content: {
                    player: player,
                    employees: newEmployees,
                    text: [
                        employee.name + " was able to scout the following people.",
                        "Which one should we recruit?"],
                    recruitingEmployee: employee
                }
            });
        };

        onStartFN.call(null);

        eventManager.dispatchEvent({
            type: "delayedAction",
            content: {
                type: "recruitEmployee",
                data: data,
                onComplete: recruitCompleteFN
            }
        });
    }
    actions.recruitEmployee = recruitEmployee;

    function constructBuilding(props) {
        // TODO circular reference
        var _ = window;
        var game = _.game;

        var cell = game.getCell(props);
        var player = game.players[props.playerId];

        if (!cell || !player)
            throw new Error();

        var employee = player.employees[props.employeeId];
        var buildingType = findType(props.buildingType);

        var data = cloneObject(props);
        if (data.finishedOn === undefined) {
            data.time = getActionTime([employee.skills["construction"]], buildingType.buildTime).approximate;
        }

        var baseCost = player.getBuildCost(buildingType);
        var adjustedCost = getActionCost([employee.skills["construction"]], baseCost).actual;

        if (player.money < adjustedCost)
            return;

        var size = buildingType.size || [1, 1];
        var endX = cell.gridPos[0] + size[0] - 1;
        var endY = cell.gridPos[1] + size[1] - 1;

        var buildArea = cell.board.getCells(rectSelect(cell.gridPos, [endX, endY]));

        var blinkerId = blinkerTODO.idGenerator++;

        var onStartFN = function () {
            for (var i = 0; i < buildArea.length; i++) {
                buildArea[i].changeContent(cg.content.underConstruction, true);
            }

            player.subtractCost(adjustedCost);
            employee.active = false;
            employee.currentAction = "constructBuilding";

            player.amountBuiltPerType[buildingType.type]++;
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });
        };
        var constructBuildingCompleteFN = function () {
            employee.active = true;
            employee.currentAction = undefined;
            employee.trainSkill("construction");
            player.amountBuiltPerType[buildingType.type]--;
            cell.changeContent(buildingType, true, player);

            blinkerTODO.removeCells(blinkerId);
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });

            return true;
        };

        var startBlinkFN = function () {
            blinkerTODO.addCells(buildArea, null, blinkerId);
            blinkerTODO.start();

            window.setTimeout(constructBuildingCompleteFN, 2400);
        };

        onStartFN.call(null);

        eventManager.dispatchEvent({
            type: "delayedAction",
            content: {
                type: "constructBuilding",
                data: data,
                onComplete: startBlinkFN
            }
        });
    }
    actions.constructBuilding = constructBuilding;

    function getSkillAdjust(skills, base, adjustFN, variance) {
        var avgSkill = skills.reduce(function (a, b) {
            return a + b;
        }) / skills.length;
        var workRate = adjustFN ? adjustFN(avgSkill) : Math.pow(1 - 0.166904 * Math.log(avgSkill), 1 / 2.5);

        var approximate = Math.round(base * workRate);
        var actual = Math.round(approximate + randRange(-base * variance, base * variance));

        return ({
            approximate: approximate,
            actual: actual < 1 ? 1 : actual
        });
    }
    function getActionTime(skills, base) {
        return getSkillAdjust(skills, base, null, 0.25);
    }
    actions.getActionTime = getActionTime;

    function getActionCost(skills, base) {
        return getSkillAdjust(skills, base, null, 0);
    }
    actions.getActionCost = getActionCost;
})(actions || (actions = {}));
//# sourceMappingURL=actions.js.map

/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/timer.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* @class SystemsManager
* @classdesc
*
* @param    tickTime       {number}
*
* @property systems     List of systems registered with this
* @property timer
* @property tickTime    Amount of time for single tick in ms
* @property tickNumber  Counter for total ticks so far
* @property accumulated Amount of time banked towards next tick
*
*/
var SystemsManager = (function () {
    function SystemsManager(tickTime) {
        this.systems = {};
        this.tickNumber = 0;
        this.accumulated = 0;
        this.paused = false;
        this.speed = 1;
        this.timer = new Strawb.Timer();
        this.tickTime = tickTime / 1000;

        this.init();
    }
    SystemsManager.prototype.init = function () {
        this.addEventListeners();
    };
    SystemsManager.prototype.addSystem = function (name, system) {
        this.systems[name] = system;
    };
    SystemsManager.prototype.addEventListeners = function () {
        var self = this;
        var slider = document.getElementById("speed-control");

        eventManager.addEventListener("togglePause", function (event) {
            self.togglePause();
        });
        eventManager.addEventListener("incrementSpeed", function (event) {
            self.setSpeed(self.speed + 1);
        });
        eventManager.addEventListener("decrementSpeed", function (event) {
            self.setSpeed(self.speed - 1);
        });

        slider.addEventListener("change", function (event) {
            if (slider.value === "0") {
                self.pause();
            } else {
                self.setSpeed(parseInt(slider.value));
            }
        });
    };
    SystemsManager.prototype.pause = function () {
        this.speedBeforePausing = this.speed;
        this.speed = 0;
        this.timer.stop();
        this.paused = true;
        var slider = document.getElementById("speed-control");
        slider.value = "0";
    };
    SystemsManager.prototype.unPause = function (newSpeed) {
        this.timer.start();
        this.paused = false;

        if (newSpeed)
            this.setSpeed(newSpeed);
    };
    SystemsManager.prototype.togglePause = function () {
        if (this.paused)
            this.unPause(this.speedBeforePausing);
        else
            this.pause();
    };
    SystemsManager.prototype.setSpeed = function (speed) {
        var slider = document.getElementById("speed-control");
        if (speed <= 0) {
            this.pause();
            return;
        } else if (speed > parseInt(slider.max))
            return;

        if (this.paused)
            this.unPause();

        var speed = this.speed = Math.round(speed);
        var adjustedSpeed = Math.pow(speed, 2);

        this.tickTime = 1 / adjustedSpeed;
        this.accumulated = this.accumulated / adjustedSpeed;
        slider.value = "" + speed;
    };
    SystemsManager.prototype.update = function () {
        if (this.paused)
            return;
        this.accumulated += this.timer.getDelta();
        while (this.accumulated >= this.tickTime) {
            this.tick();
        }
    };
    SystemsManager.prototype.tick = function () {
        this.accumulated -= this.tickTime;
        this.tickNumber++;
        for (var system in this.systems) {
            this.systems[system].tick(this.tickNumber);
        }
    };
    return SystemsManager;
})();

var System = (function () {
    function System(activationRate, currTick) {
        this.activationRate = activationRate;
        this.updateTicks(currTick);

        if (activationRate < 1) {
            console.warn("<1 activationRate on system", this);
        }
    }
    System.prototype.activate = function (any) {
    };

    System.prototype.updateTicks = function (currTick) {
        this.lastTick = currTick;
        this.nextTick = currTick + this.activationRate;
    };

    System.prototype.tick = function (currTick) {
        if (currTick >= this.nextTick) {
            // do something
            this.activate(currTick);

            this.updateTicks(currTick);
        }
    };
    return System;
})();

var ProfitSystem = (function (_super) {
    __extends(ProfitSystem, _super);
    function ProfitSystem(activationRate, systemsManager, players, targetTypes) {
        _super.call(this, activationRate, systemsManager.tickNumber);
        this.systemsManager = systemsManager;
        this.players = players;
        this.targetTypes = targetTypes;
    }
    ProfitSystem.prototype.activate = function () {
        var currentDate = this.systemsManager.systems.date.getDate();
        for (var _player in this.players) {
            var player = this.players[_player];

            for (var ii = 0; ii < this.targetTypes.length; ii++) {
                var profitPerThisType = 0;
                var targets = player.ownedContent[this.targetTypes[ii]];

                if (targets.length < 1)
                    continue;

                for (var jj = 0; jj < targets.length; jj++) {
                    var profit = targets[jj].modifiedProfit;

                    // content isn't removed in place
                    // which means the array here is the pre-splicing ver
                    // which probably makes this whole system pointless
                    //
                    // but this check means it doesn't fall apart at least
                    if (isFinite(profit))
                        profitPerThisType += profit;
                }
                player.addMoney(profitPerThisType, this.targetTypes[ii], targets.length, currentDate);
            }
        }
    };
    return ProfitSystem;
})(System);

var DateSystem = (function (_super) {
    __extends(DateSystem, _super);
    function DateSystem(activationRate, systemsManager, dateElem, startDate) {
        _super.call(this, activationRate, systemsManager.tickNumber);
        this.year = startDate ? startDate.year : 2000;
        this.month = startDate ? startDate.month : 1;
        this.day = startDate ? startDate.day : 1;

        this.dateElem = dateElem;

        this.updateDate();
    }
    DateSystem.prototype.activate = function () {
        this.incrementDate();
    };
    DateSystem.prototype.incrementDate = function () {
        this.day++;

        this.fireCallbacks(this.onDayChange, this.day);

        this.calculateDate();
    };
    DateSystem.prototype.calculateDate = function () {
        if (this.day > 30) {
            this.day -= 30;
            this.month++;

            this.fireCallbacks(this.onMonthChange, this.month);
        }
        if (this.month > 12) {
            this.month -= 12;
            this.year++;

            this.fireCallbacks(this.onYearChange, this.year);
        }
        if (this.day > 30 || this.month > 12) {
            this.calculateDate();
        } else {
            this.updateDate();
        }
    };

    DateSystem.prototype.fireCallbacks = function (targets, date) {
        if (!targets)
            return;
        for (var i = 0; i < targets.length; i++) {
            targets[i].call(date);
        }
    };

    DateSystem.prototype.getDate = function () {
        var dateObj = {
            year: this.year,
            month: this.month,
            day: this.day
        };
        return dateObj;
    };
    DateSystem.prototype.setDate = function (newDate) {
        this.year = newDate.year;
        this.month = newDate.month;
        this.day = newDate.day;

        this.updateDate();
    };
    DateSystem.prototype.toString = function () {
        return "" + this.day + "." + this.month + "." + this.year;
    };
    DateSystem.prototype.updateDate = function () {
        this.dateElem.innerHTML = this.toString();
    };
    return DateSystem;
})(System);

var DelayedActionSystem = (function (_super) {
    __extends(DelayedActionSystem, _super);
    function DelayedActionSystem(activationRate, systemsManager) {
        _super.call(this, activationRate, systemsManager.tickNumber);
        this.callbacks = {};
        this.systemsManager = systemsManager;
        this.addEventListeners();
    }
    DelayedActionSystem.prototype.addEventListeners = function () {
        var self = this;
        eventManager.addEventListener("delayedAction", function (event) {
            var action = event.content;
            action.data.finishedOn = action.data.finishedOn || self.lastTick + action.data.time;

            self.addAction(action);
        });
    };

    DelayedActionSystem.prototype.addAction = function (action) {
        if (!this.callbacks[action.data.finishedOn]) {
            this.callbacks[action.data.finishedOn] = [];
        }
        this.callbacks[action.data.finishedOn].push(action);
    };

    DelayedActionSystem.prototype.activate = function (currTick) {
        if (this.callbacks[currTick]) {
            for (var i = 0; i < this.callbacks[currTick].length; i++) {
                this.callbacks[currTick][i].onComplete.call();
            }
            this.callbacks[currTick] = null;
            delete this.callbacks[currTick];
        }
    };

    DelayedActionSystem.prototype.reset = function () {
        this.callbacks = {};
    };
    return DelayedActionSystem;
})(System);

// This is a seperate system, because even though it should be easier
// with just setinterval theres some weird scope fuckery where blurred
// tabs keep calling the function with outdated values
var AutosaveSystem = (function (_super) {
    __extends(AutosaveSystem, _super);
    function AutosaveSystem(activationRate, systemsManager) {
        _super.call(this, activationRate, systemsManager.tickNumber);
        this.systemsManager = systemsManager;
    }
    AutosaveSystem.prototype.activate = function (currTick) {
        eventManager.dispatchEvent({ type: "autosave", content: "" });
    };
    return AutosaveSystem;
})(System);
//# sourceMappingURL=systems.js.map

/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/utility.d.ts" />

var Loader = (function () {
    function Loader(game) {
        this.loaded = {
            fonts: true,
            //fonts: false,
            sprites: false,
            dom: false
        };
        var self = this;
        this.game = game;
        document.addEventListener('DOMContentLoaded', function () {
            self.loaded.dom = true;

            //info
            addClickAndTouchEventListener(document.getElementById("show-info"), function () {
                var _elStyle = document.getElementById("info-container").style;
                if (_elStyle.display === "flex") {
                    _elStyle.display = "none";
                } else {
                    _elStyle.display = "flex";
                }
            });
            addClickAndTouchEventListener(document.getElementById("close-info"), function () {
                document.getElementById("info-container").style.display = "none";
            });

            self.checkLoaded();
        });

        //PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
        this.startTime = window.performance ? window.performance.now() : Date.now();

        this.loadFonts();
        this.loadSprites();
    }
    Loader.prototype.loadFonts = function () {
        // TODO
        return;
        var self = this;
        WebFontConfig = {
            google: {
                families: ['Snippet']
            },
            active: function () {
                self.loaded.fonts = true;
                self.checkLoaded();
            }
        };
        (function () {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = true;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        })();
    };
    Loader.prototype.loadSprites = function () {
        var self = this;
        var loader = new PIXI.JsonLoader("img\/sprites.json");
        loader.addEventListener("loaded", function (event) {
            self.spriteImages = spritesheetToImages(event.content.json, event.content.baseUrl);
            self.loaded.sprites = true;
            self.checkLoaded();
        });

        loader.load();
    };

    Loader.prototype.checkLoaded = function () {
        for (var prop in this.loaded) {
            if (!this.loaded[prop]) {
                return;
            }
        }
        this.game.frameImages = this.spriteImages;
        this.game.init();
        var finishTime = window.performance ? window.performance.now() : Date.now();
        var elapsed = finishTime - this.startTime;
        console.log("loaded in " + Math.round(elapsed) + " ms");
    };
    return Loader;
})();
//# sourceMappingURL=loader.js.map

/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />
///
/// <reference path="reactui/js/reactui.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
/// <reference path="../data/js/names.d.ts" />
/// <reference path="../data/js/playermodifiers.d.ts" />
///
/// <reference path="js/ui.d.ts" />
/// <reference path="js/loader.d.ts" />
///
/// <reference path="js/sorteddisplaycontainer.d.ts" />
/// <reference path="js/player.d.ts" />F
/// <reference path="js/systems.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spritehighlighter.d.ts" />
/// <reference path="js/keyboardinput.d.ts" />
/// <reference path="js/mapgeneration.d.ts" />
/// <reference path="js/board.d.ts" />
///
/// <reference path="js/options.d.ts" />
///
/// <reference path="js/landvalueoverlay.d.ts" />
///
/// <reference path="js/utility.d.ts" />
/// <reference path="js/arraylogic.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SCREEN_WIDTH = 720, SCREEN_HEIGHT = 480, TILE_WIDTH = 64, TILE_HEIGHT = 32, TILES = 32, WORLD_WIDTH = TILES * TILE_WIDTH, WORLD_HEIGHT = TILES * TILE_HEIGHT, ZOOM_LEVELS = [1], AMT_OF_BOARDS = 1;

var idGenerator = idGenerator || {};
idGenerator.content = 0;
idGenerator.player = 0;

var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(template, frameIndex) {
        var frame = isFinite(frameIndex) ? template.frame[frameIndex] : template.frame;

        var _texture = PIXI.Texture.fromFrame(frame);
        _super.call(this, _texture); //pixi caches and reuses the texture as needed

        this.type = template.type;
        this.anchor = arrayToPoint(template.anchor);

        if (template.interactive === true) {
            this.interactive = true;
            this.hitArea = arrayToPolygon(template.hitArea);
        }
    }
    return Sprite;
})(PIXI.Sprite);

var GroundSprite = (function (_super) {
    __extends(GroundSprite, _super);
    function GroundSprite(type, cell) {
        this.cell = cell;
        _super.call(this, type);
    }
    return GroundSprite;
})(Sprite);

var ContentSprite = (function (_super) {
    __extends(ContentSprite, _super);
    function ContentSprite(type, content, frameIndex) {
        this.content = content;
        _super.call(this, type, frameIndex);
    }
    return ContentSprite;
})(Sprite);

var Content = (function () {
    function Content(props) {
        this.sprites = [];
        this.baseProfit = 0;
        this.modifiers = {};
        this.modifiedProfit = 0;
        this.cells = props.cells;

        var minX, minY;
        for (var i = 0; i < this.cells.length; i++) {
            var pos = this.cells[i].gridPos;

            if (minY === undefined || pos[1] <= minY) {
                minY = pos[1];

                if (minX === undefined || pos[0] < minX) {
                    minX = pos[0];
                }
            }
        }

        // highest point arbitrarily assigned as root
        this.baseCell = this.cells[0].board.getCell([minX, minY]);
        this.size = props.type.size || [1, 1];

        var type = this.type = props.type;
        this.id = props.id || idGenerator.content++;

        this.baseType = type["baseType"] || undefined;
        this.categoryType = type["categoryType"] || undefined;
        this.flags = type["flags"] ? type["flags"].slice(0) : [];
        this.flags.push(this.baseType, this.categoryType);

        this.baseProfit = type.baseProfit || undefined;

        if (props.player) {
            props.player.addContent(this);
        }
        this.init(type, props.layer);
    }
    Content.prototype.init = function (type, layer) {
        if (typeof layer === "undefined") { layer = "content"; }
        for (var i = 0; i < this.cells.length; i++) {
            var _cell = this.cells[i];
            var _s = new ContentSprite(type, this, i);
            this.sprites.push(_s);

            _s.position = _cell.board.getCell(_cell.gridPos).sprite.position.clone();

            _cell.board.addSpriteToLayer(layer, _s, _cell.gridPos);
        }
    };
    Content.prototype.applyModifiers = function () {
        var totals = {
            addedProfit: this.baseProfit,
            multiplier: 1
        };
        for (var _modifier in this.modifiers) {
            var modifier = this.modifiers[_modifier];
            if (!isFinite(modifier.strength) || modifier.strength <= 0) {
                this.modifiers[_modifier] = null;
                delete this.modifiers[_modifier];
            } else {
                for (var prop in modifier.effect) {
                    totals[prop] += modifier.scaling(modifier.strength) * modifier.effect[prop];
                }
            }
        }
        this.modifiedProfit = totals.addedProfit * totals.multiplier;
    };
    Content.prototype.remove = function () {
        if (this.player) {
            this.player.removeContent(this);
        }
        if (this.type.effects) {
            this.baseCell.removeAllPropagatedModifiers(this.type.translatedEffects);
        }

        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].content = undefined;
            this.cells[i].board.removeSpriteFromLayer("content", this.sprites[i], this.cells[i].gridPos);
        }
    };
    return Content;
})();

var Cell = (function () {
    function Cell(gridPos, type, board, autoInit) {
        if (typeof autoInit === "undefined") { autoInit = true; }
        this.modifiers = {};
        this.landValueModifiers = {};
        this.overlay = undefined;
        this.gridPos = gridPos;
        this.type = type;
        var distanceFromXCenter = Math.abs((board.width - 1) / 2 - gridPos[0]);
        var distanceFromYCenter = Math.abs((board.height - 1) / 2 - gridPos[1]);
        var meanDistance = (distanceFromYCenter + distanceFromXCenter) / 2;
        var maxDist = (board.width - 1 + board.height - 1) / 2;

        var relativeInverseDist = 1 - (meanDistance / maxDist);

        var baseVal = board.population / 4;

        this.baseLandValue = this.landValue = Math.round(baseVal + baseVal * relativeInverseDist * 0.5);

        this.board = board;
        this.flags = this.type["flags"].slice(0);

        if (autoInit)
            this.init();
    }
    Cell.prototype.init = function () {
        var _s = this.sprite = new GroundSprite(this.type, this);
        _s.position = arrayToPoint(getIsoCoord(this.gridPos[0], this.gridPos[1], TILE_WIDTH, TILE_HEIGHT, [WORLD_WIDTH / 2, TILE_HEIGHT]));
        this.board.addSpriteToLayer("ground", _s);

        if (this.type.effects) {
            this.propagateAllModifiers(this.type.translatedEffects);
        }
    };
    Cell.prototype.getScreenPos = function (container) {
        var wt = container.worldTransform;
        var zoom = wt.a;
        var offset = [wt.tx + WORLD_WIDTH / 2 * zoom, wt.ty + TILE_HEIGHT / 2 * zoom];

        return getIsoCoord(this.gridPos[0], this.gridPos[1], TILE_WIDTH * zoom, TILE_HEIGHT * zoom, offset);
    };
    Cell.prototype.getNeighbors = function (diagonal) {
        if (typeof diagonal === "undefined") { diagonal = false; }
        if (diagonal) {
            if (!this.neighborsWithDiagonals) {
                this.neighborsWithDiagonals = getNeighbors(this.board.cells, this.gridPos, diagonal);
            }
            return this.neighborsWithDiagonals;
        } else {
            if (!this.neighbors) {
                this.neighbors = getNeighbors(this.board.cells, this.gridPos, diagonal);
            }
            return this.neighbors;
        }
    };
    Cell.prototype.getArea = function (_props) {
        var props = Object.create(_props);

        props.targetArray = this.board.cells;
        props.start = this.gridPos;

        return getArea(props);
    };
    Cell.prototype.getDistances = function (radius, centerSize) {
        if (typeof centerSize === "undefined") { centerSize = [1, 1]; }
        var centerEnd = [
            this.gridPos[0] + centerSize[0] - 1,
            this.gridPos[1] + centerSize[1] - 1];
        var center = this.board.getCells(rectSelect(this.gridPos, centerEnd));

        return getDistanceFromCell(this.board.cells, center, radius, true);
    };
    Cell.prototype.replace = function (type) {
        var _oldType = this.type;
        var _texture = type["frame"];
        this.sprite.setTexture(PIXI.Texture.fromFrame(_texture));
        this.sprite.type = this.type = type;
        this.flags = type["flags"].slice(0);
        if (this.content && this.content.baseType === "plant") {
            this.addPlant();
        } else if (this.content) {
            if (!this.checkBuildable(this.content.type, null, false)) {
                this.changeContent("none");
            } else {
                this.changeContent(this.content.type, false, this.content.player);
            }
        }

        if (_oldType.effects) {
            this.removeAllPropagatedModifiers(_oldType.translatedEffects);
        }
        if (type.effects) {
            this.propagateAllModifiers(type.translatedEffects);
        }
    };
    Cell.prototype.changeUndergroundContent = function (type, update) {
        if (typeof update === "undefined") { update = true; }
        if (this.undergroundContent) {
            this.board.removeSpriteFromLayer("undergroundContent", this.undergroundContent.sprites[0], this.gridPos);
            this.undergroundContent = undefined;
        }

        if (type) {
            this.undergroundContent = new Content({
                cells: [this],
                type: type,
                layer: "undergroundContent"
            });
        }

        if (update) {
            getTubeConnections(this, 1);
        }
    };
    Cell.prototype.changeContent = function (type, update, player, checkPlayer) {
        if (typeof update === "undefined") { update = true; }
        if (typeof checkPlayer === "undefined") { checkPlayer = true; }
        var coversMultipleTiles = (type.size && (type.size[0] > 1 || type.size[1] > 1));

        var buildArea;
        if (coversMultipleTiles) {
            var endX = this.gridPos[0] + type.size[0] - 1;
            var endY = this.gridPos[1] + type.size[1] - 1;

            buildArea = this.board.getCells(rectSelect(this.gridPos, [endX, endY]));
        } else {
            buildArea = [this];
        }

        /*
        var buildable = true; //this.checkBuildable(type);
        for (var i = 0; i < buildArea.length; i++)
        {
        if ( !buildArea[i].checkBuildable(type) )
        {
        buildable = false;
        break;
        }
        }*/
        var _checkPlayer = checkPlayer ? player : null;
        var buildable = this.checkBuildable(type, _checkPlayer);

        if (coversMultipleTiles && buildArea.length !== type.size[0] * type.size[1])
            buildable = false;

        var toAdd = (type !== "none" && buildable !== false);
        var toRemove = (type === "none" || toAdd);

        if (toRemove) {
            for (var i = 0; i < buildArea.length; i++) {
                buildArea[i].removeContent();
            }
        }

        if (toAdd) {
            this.addContent(type, buildArea, player);
        }
        if (update) {
            for (var i = 0; i < buildArea.length; i++) {
                buildArea[i].updateCell();
            }
        }
    };
    Cell.prototype.checkBuildable = function (type, player, checkContent) {
        if (typeof checkContent === "undefined") { checkContent = true; }
        if (type === "none")
            return true;

        var buildArea;

        if (type.size && (type.size[0] > 1 || type.size[1] > 1)) {
            var endX = this.gridPos[0] + type.size[0] - 1;
            var endY = this.gridPos[1] + type.size[1] - 1;

            if (endX >= this.board.width || endY >= this.board.height)
                return false;

            buildArea = this.board.getCells(rectSelect(this.gridPos, [endX, endY]));
        } else {
            buildArea = [this];
        }

        var buildAreaIsValid = true;
        for (var i = 0; i < buildArea.length; i++) {
            var a = checkCell(buildArea[i], type, player);
            if (!a) {
                buildAreaIsValid = false;
                break;
            }
        }
        return buildAreaIsValid;

        function checkCell(cell, type, player) {
            // implicitly true
            var canBuild = true;

            // check ownership if needed
            if (player) {
                if (!cell.player || cell.player.id !== player.id) {
                    return false;
                }
            }

            // check invalid
            if (type.canNotBuildOn) {
                // check if any flags in cell conflict with type.canNotBuildOn
                canBuild = arrayLogic.not(cell.flags, type.canNotBuildOn);

                // same with content
                if (checkContent && canBuild !== false && cell.content) {
                    canBuild = arrayLogic.not(cell.content.flags, type.canNotBuildOn);
                }
            }

            if (canBuild === false) {
                return false;
            } else {
                var valid = true;

                if (type.canBuildOn) {
                    valid = arrayLogic.or(cell.flags, type.canBuildOn);
                    if (checkContent && !valid && cell.content) {
                        valid = arrayLogic.or(cell.content.flags, type.canBuildOn);
                    }
                }
                return valid;
            }
        }
    };
    Cell.prototype.addPlant = function () {
        var type = this.type["type"];
        var plants = cg["content"]["plants"][type];

        this.changeContent(getRandomProperty(plants));
    };
    Cell.prototype.updateCell = function () {
        getRoadConnections(this, 1);
    };
    Cell.prototype.addContent = function (type, cells, player) {
        var _c = new Content({
            cells: cells,
            type: type,
            player: player
        });
        for (var i = 0; i < cells.length; i++) {
            cells[i].content = _c;
            cells[i].applyModifiersToContent();
        }

        if (type.effects) {
            this.propagateAllModifiers(type.translatedEffects);
        }

        // todo
        if (type.underground) {
            for (var i = 0; i < cells.length; i++) {
                cells[i].changeUndergroundContent(cg.content.tubes[type.underground]);
            }
        }

        return this.content;
    };
    Cell.prototype.removeContent = function () {
        if (this.content === undefined) {
            return;
        } else
            this.content.remove();
    };
    Cell.prototype.checkIfModifierApplies = function (modifier) {
        if (this.content && (arrayLogic.or(modifier.targets, this.flags) || (this.content && arrayLogic.or(modifier.targets, this.content.flags)))) {
            return true;
        } else {
            return false;
        }
    };
    Cell.prototype.getModifierPolarity = function (modifier) {
        if (!this.content)
            return null;

        if (arrayLogic.or(modifier.targets, this.content.flags)) {
            var firstProp = modifier.effect[Object.keys(modifier.effect)[0]];
            return firstProp > 0;
        }

        return null;
    };
    Cell.prototype.addModifier = function (modifier, source) {
        if (!this.modifiers[modifier.type]) {
            this.modifiers[modifier.type] = Object.create(modifier);
            this.modifiers[modifier.type].sources = [];
        } else {
            this.modifiers[modifier.type].strength += modifier.strength;
        }
        ;
        this.modifiers[modifier.type].sources.push(source);

        // check to see if modifiers need to be updated
        if (this.checkIfModifierApplies) {
            this.applyModifiersToContent();
        }
    };
    Cell.prototype.removeModifier = function (modifier, source) {
        if (!this.modifiers[modifier.type])
            return;
        this.modifiers[modifier.type].strength -= modifier.strength;
        this.modifiers[modifier.type].sources = this.modifiers[modifier.type].sources.filter(function (_source) {
            return _source !== source;
        });
        if (this.modifiers[modifier.type].strength <= 0) {
            delete this.modifiers[modifier.type];
        }

        if (this.checkIfModifierApplies) {
            this.applyModifiersToContent();
        }
    };
    Cell.prototype.propagateModifier = function (modifier) {
        var effectedCells = this.getArea({
            size: modifier.range,
            centerSize: modifier.center,
            excludeStart: true
        });

        for (var cell in effectedCells) {
            if (effectedCells[cell] !== this) {
                effectedCells[cell].addModifier(modifier, this);
            }
        }
        if (modifier.landValue)
            this.propagateLandValueModifier(modifier);
    };
    Cell.prototype.propagateAllModifiers = function (modifiers) {
        for (var i = 0; i < modifiers.length; i++) {
            this.propagateModifier(modifiers[i]);
        }
    };
    Cell.prototype.removePropagatedModifier = function (modifier) {
        var effectedCells = this.getArea({
            size: modifier.range,
            centerSize: modifier.center,
            excludeStart: true
        });

        for (var cell in effectedCells) {
            effectedCells[cell].removeModifier(modifier, this);
        }
        if (modifier.landValue)
            this.removePropagatedLandValueModifier(modifier);
    };
    Cell.prototype.removeAllPropagatedModifiers = function (modifiers) {
        for (var i = 0; i < modifiers.length; i++) {
            this.removePropagatedModifier(modifiers[i]);
        }
    };

    // todo: rework later to only update modifiers that have changed
    Cell.prototype.getValidModifiers = function (contentType) {
        if (typeof contentType === "undefined") { contentType = this.content.type; }
        if (!contentType)
            return;
        var flags = [contentType.baseType, contentType.categoryType];

        var validModifiers = {};
        for (var modifierType in this.modifiers) {
            var modifier = this.modifiers[modifierType];
            if (arrayLogic.or(modifier.targets, this.flags) || (arrayLogic.or(modifier.targets, flags))) {
                validModifiers[modifierType] = modifier;
            }
        }

        return validModifiers;
    };
    Cell.prototype.applyModifiersToContent = function () {
        if (!this.content)
            return;

        var modifiersToApply = this.getValidModifiers();

        this.content.modifiers = this.content.modifiers || {};
        for (var _mod in modifiersToApply) {
            var modifier = modifiersToApply[_mod];

            if (!this.content.modifiers[_mod] || this.content.modifiers[_mod].strength < modifier.strength) {
                this.content.modifiers[_mod] = modifier;
            }
        }

        this.content.applyModifiers();
    };
    Cell.prototype.propagateLandValueModifier = function (modifier) {
        var effectedCells = this.getDistances(modifier.landValue.radius, modifier.center);

        var strengthIndexes = {};

        for (var _cell in effectedCells) {
            var invertedDistance = effectedCells[_cell].invertedDistance;
            var distance = effectedCells[_cell].distance;
            var strength;
            if (modifier.landValue.falloffFN) {
                if (!strengthIndexes[distance]) {
                    strengthIndexes[distance] = modifier.landValue.falloffFN(distance, invertedDistance, effectedCells[_cell].invertedDistanceRatio);
                }
                strength = strengthIndexes[distance];
            } else
                strength = invertedDistance;

            var cell = effectedCells[_cell].item;

            if (cell.landValueModifiers[modifier.type] === undefined) {
                cell.landValueModifiers[modifier.type] = {};

                cell.landValueModifiers[modifier.type].strength = 0;
                if (modifier.landValue.scalingFN) {
                    cell.landValueModifiers[modifier.type].scalingFN = modifier.landValue.scalingFN;
                }
                cell.landValueModifiers[modifier.type].effect = {};
                if (modifier.landValue.multiplier) {
                    cell.landValueModifiers[modifier.type].effect.multiplier = modifier.landValue.multiplier;
                }
                if (modifier.landValue.addedValue) {
                    cell.landValueModifiers[modifier.type].effect.addedValue = modifier.landValue.addedValue;
                }
            }

            cell.landValueModifiers[modifier.type].strength += strength;

            cell.updateLandValue();
        }
        if (game.activeBoard && game.activeBoard.id === this.board.id) {
            eventManager.dispatchEvent({ type: "updateLandValueMapmode", content: "" });
        }
    };
    Cell.prototype.removePropagatedLandValueModifier = function (modifier) {
        var effectedCells = this.getDistances(modifier.landValue.radius, modifier.center);

        var strengthIndexes = {};

        for (var _cell in effectedCells) {
            var cell = effectedCells[_cell].item;

            if (!cell.landValueModifiers[modifier.type])
                continue;

            var invertedDistance = effectedCells[_cell].invertedDistance;
            var distance = effectedCells[_cell].distance;
            var strength;
            if (modifier.landValue.falloffFN) {
                if (!strengthIndexes[invertedDistance]) {
                    strengthIndexes[invertedDistance] = modifier.landValue.falloffFN(distance, invertedDistance, effectedCells[_cell].invertedDistanceRatio);
                }
                strength = strengthIndexes[invertedDistance];
            } else
                strength = invertedDistance;

            cell.landValueModifiers[modifier.type].strength -= strength;

            if (cell.landValueModifiers[modifier.type].strength <= 0) {
                delete cell.landValueModifiers[modifier.type];
            }

            cell.updateLandValue();
        }
        if (game.activeBoard && game.activeBoard.id === this.board.id) {
            eventManager.dispatchEvent({ type: "updateLandValueMapmode", content: "" });
        }
    };
    Cell.prototype.updateLandValue = function () {
        if (this.type.type === "water") {
            this.landValue = 0;
            return;
        }
        ;
        var totals = {
            addedValue: 0,
            multiplier: 1
        };
        for (var _modifier in this.landValueModifiers) {
            var modifier = this.landValueModifiers[_modifier];

            var strength;
            if (modifier.scalingFN) {
                strength = modifier.scalingFN(modifier.strength);
            } else {
                strength = modifier.strength;
            }

            for (var prop in modifier.effect) {
                totals[prop] += modifier.effect[prop] * strength;
            }
        }

        this.landValue = Math.round((this.baseLandValue + totals.addedValue) * totals.multiplier);

        if (this.landValue < this.baseLandValue * 0.8) {
            this.landValue = Math.round(this.baseLandValue * 0.8);
        }
    };
    Cell.prototype.addOverlay = function (color, depth) {
        if (typeof depth === "undefined") { depth = 1; }
        if (this.overlay) {
            this.board.removeSpriteFromLayer("cellOverlay", this.overlay, this.gridPos);
        }

        var neighbors = this.getNeighbors();
        var hitArea = this.type.hitArea;
        var linesToDraw = {
            n: true,
            e: true,
            s: true,
            w: true
        };
        for (var _dir in neighbors) {
            var neighborCell = neighbors[_dir];
            if (neighborCell !== undefined) {
                if (neighborCell.overlay && neighborCell.overlayColor === color) {
                    linesToDraw[_dir] = false;
                }
            }
        }

        var poly = this.type.hitArea;

        // loop back
        poly.push(poly[0]);

        var gfx = new PIXI.Graphics();
        gfx.lineStyle(3, color, 0.6);

        gfx.moveTo(poly[0][0], poly[0][1]);
        var nextIndex = 1;

        for (var _dir in linesToDraw) {
            var nextPoint = poly[nextIndex];

            if (linesToDraw[_dir] === true) {
                gfx.lineTo(nextPoint[0], nextPoint[1]);
            } else {
                gfx.moveTo(nextPoint[0], nextPoint[1]);
            }

            nextIndex++;
        }

        gfx.position = this.sprite.position.clone();
        this.board.addSpriteToLayer("cellOverlay", gfx, this.gridPos);

        this.overlay = gfx;
        this.overlayColor = color;

        var willUpdateNeighbors = false;

        if (depth > 0) {
            for (var _dir in linesToDraw) {
                if (linesToDraw[_dir] === false) {
                    willUpdateNeighbors = true;
                    neighbors[_dir].addOverlay(color, depth - 1);
                }
            }
        }

        if (willUpdateNeighbors === false) {
            game.updateWorld();
        }
    };
    Cell.prototype.removeOverlay = function () {
        this.board.removeSpriteFromLayer("cellOverlay", this.overlay, this.gridPos);
        this.overlay = null;
        this.overlayColor = null;

        var neighs = this.getNeighbors();
        for (var neigh in neighs) {
            if (neighs[neigh] && neighs[neigh].overlay) {
                neighs[neigh].addOverlay(neighs[neigh].overlayColor);
            }
        }
    };
    return Cell;
})();

var WorldRenderer = (function () {
    function WorldRenderer(width, height) {
        this.layers = {};
        this.zoomLevel = ZOOM_LEVELS[0];
        this.mapmodes = {
            default: {
                layers: [
                    { type: "ground" },
                    { type: "cellOverlay" },
                    { type: "content" }
                ]
            },
            landValue: {
                layers: [
                    { type: "ground" },
                    { type: "landValueOverlay", alpha: 0.7 },
                    { type: "cellOverlay" },
                    { type: "content" }
                ]
            },
            underground: {
                layers: [
                    { type: "underground" },
                    { type: "undergroundContent" },
                    { type: "ground", alpha: 0.15 }
                ],
                properties: {
                    offsetY: 32
                }
            }
        };
        this.currentMapmode = "default";
        this.initContainers(width, height);
        this.initLayers();
        this.addEventListeners();
    }
    WorldRenderer.prototype.addEventListeners = function () {
        var self = this;
        eventManager.addEventListener("changeZoomLevel", function (event) {
            self.changeZoomLevel(event.content.zoomLevel);
        });
        eventManager.addEventListener("updateWorld", function (event) {
            self.render(event.content.clear);
        });

        var mapmodeSelect = document.getElementById("mapmode-select");
        mapmodeSelect.addEventListener("change", function (event) {
            self.setMapmode(mapmodeSelect.value);
        });

        eventManager.addEventListener("changeMapmode", function (event) {
            self.setMapmode(event.content);
            mapmodeSelect.value = event.content;
        });
        eventManager.addEventListener("updateLandValueMapmode", function (event) {
            if (self.currentMapmode !== "landValue")
                return;

            var zoomLayer = self.layers["zoom" + self.zoomLevel];
            zoomLayer.landValueOverlay = makeLandValueOverlay(game.activeBoard);
            self.changeMapmode("landValue");
        });
    };
    WorldRenderer.prototype.initContainers = function (width, height) {
        this.renderTexture = new PIXI.RenderTexture(width, height, game.renderer, PIXI.scaleModes.NEAREST);

        var _ws = this.worldSprite = new PIXI.Sprite(this.renderTexture);

        _ws.hitArea = arrayToPolygon(rectToIso(_ws.width, _ws.height));
        _ws.interactive = true;

        for (var i = 0; i < ZOOM_LEVELS.length; i++) {
            var zoomStr = "zoom" + ZOOM_LEVELS[i];
            var zoomLayer = this.layers[zoomStr] = {};
            this.mapmodes[zoomStr] = {};

            var main = zoomLayer["main"] = new PIXI.DisplayObjectContainer();
        }

        var self = this;
        _ws.mousedown = _ws.touchstart = function (event) {
            game.mouseEventHandler.mouseDown(event, "world");
        };
        _ws.mousemove = _ws.touchmove = function (event) {
            game.mouseEventHandler.mouseMove(event, "world");
        };

        _ws.mouseup = _ws.touchend = function (event) {
            game.mouseEventHandler.mouseUp(event, "world");
        };
        _ws.mouseupoutside = _ws.touchendoutside = function (event) {
            game.mouseEventHandler.mouseUp(event, "world");
        };
    };
    WorldRenderer.prototype.initLayers = function () {
        for (var i = 0; i < ZOOM_LEVELS.length; i++) {
            var zoomStr = "zoom" + ZOOM_LEVELS[i];
            var zoomLayer = this.layers[zoomStr];
            var main = zoomLayer["main"];

            zoomLayer["underground"] = new PIXI.DisplayObjectContainer();
            zoomLayer["undergroundContent"] = new PIXI.DisplayObjectContainer();
            zoomLayer["ground"] = new PIXI.DisplayObjectContainer();
            zoomLayer["landValueOverlay"] = new PIXI.DisplayObjectContainer();
            zoomLayer["cellOverlay"] = new PIXI.DisplayObjectContainer();
            zoomLayer["content"] = new PIXI.DisplayObjectContainer();
        }
    };
    WorldRenderer.prototype.clearLayers = function () {
        for (var i = 0; i < ZOOM_LEVELS.length; i++) {
            var zoomStr = "zoom" + ZOOM_LEVELS[i];
            var zoomLayer = this.layers[zoomStr];
            var main = zoomLayer["main"];

            for (var layer in zoomLayer) {
                if (zoomLayer[layer].children.length > 0) {
                    zoomLayer[layer].removeChildren();
                }
            }

            if (main.children.length > 0)
                main.removeChildren();
        }
        //this.currentMapmode = undefined;
    };
    WorldRenderer.prototype.setBoard = function (board) {
        this.clearLayers();

        for (var zoomLevel in board.layers) {
            for (var layer in board.layers[zoomLevel]) {
                this.layers[zoomLevel][layer].addChild(board.layers[zoomLevel][layer]);
            }
        }

        this.setMapmode(this.currentMapmode);
    };
    WorldRenderer.prototype.changeZoomLevel = function (level) {
        this.zoomLevel = level;
        this.render();
    };
    WorldRenderer.prototype.setMapmode = function (newMapmode) {
        var zoomLayer = this.layers["zoom" + this.zoomLevel];
        switch (newMapmode) {
            case "default":
            case "terrain": {
                this.changeMapmode("default");
                return;
            }
            case "landValue": {
                zoomLayer.landValueOverlay = makeLandValueOverlay(game.activeBoard);

                this.changeMapmode("landValue");
                return;
            }
            case "underground": {
                if (zoomLayer.underground.children <= 0) {
                    for (var i = 0; i < zoomLayer.ground.children[0].children.length; i++) {
                        var currSprite = zoomLayer.ground.children[0].children[i];

                        var _s = PIXI.Sprite.fromFrame("underground.png");
                        _s.position = currSprite.position.clone();
                        _s.anchor = currSprite.anchor.clone();
                        zoomLayer.underground.addChild(_s);
                    }
                }
                this.changeMapmode("underground");
                return;
            }
        }
    };
    WorldRenderer.prototype.changeMapmode = function (newMapmode) {
        var zoomStr = "zoom" + this.zoomLevel;
        var zoomLayer = this.layers[zoomStr];

        if (zoomLayer.main.children.length > 0) {
            zoomLayer.main.removeChildren();
        }

        for (var i = 0; i < this.mapmodes[newMapmode].layers.length; i++) {
            var layerToAdd = this.mapmodes[newMapmode].layers[i];
            zoomLayer.main.addChild(zoomLayer[layerToAdd.type]);

            zoomLayer[layerToAdd.type].alpha = layerToAdd.alpha || 1;
        }

        var props = this.mapmodes[newMapmode].properties || {};

        this.worldSprite.y = props.offsetY || 0;

        this.currentMapmode = newMapmode;
        this.render();
    };
    WorldRenderer.prototype.render = function (clear) {
        if (typeof clear === "undefined") { clear = true; }
        var zoomStr = "zoom" + this.zoomLevel;
        var activeMainLayer = this.layers[zoomStr]["main"];
        this.renderTexture.render(activeMainLayer, null, clear);
    };
    return WorldRenderer;
})();

var Game = (function () {
    function Game() {
        this.boards = [];
        this.tools = {};
        this.layers = {};
        this.players = {};
        this.toolCache = {};
        this.editModes = [];
    }
    Game.prototype.init = function () {
        this.resize();

        this.initContainers();
        this.initTools();
        this.bindElements();
        this.loadOptions();

        for (var i = 0; i < AMT_OF_BOARDS; i++) {
            this.boards.push(new Board({ width: TILES }));
        }
        this.changeActiveBoard(0);
        this.updateBoardSelect();

        this.highlighter = new Highlighter();

        this.mouseEventHandler = new MouseEventHandler();
        this.mouseEventHandler.scroller = new Scroller(this.layers["main"], 0.5);

        this.keyboardEventHandler = new KeyboardEventHandler();

        this.uiDrawer = new UIDrawer();

        this.systemsManager = new SystemsManager(1000);
        var id = "player" + (idGenerator.player++);
        var player = new Player(id);

        //player.addMoney(100, "initial");
        this.reactUI = new ReactUI(player, this.frameImages);
        this.players[player.id] = player;

        // TODO have content types register themselves
        var dailyProfitSystem = new ProfitSystem(1, this.systemsManager, this.players, ["fastfood", "shopping", "parking", "factory", "hotel", "apartment", "office"]);
        this.systemsManager.addSystem("dailyProfitSystem", dailyProfitSystem);

        /*
        var monthlyProfitSystem = new ProfitSystem(30, this.systemsManager, this.players,
        ["apartment"]);
        var quarterlyProfitSystem = new ProfitSystem(90, this.systemsManager, this.players,
        ["office"]);
        this.systemsManager.addSystem("monthlyProfitSystem", monthlyProfitSystem);
        this.systemsManager.addSystem("quarterlyProfitSystem", quarterlyProfitSystem);
        */
        this.systemsManager.addSystem("delayedAction", new DelayedActionSystem(1, this.systemsManager));
        this.systemsManager.addSystem("autosave", new AutosaveSystem(60, this.systemsManager));

        var dateSystem = new DateSystem(1, this.systemsManager, document.getElementById("date"));
        this.systemsManager.addSystem("date", dateSystem);

        this.editModes = ["play", "edit-world"];
        this.switchEditingMode("play");

        eventManager.dispatchEvent({
            type: "changeMapmode",
            content: "landValue" });

        this.resize();
        this.render();
        this.updateWorld();

        window.setInterval(this.updateSystems.bind(this), 1000);
        /*
        game.uiDrawer.makeFadeyPopup(
        [SCREEN_WIDTH / 2, SCREEN_HEIGHT/2],
        [0, 0],
        5000,
        new PIXI.Text("ctrl+click to scroll\nshift+click to zoom",{
        font: "bold 50px Arial",
        fill: "#222222",
        align: "center"
        }),
        TWEEN.Easing.Quartic.In
        );*/
    };
    Game.prototype.initContainers = function () {
        var _stage = this.stage = new PIXI.Stage(0xFFFFFF);
        var _renderer = this.renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, null, false, true);

        var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
        _main.position.set(SCREEN_WIDTH / 2 - WORLD_WIDTH / 2, SCREEN_HEIGHT / 2 - WORLD_HEIGHT / 2);
        _stage.addChild(_main);

        var _tooltips = this.layers["tooltips"] = new PIXI.DisplayObjectContainer();
        _stage.addChild(_tooltips);

        this.worldRenderer = new WorldRenderer(WORLD_WIDTH, WORLD_HEIGHT);
        _main.addChild(this.worldRenderer.worldSprite);

        var _game = this;

        _stage.mousedown = _stage.touchstart = function (event) {
            _game.mouseEventHandler.mouseDown(event, "stage");
        };
        _stage.mousemove = _stage.touchmove = function (event) {
            _game.mouseEventHandler.mouseMove(event, "stage");
        };
        _stage.mouseup = _stage.touchend = function (event) {
            _game.mouseEventHandler.mouseUp(event, "stage");
        };
        _stage.mouseupoutside = _stage.touchendoutside = function (event) {
            game.mouseEventHandler.mouseUp(event, "stage");
        };
    };
    Game.prototype.initTools = function () {
        this.tools.nothing = new NothingTool();

        this.tools.water = new WaterTool();
        this.tools.grass = new GrassTool();
        this.tools.sand = new SandTool();
        this.tools.snow = new SnowTool();
        this.tools.remove = new RemoveTool();
        this.tools.plant = new PlantTool();
        this.tools.house = new HouseTool();
        this.tools.road = new RoadTool();
        this.tools.subway = new SubwayTool();

        this.tools.click = new ClickTool();
        this.tools.buy = new BuyTool();
        this.tools.build = new BuildTool();
        this.tools.sell = new SellTool();
    };

    Game.prototype.bindElements = function () {
        var self = this;

        //zoom
        var zoomBtn = document.getElementById("zoomBtn");
        addClickAndTouchEventListener(zoomBtn, function () {
            var zoomAmount = document.getElementById("zoom-amount")["value"];
            game.mouseEventHandler.scroller.zoom(zoomAmount);
        });

        for (var toolName in this.tools) {
            var btn = document.getElementById("" + toolName + "Btn");
            (function addBtnFn(btn, toolName) {
                var tool = self.tools[toolName];
                var type = tool.type;

                if (tool.button === null) {
                    // added for toggling button, but can't be used to select tool
                    if (btn)
                        tool.button = btn;
                    return;
                } else
                    tool.button = btn;

                addClickAndTouchEventListener(btn, function () {
                    self.changeTool([type]);
                });
            })(btn, toolName);
        }

        //save & load
        var saveBtn = document.getElementById("saveBtn");
        var loadBtn = document.getElementById("loadBtn");

        var saveFN = function () {
            eventManager.dispatchEvent({
                type: "makeSavePopup", content: ""
            });
        };
        var loadFN = function () {
            eventManager.dispatchEvent({
                type: "makeLoadPopup", content: ""
            });
        };
        addClickAndTouchEventListener(saveBtn, saveFN);
        addClickAndTouchEventListener(loadBtn, loadFN);

        eventManager.addEventListener("saveGame", function (event) {
            self.save(event.content);
        });
        eventManager.addEventListener("loadGame", function (event) {
            self.load(event.content);
        });

        //recruit
        var recruitBtn = document.getElementById("recruitBtn");

        var recruitFN = function () {
            if (Object.keys(self.players["player0"].employees).length < 1) {
                // TODO
                if (false) {
                    eventManager.dispatchEvent({
                        type: "makeInfoPopup", content: {
                            text: [
                                "Already used initial recruitment.",
                                "Wait 5 seconds and try again (todo)"]
                        }
                    });
                } else {
                    self.players["player0"].usedInitialRecruit = true;
                    eventManager.dispatchEvent({
                        type: "makeRecruitCompletePopup", content: {
                            player: self.players["player0"],
                            employees: makeNewEmployees(randInt(4, 6), 2 * self.players["player0"].modifierEffects.recruitQuality),
                            delay: 0
                        }
                    });
                    window.setTimeout(function () {
                        self.players["player0"].usedInitialRecruit = false;
                    }, 5 * 1000);
                }
            } else {
                eventManager.dispatchEvent({
                    type: "makeRecruitPopup", content: {
                        player: self.players["player0"]
                    }
                });
            }
        };

        addClickAndTouchEventListener(recruitBtn, recruitFN);

        eventManager.addEventListener("recruit", recruitFN);

        //build
        var buildBtn = document.getElementById("buildBtn");

        var onBuildingSelect = function (selected, continuous) {
            self.tools.build.changeBuilding(selected, continuous);
            self.changeTool("build");
        };

        addClickAndTouchEventListener(buildBtn, function () {
            eventManager.dispatchEvent({
                type: "makeBuildingSelectPopup", content: {
                    player: self.players["player0"],
                    onOk: onBuildingSelect
                }
            });
        });

        eventManager.addEventListener("changeBuildingType", function (e) {
            onBuildingSelect(e.content.building, e.content.continuous);
        });

        eventManager.addEventListener("changeTool", function (e) {
            self.changeTool(e.content.type);
            if (e.content.continuous === false) {
                self.tools[e.content.type].continuous = false;
            } else
                self.tools[e.content.type].continuous = true;
        });

        //info
        // under loader.ts
        //stats
        addClickAndTouchEventListener(document.getElementById("show-stats"), function () {
            eventManager.dispatchEvent({ type: "toggleFullScreenPopup", content: "stats" });
        });

        //renderer
        this.bindRenderer();

        //resize
        window.addEventListener("resize", game.resize, false);

        eventManager.addEventListener("autosave", function (e) {
            self.autosave();
        });

        //edit mode select
        var editmodeSelect = document.getElementById("editmode-select");
        editmodeSelect.addEventListener("change", function (event) {
            self.switchEditingMode(editmodeSelect.value);
        });

        //regen world
        addClickAndTouchEventListener(document.getElementById("regen-world"), function () {
            var oldMapmode = game.worldRenderer.currentMapmode;
            self.resetLayers();
            self.activeBoard.destroy();
            self.boards[self.indexOfActiveBoard] = new Board({ width: TILES });

            self.changeActiveBoard(self.indexOfActiveBoard);

            eventManager.dispatchEvent({
                type: "changeMapmode",
                content: oldMapmode
            });
            eventManager.dispatchEvent({
                type: "updateWorld",
                content: ""
            });
            self.updateBoardSelect();
        });

        // board select
        var boardSelect = document.getElementById("board-select");
        boardSelect.addEventListener("change", function (event) {
            self.changeActiveBoard(parseInt(boardSelect.value));
        });

        // react side menu stuff
        eventManager.addEventListener("changeZoom", function (event) {
            self.mouseEventHandler.scroller.zoom(event.content);
        });

        // prestige
        eventManager.addEventListener("prestigeReset", function (event) {
            self.prestigeReset(event.content);
        });

        // options
        addClickAndTouchEventListener(document.getElementById("show-options"), function () {
            eventManager.dispatchEvent({ type: "toggleFullScreenPopup", content: "options" });
        });

        eventManager.addEventListener("saveOptions", self.saveOptions);
    };
    Game.prototype.bindRenderer = function () {
        var _canvas = document.getElementById("pixi-container");
        _canvas.appendChild(this.renderer.view);
        this.renderer.view.setAttribute("id", "pixi-canvas");
    };
    Game.prototype.updateBoardSelect = function () {
        var boardSelect = document.getElementById("board-select");
        var oldValue = boardSelect.value || "0";
        while (boardSelect.children.length > 0) {
            boardSelect.remove(0);
        }
        for (var i = 0; i < this.boards.length; i++) {
            var opt = document.createElement("option");
            opt.value = "" + i;
            opt.text = this.boards[i].name;

            boardSelect.add(opt);
        }
        boardSelect.value = oldValue;
    };
    Game.prototype.updateWorld = function (clear) {
        eventManager.dispatchEvent({ type: "updateWorld", content: { clear: clear } });
    };
    Game.prototype.resize = function () {
        var container = window.getComputedStyle(document.getElementById("pixi-container"), null);
        SCREEN_WIDTH = parseInt(container.width) / window.devicePixelRatio;
        SCREEN_HEIGHT = parseInt(container.height) / window.devicePixelRatio;
        if (game.renderer) {
            game.renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        }
        if (window.innerWidth <= 600) {
            eventManager.dispatchEvent({ type: "resizeSmaller", content: "" });
        } else if (window.innerWidth > 600) {
            eventManager.dispatchEvent({ type: "resizeBigger", content: "" });
        }
    };

    Game.prototype.changeTool = function (tool) {
        var oldTool = this.activeTool;
        this.activeTool = this.tools[tool];

        if (oldTool && oldTool.button) {
            oldTool.button.classList.toggle("selected-tool");
        }
        if (this.activeTool.button) {
            this.activeTool.button.classList.toggle("selected-tool");
        }

        if (this.activeTool.mapmode) {
            eventManager.dispatchEvent({
                type: "changeMapmode",
                content: this.activeTool.mapmode
            });
        }
    };
    Game.prototype.changeActiveBoard = function (index) {
        var oldBoard = this.activeBoard;

        this.activeBoard = this.boards[index];
        this.indexOfActiveBoard = index;

        this.worldRenderer.setBoard(this.activeBoard);
    };
    Game.prototype.destroyAllBoards = function () {
        for (var i = 0; i < this.boards.length; i++) {
            this.boards[i].destroy();
        }
    };
    Game.prototype.getCell = function (props) {
        var boardIndex = undefined;
        for (var i = 0; i < this.boards.length; i++) {
            if (this.boards[i].id == props.boardId) {
                boardIndex = i;
                break;
            }
        }
        if (boardIndex === undefined)
            throw new Error("No board found with id" + props.boardId);
        else {
            return this.boards[boardIndex].getCell(props.gridPos);
        }
    };
    Game.prototype.save = function (name) {
        var toSave = {
            player: this.savePlayer(this.players["player0"]),
            boards: this.saveBoards(this.boards),
            date: new Date(),
            gameDate: this.systemsManager.systems.date.getDate(),
            gameTick: this.systemsManager.tickNumber,
            pendingActions: this.saveActions(this.systemsManager.systems.delayedAction)
        };
        localStorage.setItem(name, JSON.stringify(toSave));
    };
    Game.prototype.autosave = function () {
        // TODO
        var autosaveLimit = Options.autosaveLimit;
        var autosaves = [];
        for (var saveGame in localStorage) {
            if (saveGame.match(/autosave/)) {
                autosaves.push(saveGame);
            }
        }
        autosaves.sort();
        autosaves = autosaves.slice(0, autosaveLimit - 1);
        for (var i = autosaves.length - 1; i >= 0; i--) {
            localStorage.setItem("autosave" + (i + 2), localStorage.getItem(autosaves[i]));
        }
        this.save("autosave");
    };
    Game.prototype.load = function (name) {
        var parsed = JSON.parse(localStorage.getItem(name));
        this.activeBoard = null;
        this.loadPlayer(parsed.player);
        this.loadBoards(parsed);
        this.loadActions(parsed.pendingActions);

        if (parsed.gameTick)
            this.systemsManager.tickNumber = parsed.gameTick;

        // legacy
        if (parsed.gameDate)
            this.systemsManager.systems.date.setDate(parsed.gameDate);
    };
    Game.prototype.saveBoards = function (boardsToSave) {
        var savedBoards = [];
        for (var k = 0; k < boardsToSave.length; k++) {
            var data = {};
            var board = boardsToSave[k];

            data.width = board.width;
            data.height = board.height;
            data.population = board.population;
            data.name = board.name;
            data.cells = [];
            data.id = board.id;

            var typeToKey = {};
            var keyGen = 0;

            for (var i = 0; i < board.cells.length; i++) {
                data.cells[i] = [];
                for (var j = 0; j < board.cells[i].length; j++) {
                    var boardCell = board.cells[i][j];
                    var cell = data.cells[i][j] = {};

                    if (!typeToKey[boardCell.type.type]) {
                        typeToKey[boardCell.type.type] = ++keyGen;
                    }
                    cell.type = typeToKey[boardCell.type.type];

                    if (boardCell.player) {
                        cell.player = boardCell.player.id;
                    }
                    if (boardCell.content && boardCell.content.baseCell === boardCell) {
                        var contentToAdd = boardCell.content.type.type;
                        if (boardCell.content.type.baseType === "road") {
                            contentToAdd = "road_nesw";
                        }

                        if (!typeToKey[contentToAdd]) {
                            typeToKey[contentToAdd] = ++keyGen;
                        }
                        cell.content = {
                            type: typeToKey[contentToAdd],
                            player: boardCell.content.player ? boardCell.content.player.id : null
                        };
                    }
                    if (boardCell.undergroundContent) {
                        cell.undergroundContent = true;
                    }
                }
            }
            data.key = (function () {
                var reverseIndex = {};
                for (var i = 0; i < Object.keys(typeToKey).length; i++) {
                    var prop = Object.keys(typeToKey)[i];
                    reverseIndex[typeToKey[prop]] = prop;
                }
                return reverseIndex;
            })();
        }
        savedBoards.push(data);

        return savedBoards;
    };
    Game.prototype.loadBoards = function (data) {
        this.resetLayers();
        this.destroyAllBoards();

        var boardsToLoad = [];
        var newBoards = [];
        var cachedBoardIndex = data.cachedBoardIndex || 0;

        // legacy
        if (data.board) {
            boardsToLoad.push(data.board);
        } else {
            boardsToLoad = data.boards;
        }
        if (boardsToLoad.length === 0)
            throw new Error("No boards to load");

        for (var k = 0; k < boardsToLoad.length; k++) {
            var currToLoad = boardsToLoad[k];
            var key = currToLoad.key;

            //legacy
            if (!key) {
                for (var i = 0; i < currToLoad.cells.length; i++) {
                    for (var j = 0; j < currToLoad.cells[i].length; j++) {
                        var cell = currToLoad.cells[i][j];
                        if (cell.player) {
                            cell.player = this.players[cell.player];
                            if (cell.content) {
                                cell.content.player = this.players[cell.content.player];
                            }
                        }
                    }
                }
            } else {
                for (var i = 0; i < currToLoad.cells.length; i++) {
                    for (var j = 0; j < currToLoad.cells[i].length; j++) {
                        var cell = currToLoad.cells[i][j];

                        cell.type = key[cell.type];

                        if (cell.content) {
                            cell.content.type = key[cell.content.type];
                        }
                        if (cell.player) {
                            cell.player = this.players[cell.player];
                            if (cell.content) {
                                cell.content.player = this.players[cell.content.player];
                            }
                        }
                    }
                }
            }

            var board = new Board({
                width: currToLoad.width,
                height: currToLoad.height,
                savedCells: currToLoad.cells,
                population: currToLoad.population
            });

            board.name = currToLoad.name || board.name;
            board.id = currToLoad.id || board.id;

            newBoards.push(board);
        }

        game.boards = newBoards;
        game.changeActiveBoard(cachedBoardIndex);

        eventManager.dispatchEvent({ type: "updateWorld", content: { clear: true } });
        this.updateBoardSelect();
    };

    Game.prototype.savePlayer = function (player) {
        var data = {};
        data.id = player.id;
        data.money = player.money;
        data.clicks = player.clicks;
        data.experience = player.experience;

        data.employees = {};
        for (var _e in player.employees) {
            data.employees[_e] = {};
            for (var prop in player.employees[_e]) {
                if (prop === "trait") {
                    if (player.employees[_e].trait) {
                        data.employees[_e].trait = player.employees[_e].trait.type;
                    }
                } else if (prop !== "player") {
                    data.employees[_e][prop] = player.employees[_e][prop];
                }
            }
        }
        data.modifiers = [];
        for (var _mod in player.modifiers) {
            data.modifiers.push(player.modifiers[_mod].type);
        }
        data.levelUpModifiers = [];
        for (var _mod in player.levelUpModifiers) {
            data.levelUpModifiers.push(player.levelUpModifiers[_mod].type);
        }
        data.levelsAlreadyPicked = player.levelsAlreadyPicked;

        data.prestige = {
            prestige: player.prestige,
            timesReset: player.timesReset,
            permanentLevelupUpgrades: player.permanentLevelupUpgrades,
            totalResetExperience: player.totalResetExperience
        };

        data.stats = {
            incomePerType: player.incomePerType
        };

        return data;
    };
    Game.prototype.loadPlayer = function (data) {
        var player = new Player(data.id);

        player.money = data.money;

        player.experience = data.experience || 0;
        player.clicks = data.clicks || 0;

        if (data.stats) {
            player.incomePerDate = data.stats.incomePerDate || {};
            player.incomePerType = data.stats.incomePerType || {};
        }

        for (var _mod in data.modifiers) {
            player.addModifier(playerModifiers[data.modifiers[_mod]], "modifiers", false);
        }
        for (var _mod in data.levelUpModifiers) {
            player.addLevelUpModifier(levelUpModifiers[data.levelUpModifiers[_mod]], false, false);
        }
        player.levelsAlreadyPicked = data.levelsAlreadyPicked || {};

        for (var employee in data.employees) {
            data.employees[employee] = new Employee(names, data.employees[employee]);

            player.addEmployee(data.employees[employee]);
        }

        if (data.prestige) {
            for (var prop in data.prestige) {
                player[prop] = data.prestige[prop];
            }
        }

        player.setInitialAvailableModifiers();
        player.applyPermedModifiers();
        player.applyPrestige();

        this.players["player0"] = player;
        this.reactUI.player = player;
        player.addExperience(0); // refresh
        player.updateElements();
    };
    Game.prototype.saveOptions = function () {
        localStorage.setItem("options", JSON.stringify(Options));
    };
    Game.prototype.loadOptions = function () {
        var parsed = JSON.parse(localStorage.getItem("options"));

        for (var _prop in parsed) {
            Options[_prop] = parsed[_prop];
        }
    };
    Game.prototype.saveActions = function (system) {
        var toSave = [];

        for (var _tick in system.callbacks) {
            var _actions = system.callbacks[_tick];
            for (var i = 0; i < _actions.length; i++) {
                toSave.push({
                    type: _actions[i].type,
                    data: _actions[i].data });
            }
        }

        return toSave;
    };
    Game.prototype.loadActions = function (toLoad) {
        game.systemsManager.systems.delayedAction.reset();
        if (!toLoad || toLoad.length < 1)
            return;
        for (var i = 0; i < toLoad.length; i++) {
            var currAction = toLoad[i];

            actions[currAction.type].call(null, currAction.data);
        }
    };
    Game.prototype.prestigeReset = function (onReset) {
        var player = this.players["player0"];

        if (player.level < 100)
            return;

        var resetWithSelectedModifier = function (toPerm) {
            var newPlayer = new Player(player.id);

            newPlayer.incomePerDate = Object.create(player.incomePerDate);
            newPlayer.incomePerType = Object.create(player.incomePerType);

            newPlayer.timesReset = player.timesReset + 1;
            newPlayer.totalResetExperience = player.totalResetExperience + player.experience;
            newPlayer.permanentLevelupUpgrades = player.permanentLevelupUpgrades.slice(0);
            if (toPerm)
                newPlayer.permanentLevelupUpgrades.push(toPerm.data.modifier.type);

            newPlayer.applyPermedModifiers();
            newPlayer.applyPrestige();

            newPlayer.setInitialAvailableModifiers();

            this.players[player.id] = newPlayer;
            this.reactUI.player = newPlayer;
            newPlayer.addExperience(0); // refresh
            newPlayer.updateElements();

            this.resetLayers();
            this.destroyAllBoards();

            var newBoards = [new Board({ width: TILES })];

            this.boards = newBoards;
            this.changeActiveBoard(0);

            eventManager.dispatchEvent({ type: "updateWorld", content: { clear: true } });
            this.updateBoardSelect();

            if (onReset)
                onReset.call();
            return true;
        }.bind(this);

        var modifiersAvailableToPerm = [];
        for (var _mod in player.levelUpModifiers) {
            var modifier = player.levelUpModifiers[_mod];
            if (player.permanentLevelupUpgrades.indexOf(modifier.type) < 0) {
                modifiersAvailableToPerm.push(modifier);
            }
        }
        var currPrestige = player.getPrestige(player.totalResetExperience);
        var newPrestige = player.getPrestige(player.experience + player.totalResetExperience);
        var prestigeGained = newPrestige - currPrestige;

        eventManager.dispatchEvent({
            type: "makeModifierPopup",
            content: {
                player: player,
                text: [
                    "Congratulations on reaching level 100!",
                    "You can start over from scratch in a new city",
                    "",
                    "You would gain an additional " + prestigeGained.toFixed(1) + " prestige",
                    "for a total of " + newPrestige.toFixed(1) + " prestige",
                    "You can also permanently unlock one of the following upgrades:"
                ],
                modifierList: modifiersAvailableToPerm,
                onOk: resetWithSelectedModifier,
                okBtnText: "Reset",
                excludeCost: true
            }
        });
    };
    Game.prototype.render = function () {
        this.renderer.render(this.stage);

        TWEEN.update();

        requestAnimFrame(this.render.bind(this));
    };
    Game.prototype.updateSystems = function () {
        this.systemsManager.update();
    };
    Game.prototype.resetLayers = function () {
        this.worldRenderer.clearLayers();
        this.worldRenderer.initLayers();
        this.worldRenderer.render();
    };
    Game.prototype.switchEditingMode = function (newMode) {
        if (newMode === this.currentMode)
            return;

        this.toolCache[this.currentMode] = this.activeTool ? this.activeTool.type : "nothing";

        if (!this.toolCache[newMode]) {
            this.changeTool("nothing");
        } else {
            this.changeTool(this.toolCache[newMode]);
        }
        for (var j = 0; j < this.editModes.length; j++) {
            var editMode = this.editModes[j];

            if (newMode !== editMode) {
                var toToggle = document.getElementsByClassName(editMode);
                for (var i = 0; i < toToggle.length; i++) {
                    toToggle[i].classList.add("hidden");
                }
            } else {
                var toToggle = document.getElementsByClassName(editMode);
                for (var i = 0; i < toToggle.length; i++) {
                    toToggle[i].classList.remove("hidden");
                }
            }
        }
        this.currentMode = newMode;
        var el = document.getElementById("editmode-select");
        el.value = newMode;
    };
    return Game;
})();

var Scroller = (function () {
    function Scroller(container, bound) {
        this.bounds = {};
        this.currZoom = 1;
        this.container = container;
        this.bounds.min = bound; // sets clamp limit to percentage of screen from 0.0 to 1.0
        this.bounds.max = Number((1 - bound).toFixed(1));
        this.setBounds();
        this.zoomField = document.getElementById("zoom-amount");
    }
    Scroller.prototype.startScroll = function (mousePos) {
        this.setBounds();
        this.startClick = mousePos;
        this.startPos = [this.container.position.x, this.container.position.y];
    };
    Scroller.prototype.end = function () {
        this.startPos = undefined;
    };
    Scroller.prototype.setBounds = function () {
        var rect = this.container.getLocalBounds();
        this.width = SCREEN_WIDTH;
        this.height = SCREEN_HEIGHT;
        this.bounds = {
            xMin: (this.width * this.bounds.min) - rect.width * this.container.scale.x,
            xMax: (this.width * this.bounds.max),
            yMin: (this.height * this.bounds.min) - rect.height * this.container.scale.y,
            yMax: (this.height * this.bounds.max),
            min: this.bounds.min,
            max: this.bounds.max
        };
    };
    Scroller.prototype.getDelta = function (currPos) {
        var x = this.startClick[0] - currPos[0];
        var y = this.startClick[1] - currPos[1];
        return [-x, -y];
    };
    Scroller.prototype.move = function (currPos) {
        var delta = this.getDelta(currPos);
        this.container.position.x = this.startPos[0] + delta[0];
        this.container.position.y = this.startPos[1] + delta[1];
        this.clampEdges();
    };
    Scroller.prototype.zoom = function (zoomAmount) {
        if (zoomAmount > 1) {
            //zoomAmount = 1;
        }

        var container = this.container;
        var oldZoom = this.currZoom;

        /*
        if (oldZoom <= 0.5 && zoomAmount > 0.5)
        {
        
        }
        else if ( oldZoom <= 1.5 && oldZoom >= 0.5)
        {
        if (zoomAmount < 0.5)
        else if (zoomAmount > 1.5)
        }
        else if (oldZoom >= 1.5 && zoomAmount < 1.5)
        {
        }*/
        var zoomDelta = oldZoom - zoomAmount;
        var rect = container.getLocalBounds();

        //var centerX = SCREEN_WIDTH / 2 - rect.width / 2 * zoomAmount;
        //var centerY = SCREEN_HEIGHT / 2 - rect.height / 2 * zoomAmount;
        //these 2 get position of screen center in relation to the container
        //0: far left 1: far right
        var xRatio = 1 - ((container.x - SCREEN_WIDTH / 2) / rect.width / oldZoom + 1);
        var yRatio = 1 - ((container.y - SCREEN_HEIGHT / 2) / rect.height / oldZoom + 1);

        var xDelta = rect.width * xRatio * zoomDelta;
        var yDelta = rect.height * yRatio * zoomDelta;
        container.position.x += xDelta;
        container.position.y += yDelta;
        container.scale.set(zoomAmount, zoomAmount);
        this.zoomField.value = this.currZoom = zoomAmount;

        eventManager.dispatchEvent({ type: "updateZoomValue", content: this.currZoom });
    };
    Scroller.prototype.deltaZoom = function (delta, scale) {
        if (delta === 0) {
            return;
        }

        //var scaledDelta = absDelta + scale / absDelta;
        var direction = delta < 0 ? "out" : "in";
        var adjDelta = 1 + Math.abs(delta) * scale;
        if (direction === "out") {
            this.zoom(this.currZoom / adjDelta);
        } else {
            this.zoom(this.currZoom * adjDelta);
        }
    };
    Scroller.prototype.clampEdges = function () {
        var x = this.container.position.x;
        var y = this.container.position.y;

        //horizontal
        //left edge
        if (x < this.bounds.xMin) {
            x = this.bounds.xMin;
        } else if (x > this.bounds.xMax) {
            x = this.bounds.xMax;
        }

        //vertical
        //top
        if (y < this.bounds.yMin) {
            y = this.bounds.yMin;
        } else if (y > this.bounds.yMax) {
            y = this.bounds.yMax;
        }

        this.container.position.set(x, y);
    };
    return Scroller;
})();

var MouseEventHandler = (function () {
    function MouseEventHandler() {
        this.preventingGhost = false;
        var self = this;

        this.currAction = undefined;
        window.oncontextmenu = function (event) {
            var eventTarget = event.target;
            if (eventTarget.localName !== "canvas")
                return;
            event.preventDefault();
            event.stopPropagation();
        };

        var _canvas = document.getElementById("pixi-container");
        _canvas.addEventListener("DOMMouseScroll", function (e) {
            if (e.target.localName !== "canvas")
                return;
            self.scroller.deltaZoom(-e.detail, 0.05);
            game.uiDrawer.clearAllObjects();
        });
        _canvas.addEventListener("mousewheel", function (e) {
            if (e.target.localName !== "canvas")
                return;
            self.scroller.deltaZoom(e.wheelDelta / 40, 0.05);
            game.uiDrawer.clearAllObjects();
        });
        _canvas.addEventListener("mouseout", function (e) {
            if (e.target.localName !== "canvas")
                return;
            game.uiDrawer.removeActive();
        });
    }
    MouseEventHandler.prototype.preventGhost = function (delay) {
        this.preventingGhost = true;
        var self = this;
        var timeout = window.setTimeout(function () {
            self.preventingGhost = false;
            window.clearTimeout(timeout);
        }, delay);
    };
    MouseEventHandler.prototype.mouseDown = function (event, targetType) {
        game.uiDrawer.removeActive();
        if (event.originalEvent.button === 2 && this.currAction !== undefined && targetType === "stage") {
            if (game.activeTool.onFinish) {
                game.activeTool.onFinish();
            }

            this.currAction = undefined;
            this.stashedAction = undefined;
            this.startPoint = undefined;
            this.scroller.end();
            game.uiDrawer.clearAllObjects();
            game.highlighter.clearSprites();
            game.updateWorld();
        } else if (event.originalEvent.ctrlKey || event.originalEvent.metaKey || (event.originalEvent.button === 1 || event.originalEvent.button === 2)) {
            this.startScroll(event);
        } else if (targetType === "world") {
            this.startCellAction(event);
        }
    };

    MouseEventHandler.prototype.mouseMove = function (event, targetType) {
        if (targetType === "stage" && (this.currAction === "zoom" || this.currAction === "scroll")) {
            this.stageMove(event);
        } else if (targetType === "world" && this.currAction === "cellAction") {
            this.worldMove(event);
        } else if (targetType === "world" && this.currAction === undefined) {
            this.hover(event);
        }
    };
    MouseEventHandler.prototype.mouseUp = function (event, targetType) {
        if (this.currAction === undefined)
            return;
        else if (targetType === "stage" && (this.currAction === "zoom" || this.currAction === "scroll")) {
            this.stageEnd(event);
            this.preventGhost(15);
        } else if (targetType === "world" && this.currAction === "cellAction" && event.originalEvent.button !== 2 && event.originalEvent.button !== 3) {
            if (!this.preventingGhost)
                this.worldEnd(event);
        }
    };

    MouseEventHandler.prototype.startScroll = function (event) {
        if (this.currAction === "cellAction")
            this.stashedAction = "cellAction";
        this.currAction = "scroll";
        this.startPoint = [event.global.x, event.global.y];
        this.scroller.startScroll(this.startPoint);
        game.uiDrawer.clearAllObjects();
    };
    MouseEventHandler.prototype.startZoom = function (event) {
        if (this.currAction === "cellAction")
            this.stashedAction = "cellAction";
        this.currAction = "zoom";
        this.startPoint = this.currPoint = [event.global.x, event.global.y];
        game.uiDrawer.clearAllObjects();
    };
    MouseEventHandler.prototype.stageMove = function (event) {
        if (this.currAction === "scroll") {
            this.scroller.move([event.global.x, event.global.y]);
        } else if (this.currAction === "zoom") {
            var delta = event.global.x + this.currPoint[1] - this.currPoint[0] - event.global.y;
            this.scroller.deltaZoom(delta, 0.005);
            this.currPoint = [event.global.x, event.global.y];
        }
    };
    MouseEventHandler.prototype.stageEnd = function (event) {
        if (this.currAction === "scroll") {
            this.scroller.end();
            this.startPoint = undefined;
            this.currAction = this.stashedAction;
            this.stashedAction = undefined;
        }
        if (this.currAction === "zoom") {
            this.startPoint = undefined;
            this.currAction = this.stashedAction;
            this.stashedAction = undefined;
        }
    };

    // need to switch to the click event being transferred to
    // rendertexture parent DOC and checked against individual sprites
    // (that have hit masks) to support slopes / variable height
    MouseEventHandler.prototype.startCellAction = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        if (event.originalEvent.shiftKey) {
            game.activeTool.tempContinuous = true;
        } else
            game.activeTool.tempContinuous = false;

        this.currAction = "cellAction";
        this.startCell = gridPos;
        this.currCell = gridPos;

        //this.selectedCells = [game.activeBoard.getCell(gridPos)];
        this.selectedCells = game.activeBoard.getCells(game.activeTool.selectType(this.startCell, this.currCell));

        game.highlighter.clearSprites();
        if (game.activeTool.tintColor !== null) {
            game.highlighter.tintCells(this.selectedCells, game.activeTool.tintColor);
        }
        if (game.activeTool.onHover) {
            game.uiDrawer.clearAllObjects();
            game.activeTool.onHover(this.selectedCells);
        }
        game.updateWorld();
    };
    MouseEventHandler.prototype.worldMove = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

        if (!this.currCell || gridPos[0] !== this.currCell[0] || gridPos[1] !== this.currCell[1]) {
            this.currCell = gridPos;

            this.selectedCells = game.activeBoard.getCells(game.activeTool.selectType(this.startCell, this.currCell));

            /*
            this.selectedCells = game.activeBoard.getCell(this.currCell).getArea(
            {
            size: 1,
            centerSize: [4, 5],
            excludeStart: true
            });*/
            game.highlighter.clearSprites();
            if (game.activeTool.onHover) {
                game.uiDrawer.clearAllObjects();
                game.activeTool.onHover(this.selectedCells);
            }
            if (game.activeTool.tintColor !== null) {
                game.highlighter.tintCells(this.selectedCells, game.activeTool.tintColor);
            }
            game.updateWorld();
        }
    };
    MouseEventHandler.prototype.worldEnd = function (event) {
        game.activeTool.activate(this.selectedCells);

        if (game.activeTool.onFinish) {
            game.activeTool.onFinish();
        }

        game.uiDrawer.clearAllObjects();
        game.highlighter.clearSprites();
        this.currAction = undefined;
        this.startCell = undefined;
        this.currCell = undefined;
        this.selectedCells = undefined;

        game.updateWorld(true);
    };
    MouseEventHandler.prototype.hover = function (event) {
        var pos = event.getLocalPosition(event.target);
        var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);
        var currCell = game.activeBoard.getCell(gridPos);

        // TEMPORARY
        if ((!gridPos) || (gridPos[0] >= TILES || gridPos[1] >= TILES) || (gridPos[0] < 0 || gridPos[1] < 0)) {
            game.uiDrawer.removeActive();
            return;
        }

        if (!this.hoverCell)
            this.hoverCell = gridPos;
        if (gridPos[0] !== this.hoverCell[0] || gridPos[1] !== this.hoverCell[1]) {
            this.hoverCell = gridPos;
            game.uiDrawer.removeActive();
            game.uiDrawer.clearAllObjects();
            game.uiDrawer.makeCellTooltip(event, currCell, event.target);
            game.uiDrawer.makeBuildingTipsForCell(currCell);
        }
    };
    return MouseEventHandler;
})();

var UIDrawer = (function () {
    function UIDrawer() {
        this.fonts = {};
        this.styles = {};
        this.textureCache = {};
        this.permanentUIObjects = [];
        this.layer = game.layers["tooltips"];
        this.init();
    }
    UIDrawer.prototype.init = function () {
        this.fonts = {
            base: {
                font: "16px Arial",
                fill: "#444444",
                align: "left"
            },
            black: {
                font: "bold 20pt Arial",
                fill: "#000000",
                align: "left"
            },
            green: {
                font: "bold 20pt Arial",
                fill: "#00FF00",
                stroke: "#005500",
                strokeThickness: 2,
                align: "left"
            },
            red: {
                font: "bold 20pt Arial",
                fill: "#FF0000",
                stroke: "#550000",
                strokeThickness: 2,
                align: "left"
            }
        };
        this.styles["base"] = {
            lineStyle: {
                width: 2,
                color: 0x587982,
                alpha: 1
            },
            fillStyle: {
                color: 0xE8FBFF,
                alpha: 0.8
            }
        };

        this.textureCache = {
            buildingPlacement: {
                positive1: PIXI.Texture.fromCanvas(new PIXI.Text("+", this.fonts["green"]).canvas),
                negative1: PIXI.Texture.fromCanvas(new PIXI.Text("-", this.fonts["red"]).canvas)
            }
        };
    };
    UIDrawer.prototype.removeActive = function () {
        if (this.active) {
            this.active.remove();
            this.active = undefined;
        }
    };
    UIDrawer.prototype.clearAllObjects = function () {
        for (var i = 0; i < this.permanentUIObjects.length; i++) {
            this.permanentUIObjects[i].remove();
        }
        this.permanentUIObjects = [];

        this.removeActive();
    };

    UIDrawer.prototype.makeCellTooltip = function (event, cell, container) {
        var screenPos = cell.getScreenPos(container);
        var cellX = screenPos[0];
        var cellY = screenPos[1];

        var screenX = event.global.x;
        var screenY = event.global.y;

        var text = cell.content ? cell.content.type.title || cell.content.type.type : cell.type["type"];

        if (game.worldRenderer.currentMapmode === "landValue") {
            text += "\nLand value: " + cell.landValue;
            text += "\nApproximate cost: " + parseInt(game.players.player0.getCellBuyCost(cell));
        }

        /*
        else
        {
        for (var modifier in cell.modifiers)
        {
        var _mod = cell.modifiers[modifier];
        text += "\n--------------\n";
        text += "Modifier: " + _mod.title + "\n";
        text += "Strength: " + _mod.strength + "\n";
        text += "Adj strength: " + _mod.scaling(_mod.strength).toFixed(3);
        }
        }*/
        if (cell.content && cell.content.player && cell.content.baseProfit) {
            var finalAmount = game.players.player0.getIndexedProfit(cell.content.type.categoryType, cell.content.modifiedProfit).toFixed(2);
            text += "\n--------------\n";
            text += "Base profit: " + cell.content.baseProfit.toFixed(2) + "/d" + "\n";
            text += "-------\n";
            for (var modifier in cell.content.modifiers) {
                var _mod = cell.content.modifiers[modifier];
                if (_mod.scaling(_mod.strength) > 0) {
                    text += "Modifier: " + _mod.title + " " + _mod.scaling(_mod.strength).toFixed(2) + "\n";
                }
            }
            if (Object.keys(cell.content.modifiers).length > 0)
                text += "-------\n";
            text += "Final profit: " + finalAmount + "/d";
        }

        var font = this.fonts["base"];

        var textObject = new PIXI.Text(text, font);

        var tipDir, tipPos;

        // change slant of the tip based on screen position
        // 100 pix buffer is arbitrary for now
        if (screenX + textObject.width + 100 > SCREEN_WIDTH) {
            tipDir = "left";
            tipPos = 0.75;
        } else {
            tipDir = "right";
            tipPos = 0.25;
        }

        // same for vertical pos
        var pointing = (screenY - textObject.height - 100 < 0) ? "up" : "down";

        var x = cellX;
        var y = (cell.content && pointing === "down") ? cellY - cell.content.sprites[0].height * cell.content.sprites[0].worldTransform.a / 2 : cellY;

        var uiObj = this.active = new UIObject(this.layer).delay(500).lifeTime(-1);

        var toolTip = makeToolTip({
            style: this.styles["base"],
            autoSize: true,
            tipPos: tipPos,
            tipWidth: 10,
            tipHeight: 20,
            tipDir: tipDir,
            pointing: pointing,
            padding: [10, 10]
        }, textObject);
        uiObj.position.set(Math.round(x), Math.round(y));

        uiObj.addChild(toolTip);
        uiObj.start();

        return uiObj;
    };
    UIDrawer.prototype.makeCellPopup = function (cell, text, container, fontName) {
        if (typeof fontName === "undefined") { fontName = "black"; }
        var pos = cell.getScreenPos(container);
        var content = new PIXI.Text(text, this.fonts[fontName]);

        this.makeFadeyPopup([pos[0], pos[1]], [0, -20], 2000, content);
    };
    UIDrawer.prototype.makeBuildingTipsForCell = function (baseCell) {
        if (!baseCell.content || !baseCell.content.player)
            return;
        this.makeBuildingTips(baseCell.content.cells, baseCell.content.type);
    };
    UIDrawer.prototype.makeBuildingTips = function (buildArea, buildingType) {
        var toDrawOn = {
            positive1: [],
            negative1: []
        };

        for (var i = 0; i < buildArea.length; i++) {
            var currentModifiers = buildArea[i].getValidModifiers(buildingType);
            for (var _mod in currentModifiers) {
                if (currentModifiers[_mod].strength <= 0)
                    continue;
                var sources = currentModifiers[_mod].sources;
                var _polarity = currentModifiers[_mod].effect[Object.keys(currentModifiers[_mod].effect)[0]] > 0;

                var type = (_polarity === true ? "positive1" : "negative1");

                for (var j = 0; j < sources.length; j++) {
                    toDrawOn[type][sources[j].gridPos] = sources[j];
                }
            }
        }
        for (var _type in toDrawOn) {
            for (var _cell in toDrawOn[_type]) {
                this.makeBuildingPlacementTip(toDrawOn[_type][_cell], _type, game.worldRenderer.worldSprite);
            }
        }
    };
    UIDrawer.prototype.makeBuildingPlacementTip = function (cell, type, container) {
        var pos = cell.getScreenPos(container);
        var content = new PIXI.Sprite(this.textureCache.buildingPlacement[type]);

        var uiObj = new UIObject(this.layer, false);
        uiObj.position.set(pos[0], pos[1] - 10);

        uiObj.addChild(content);
        if (content.width) {
            content.position.x -= content.width / 2;
            content.position.y -= content.height / 2;
        }

        uiObj.start();

        this.permanentUIObjects.push(uiObj);
    };
    UIDrawer.prototype.makeFadeyPopup = function (pos, drift, lifeTime, content, easing) {
        if (typeof easing === "undefined") { easing = TWEEN.Easing.Linear.None; }
        var tween = new TWEEN.Tween({
            alpha: 1,
            x: pos[0],
            y: pos[1]
        });
        tween.easing(easing);

        var uiObj = new UIObject(this.layer).lifeTime(lifeTime).onAdded(function () {
            tween.start();
        }).onComplete(function () {
            TWEEN.remove(tween);
        });

        tween.to({
            alpha: 0,
            x: pos[0] + drift[0],
            y: pos[1] + drift[1]
        }, lifeTime).onUpdate(function () {
            uiObj.alpha = this.alpha;
            uiObj.position.set(this.x, this.y);
        });

        uiObj.position.set(pos[0], pos[1]);

        if (content.width) {
            content.position.x -= content.width / 2;
            content.position.y -= content.height / 2;
        }

        uiObj.addChild(content);

        uiObj.start();
        return uiObj;
    };

    UIDrawer.prototype.clearLayer = function () {
        for (var i = this.layer.children.length - 1; i >= 0; i--) {
            this.layer.removeChild(this.layer.children[i]);
        }
    };
    return UIDrawer;
})();

/*
interface Tool
{
selectType: any;
tintColor: number;
activateCost: number;
activate(target:Cell[]);
}
*/
var Tool = (function () {
    function Tool() {
        this.mapmode = "default";
        this.continuous = true;
        this.tempContinuous = true;
    }
    Tool.prototype.activate = function (target) {
        for (var i = 0; i < target.length; i++) {
            this.onActivate(target[i]);
        }
    };
    Tool.prototype.onActivate = function (target, props) {
    };
    Tool.prototype.onHover = function (targets) {
    };
    Tool.prototype.onFinish = function () {
    };
    return Tool;
})();

var WaterTool = (function (_super) {
    __extends(WaterTool, _super);
    function WaterTool() {
        _super.call(this);
        this.type = "water";
        this.selectType = rectSelect;
        this.tintColor = 0x4444FF;
        this.mapmode = undefined;
    }
    WaterTool.prototype.onActivate = function (target) {
        target.replace(cg["terrain"]["water"]);
    };
    return WaterTool;
})(Tool);

var GrassTool = (function (_super) {
    __extends(GrassTool, _super);
    function GrassTool() {
        _super.call(this);
        this.type = "grass";
        this.selectType = rectSelect;
        this.tintColor = 0x617A4E;
        this.mapmode = undefined;
    }
    GrassTool.prototype.onActivate = function (target) {
        target.replace(cg["terrain"]["grass"]);
    };
    return GrassTool;
})(Tool);

var SandTool = (function (_super) {
    __extends(SandTool, _super);
    function SandTool() {
        _super.call(this);
        this.type = "sand";
        this.selectType = rectSelect;
        this.tintColor = 0xE2BF93;
        this.mapmode = undefined;
    }
    SandTool.prototype.onActivate = function (target) {
        target.replace(cg["terrain"]["sand"]);
    };
    return SandTool;
})(Tool);

var SnowTool = (function (_super) {
    __extends(SnowTool, _super);
    function SnowTool() {
        _super.call(this);
        this.type = "snow";
        this.selectType = rectSelect;
        this.tintColor = 0xBBDFD7;
        this.mapmode = undefined;
    }
    SnowTool.prototype.onActivate = function (target) {
        target.replace(cg["terrain"]["snow"]);
    };
    return SnowTool;
})(Tool);
var RemoveTool = (function (_super) {
    __extends(RemoveTool, _super);
    function RemoveTool() {
        _super.call(this);
        this.type = "remove";
        this.selectType = rectSelect;
        this.tintColor = 0xFF5555;
        this.mapmode = undefined;
    }
    RemoveTool.prototype.onActivate = function (target) {
        if (game.worldRenderer.currentMapmode !== "underground") {
            target.changeContent("none");
        } else {
            target.changeUndergroundContent();
        }
    };
    return RemoveTool;
})(Tool);

var SellTool = (function (_super) {
    __extends(SellTool, _super);
    function SellTool() {
        _super.call(this);
        this.type = "remove";
        this.selectType = rectSelect;
        this.tintColor = 0xFF5555;
        this.mapmode = undefined;
        this.button = null;
    }
    SellTool.prototype.activate = function (selectedCells) {
        var onlySellBuildings = false;

        for (var i = 0; i < selectedCells.length; i++) {
            if (selectedCells[i].content && selectedCells[i].player) {
                onlySellBuildings = true;
            }
        }

        for (var i = 0; i < selectedCells.length; i++) {
            this.onActivate(selectedCells[i], { onlySellBuildings: onlySellBuildings });
        }
    };
    SellTool.prototype.onActivate = function (target, props) {
        var onlySellBuildings = props.onlySellBuildings;
        var playerOwnsCell = (target.player && target.player.id === game.players.player0.id);
        if (onlySellBuildings && target.content && playerOwnsCell) {
            game.players.player0.sellContent(target.content);
            target.changeContent("none");
        } else if (!onlySellBuildings && playerOwnsCell) {
            game.players.player0.sellCell(target);
        }

        if (!this.continuous && !this.tempContinuous) {
            eventManager.dispatchEvent({
                type: "clickHotkey",
                content: ""
            });
        }
    };
    return SellTool;
})(Tool);

var PlantTool = (function (_super) {
    __extends(PlantTool, _super);
    function PlantTool() {
        _super.call(this);
        this.type = "plant";
        this.selectType = rectSelect;
        this.tintColor = 0x338833;
        this.mapmode = undefined;
    }
    PlantTool.prototype.onActivate = function (target) {
        target.addPlant();
    };
    return PlantTool;
})(Tool);

var HouseTool = (function (_super) {
    __extends(HouseTool, _super);
    function HouseTool() {
        _super.call(this);
        this.type = "house";
        this.selectType = rectSelect;
        this.tintColor = 0x696969;
        this.mapmode = undefined;
    }
    HouseTool.prototype.onActivate = function (target) {
        // TODO
        var toChange;
        while (true) {
            toChange = getRandomProperty(cg["content"]["buildings"]);

            //toChange = cg.content.buildings.bigoffice;
            if (toChange.categoryType && toChange.categoryType === "apartment") {
                break;
            }
        }

        target.changeContent(toChange);
    };
    return HouseTool;
})(Tool);
var RoadTool = (function (_super) {
    __extends(RoadTool, _super);
    function RoadTool() {
        _super.call(this);
        this.type = "road";
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
    }
    RoadTool.prototype.onActivate = function (target) {
        target.changeContent(cg["content"]["roads"]["road_nesw"]);
    };
    return RoadTool;
})(Tool);
var SubwayTool = (function (_super) {
    __extends(SubwayTool, _super);
    function SubwayTool() {
        _super.call(this);
        this.type = "subway";
        this.selectType = manhattanSelect;
        this.tintColor = 0x696969;
        this.mapmode = "underground";
    }
    SubwayTool.prototype.onActivate = function (target) {
        target.changeUndergroundContent(cg["content"]["tubes"]["tube_nesw"]);
    };
    return SubwayTool;
})(Tool);

var BuyTool = (function (_super) {
    __extends(BuyTool, _super);
    function BuyTool() {
        _super.call(this);
        this.type = "buy";
        this.selectType = singleSelect;
        this.tintColor = 0x22EE22;
        this.mapmode = undefined;
    }
    BuyTool.prototype.onActivate = function (target) {
        eventManager.dispatchEvent({
            type: "makeCellBuyPopup", content: {
                player: game.players["player0"],
                cell: target
            }
        });
        if (!this.continuous && !this.tempContinuous) {
            eventManager.dispatchEvent({
                type: "clickHotkey",
                content: ""
            });
        }
    };
    return BuyTool;
})(Tool);

var BuildTool = (function (_super) {
    __extends(BuildTool, _super);
    function BuildTool() {
        _super.call(this);
        this.timesTriedToBuiltOnNonOwnedPlot = 0;
        this.ghostSprites = [];
        this.type = "build";
        this.mapmode = undefined;
        this.button = null;

        this.setDefaults();
    }
    BuildTool.prototype.setDefaults = function () {
        this.selectedBuildingType = undefined;
        this.selectType = singleSelect;
        this.tintColor = 0xFFFFFF;
        this.canBuild = false;
        this.mainCell = undefined;
        this.continuous = false;
        eventManager.dispatchEvent({
            type: "clickHotkey",
            content: ""
        });
    };
    BuildTool.prototype.changeBuilding = function (buildingType, continuous) {
        if (typeof continuous === "undefined") { continuous = false; }
        this.continuous = continuous;
        if (this.selectedBuildingType === buildingType)
            return;

        this.selectedBuildingType = buildingType;
        var size = buildingType.size || [1, 1];

        this.selectType = function (a, b) {
            var start = game.activeBoard.getCell(b);

            if (!start)
                return b;
            else {
                this.mainCell = start;
            }

            var buildable = start.checkBuildable(this.selectedBuildingType, game.players.player0);

            if (buildable) {
                this.tintColor = 0x338833;
                this.canBuild = true;
            } else {
                this.tintColor = 0xFF5555;
                this.canBuild = false;
            }
            return rectSelect(b, [b[0] + size[0] - 1, b[1] + size[1] - 1]);
        }.bind(this);
    };

    BuildTool.prototype.activate = function (selectedCells) {
        if (this.canBuild === true) {
            var cost = game.players.player0.getBuildCost(this.selectedBuildingType);
            if (game.players.player0.money >= cost) {
                eventManager.dispatchEvent({
                    type: "makeBuildingConstructPopup",
                    content: {
                        player: game.players.player0,
                        buildingTemplate: this.selectedBuildingType,
                        cell: this.mainCell,
                        onOk: (this.continuous || this.tempContinuous ? function () {
                            return;
                        } : this.setDefaults.bind(this))
                    }
                });
            } else {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup",
                    content: {
                        text: "Not enough funds"
                    }
                });
            }
            ;
        } else if (!selectedCells[0].player || selectedCells[0].player.id !== game.players.player0.id) {
            for (var i = 0; i < selectedCells.length; i++) {
                eventManager.dispatchEvent({
                    type: "makeCellBuyPopup", content: {
                        player: game.players["player0"],
                        cell: selectedCells[i],
                        onOk: (this.continuous || this.tempContinuous ? function () {
                            return;
                        } : this.setDefaults.bind(this))
                    }
                });
            }
        }

        this.onFinish();
    };
    BuildTool.prototype.onHover = function (targets) {
        var baseCell = targets[0];
        if (!baseCell)
            return;

        var _b = baseCell.gridPos;
        var size = this.selectedBuildingType.size || [1, 1];
        var buildArea = baseCell.board.getCells(rectSelect(_b, [_b[0] + size[0] - 1, _b[1] + size[1] - 1]));
        var belowBuildArea = getArea({
            targetArray: baseCell.board.cells,
            start: _b,
            centerSize: size,
            size: 2,
            anchor: "nw"
        });

        this.clearEffects();

        for (var i = 0; i < belowBuildArea.length; i++) {
            game.highlighter.alphaBuildings(belowBuildArea, 0.2);
        }

        if (!baseCell.content) {
            for (var i = 0; i < buildArea.length; i++) {
                var _cell = buildArea[i];
                if (_cell.content) {
                    this.clearGhostBuilding();
                    break;
                }
                var _s = new Sprite(this.selectedBuildingType, i);
                _s.alpha = 0.6;
                this.ghostSprites.push({
                    sprite: _s,
                    pos: _cell.gridPos
                });

                _s.position = _cell.board.getCell(_cell.gridPos).sprite.position.clone();

                _cell.board.addSpriteToLayer("content", _s, _cell.gridPos);
            }
        }

        var effects = {
            positive: [],
            negative: []
        };

        for (var i = 0; i < this.selectedBuildingType.translatedEffects.length; i++) {
            var modifier = this.selectedBuildingType.translatedEffects[i];
            var categoryType = this.selectedBuildingType.categoryType;
            var effectedCells = baseCell.getArea({
                size: modifier.range,
                centerSize: modifier.center,
                excludeStart: true
            });

            for (var _cell in effectedCells) {
                var cell = effectedCells[_cell];

                var polarity = cell.getModifierPolarity(modifier);

                if (polarity === null)
                    continue;
                else {
                    var type = (polarity === true ? "positive1" : "negative1");
                    var cells = cell.content ? cell.content.cells : cell;
                    for (var j = 0; j < cells.length; j++) {
                        game.uiDrawer.makeBuildingPlacementTip(cells[j], type, game.worldRenderer.worldSprite);
                    }
                }
            }
        }

        game.uiDrawer.makeBuildingTips(buildArea, this.selectedBuildingType);
    };
    BuildTool.prototype.onFinish = function () {
        this.clearEffects();
        this.mainCell = undefined;
    };
    BuildTool.prototype.clearEffects = function () {
        game.highlighter.clearAlpha();
        this.clearGhostBuilding();
    };
    BuildTool.prototype.clearGhostBuilding = function () {
        for (var i = 0; i < this.ghostSprites.length; i++) {
            var _s = this.ghostSprites[i].sprite;
            var _pos = this.ghostSprites[i].pos;
            this.mainCell.board.removeSpriteFromLayer("content", _s, _pos);
        }
        this.ghostSprites = [];
    };
    return BuildTool;
})(Tool);

var ClickTool = (function (_super) {
    __extends(ClickTool, _super);
    function ClickTool() {
        _super.call(this);
        this.type = "click";
        this.selectType = singleSelect;
        this.tintColor = null;
        this.mapmode = undefined;
        this.button = null;
    }
    ClickTool.prototype.onActivate = function (target) {
        var player = game.players.player0;
        var baseAmount = 0;

        if (target.content && target.content.player && target.content.player.id === player.id) {
            baseAmount += player.getIndexedProfitWithoutGlobals(target.content.type.categoryType, target.content.modifiedProfit) * 0.25;
        }

        var finalAmount = player.addMoney(baseAmount, "click");
        player.addClicks(1);

        if (Options.drawClickPopups) {
            game.uiDrawer.makeCellPopup(target, "" + finalAmount.toFixed(3), game.worldRenderer.worldSprite);
        }
    };
    return ClickTool;
})(Tool);

var NothingTool = (function (_super) {
    __extends(NothingTool, _super);
    function NothingTool() {
        _super.call(this);
        this.type = "nothing";
        this.selectType = singleSelect;
        this.tintColor = null;
        this.mapmode = undefined;
        this.button = null;
    }
    NothingTool.prototype.onActivate = function (target) {
    };
    return NothingTool;
})(Tool);

function getRoadConnections(target, depth) {
    var connections = {};
    var dir = "";
    var neighbors = target.getNeighbors(false);
    for (var cell in neighbors) {
        if (neighbors[cell] && neighbors[cell].content && neighbors[cell].content.baseType === "road") {
            connections[cell] = true;
        }
    }

    if (depth > 0) {
        for (var connection in connections) {
            getRoadConnections(neighbors[connection], depth - 1);
        }
    }

    for (var connection in connections) {
        dir += connection;
    }
    if (dir === "") {
        return null;
    } else if (dir === "n" || dir === "s" || dir === "ns") {
        dir = "v";
    } else if (dir === "e" || dir === "w" || dir === "ew") {
        dir = "h";
    }
    if (target.content && target.content.baseType === "road") {
        var finalRoad = cg["content"]["roads"]["road_" + dir];
        target.changeContent(finalRoad, false);
    }
}

function getTubeConnections(target, depth) {
    var connections = {};
    var dir = "";
    var neighbors = target.getNeighbors(false);
    for (var cell in neighbors) {
        if (neighbors[cell] && neighbors[cell].undergroundContent && neighbors[cell].undergroundContent.baseType === "tube") {
            connections[cell] = true;
        }
    }

    if (depth > 0) {
        for (var connection in connections) {
            getTubeConnections(neighbors[connection], depth - 1);
        }
    }

    for (var connection in connections) {
        dir += connection;
    }
    if (dir === "") {
        return null;
    } else if (dir === "n" || dir === "s" || dir === "ns") {
        dir = "v";
    } else if (dir === "e" || dir === "w" || dir === "ew") {
        dir = "h";
    }
    if (target.undergroundContent && target.undergroundContent.baseType === "tube") {
        var finalTube = cg["content"]["tubes"]["tube_" + dir];
        target.changeUndergroundContent(finalTube, false);
    }
}

function pineapple() {
    cg["content"]["buildings"]["pineapple"] = {
        "type": "pineapple",
        "baseType": "building",
        "width": 64,
        "height": 128,
        "anchor": [0.5, 1.25],
        "frame": "pineapple2.png"
    };
}

var game = new Game();
var loader = new Loader(game);
//# sourceMappingURL=citygame.js.map

/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />
///
/// <reference path="js/utility.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UIObject = (function (_super) {
    __extends(UIObject, _super);
    function UIObject(parent, destroyChildren) {
        if (typeof destroyChildren === "undefined") { destroyChildren = true; }
        _super.call(this);
        this._timeouts = {};
        this._callbacks = {
            start: [],
            added: [],
            complete: []
        };
        this._delay = 0;
        this._lifeTime = -1;
        this.visible = false;
        this.setParent(parent);
        this._destroyChildren = destroyChildren;

        return this;
    }
    UIObject.prototype.start = function () {
        var self = this;

        self.fireCallbacks("start");
        self._timeouts["add"] = window.setTimeout(function UIObjectAddFN() {
            self._parent.addChild(self);
            self.visible = true;
            self.fireCallbacks("added");

            if (self._lifeTime > 0) {
                self._timeouts["remove"] = window.setTimeout(function UIObjectRemoveFN() {
                    self.remove.call(self);
                }, self._lifeTime);
            }
        }, self._delay);
        return this;
    };
    UIObject.prototype.setParent = function (parent) {
        this._parent = parent;
        return this;
    };
    UIObject.prototype.delay = function (time) {
        this._delay = time;
        return this;
    };
    UIObject.prototype.lifeTime = function (time) {
        this._lifeTime = time;
        return this;
    };
    UIObject.prototype.addChild = function (child) {
        _super.prototype.addChild.call(this, child);
        return this;
    };
    UIObject.prototype.fireCallbacks = function (id) {
        if (!this._callbacks[id]) {
            throw new Error("UIObject fired callbacks with id: " + id);
            return;
        }
        var callbacks = this._callbacks[id];

        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].call();
        }
        return this;
    };
    UIObject.prototype.remove = function () {
        this.fireCallbacks("complete");
        this.clearTimeouts();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        if (this._destroyChildren)
            deepDestroy(this);
    };
    UIObject.prototype.onStart = function (callback) {
        this._callbacks["start"].push(callback);
        return this;
    };
    UIObject.prototype.onAdded = function (callback) {
        this._callbacks["added"].push(callback);
        return this;
    };
    UIObject.prototype.onComplete = function (callback) {
        this._callbacks["complete"].push(callback);
        return this;
    };
    UIObject.prototype.clearTimeouts = function () {
        for (var timeout in this._timeouts) {
            window.clearTimeout(this._timeouts[timeout]);
        }
    };
    return UIObject;
})(PIXI.DisplayObjectContainer);

function makeToolTip(data, text) {
    var toolTip = new PIXI.DisplayObjectContainer;
    var speechRect;

    if (data.autoSize || !data.width) {
        speechRect = makeSpeechRect(data, text);
    } else {
        speechRect = makeSpeechRect(data);
    }
    var speechPoly = speechRect[0];
    var topLeft = speechRect[1];

    var gfx = new PIXI.Graphics();
    drawPolygon(gfx, speechPoly, data.style.lineStyle, data.style.fillStyle);

    text.position.set(topLeft[0] + data.padding[0], topLeft[1] + data.padding[1]);

    toolTip.addChild(gfx);
    toolTip.addChild(text);

    return toolTip;
}

function drawPolygon(gfx, polygon, lineStyle, fillStyle) {
    //TODO : floating point errors
    gfx.lineStyle(lineStyle.width, lineStyle.color, lineStyle.alpha);
    gfx.beginFill(fillStyle.color, fillStyle.alpha);

    gfx.moveTo(polygon[0][0], polygon[0][1]);

    for (var i = 1; i < polygon.length; i++) {
        if (!(polygon[i][0] === polygon[i - 1][0] && polygon[i][1] === polygon[i - 1][1])) {
            var x = polygon[i][0];
            var y = polygon[i][1];
            gfx.lineTo(x, y);
        }
    }
    gfx.endFill();

    // draw dots at the corners
    /*
    for (var i = 1; i < polygon.length; i++)
    {
    gfx.beginFill();
    gfx.drawEllipse(polygon[i][0], polygon[i][1], 3, 3);
    gfx.endFill();
    }
    */
    return gfx;
}

function makeSpeechRect(data, text) {
    /*
    4|---------------------------|3
    |                           |
    |                           |
    |       1                   |
    5|----|  /-------------------|2
    6| /
    |/
    0, 7
    
    0,7
    |\
    6| \ 1
    5|----|  \-------------------|2
    |                           |
    |                           |
    |                           |
    4|---------------------------|3
    */
    var width = data.width || 200;
    var height = data.height || 100;
    var padding = data.padding || 10;

    var tipPos = data.tipPos || 0.25;
    var tipWidth = data.tipWidth || 10;
    var tipHeight = data.tipHeight || 20;
    var tipDir = data.tipDir || "right";
    var pointing = data.pointing || "down";

    if (text) {
        width = text.width + padding[0] * 2;
        height = text.height + padding[1] * 2;
    }

    var xMax = width * (1 - tipPos);
    var yMax = height + tipHeight;
    var xMin = -width * tipPos;
    var yMin = tipHeight;
    var dir = (pointing === "down") ? -1 : 1;

    var polygon;
    var topLeft;

    // make base polygon
    if (pointing === "down") {
        polygon = [
            [0, 0],
            [0, -yMin],
            [xMax, -yMin],
            [xMax, -yMax],
            [xMin, -yMax],
            [xMin, -yMin],
            [0, -yMin],
            [0, 0]
        ];
        topLeft = [xMin, -yMax];
    } else if (pointing === "up") {
        polygon = [
            [0, 0],
            [0, yMin],
            [xMax, yMin],
            [xMax, yMax],
            [xMin, yMax],
            [xMin, yMin],
            [0, yMin],
            [0, 0]
        ];
        topLeft = [xMin, yMin];
    }

    // adjust direction tip slants in
    if (tipDir === "right") {
        polygon[1][0] = tipWidth;
    } else if (tipDir === "left") {
        polygon[6][0] = -tipWidth;
    }

    // adjust for extreme tip position
    if (tipPos < 0) {
        polygon[1][0] = polygon[5][0] + tipWidth;
        polygon[5] = polygon[6] = [polygon[5][0], polygon[5][1] + tipWidth * dir];
    } else if (tipPos > 1) {
        polygon[6][0] = polygon[2][0] - tipWidth;
        polygon[2] = polygon[1] = [polygon[2][0], polygon[2][1] + tipWidth * dir];
    }

    return [polygon, topLeft];
}
//# sourceMappingURL=ui.js.map
