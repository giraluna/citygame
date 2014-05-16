/// <reference path="../lib/react.d.ts" />
/// 
/// <reference path="js/listitem.d.ts" />

module UIComponents
{
  
  /**
   * props:
   *   listItems
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

export var List = React.createClass({

  getInitialState: function()
  {
    var sortedItems = this.props.listItems;

    var initialSelected = sortedItems[0];

    return(
    {
      columns: this.props.initialColumns,
      selected: initialSelected,
      sortBy:
      {
        column: this.props.initialColumns[0],
        order: "desc"
      }
    });
  },

  componentDidMount: function()
  {
    var self = this;
    this.getDOMNode().addEventListener("keydown", function(event)
    {
      switch (event.keyCode)
      {
        case 40:
        {
          self.shiftSelection(1);
          break;
        }
        case 38:
        {
          self.shiftSelection(-1);
          break;
        }
        default:
        {
          return;
        }
      }
    });
  },

  handleSelectColumn: function(column)
  {
    var order;
    if (this.state.sortBy.column.key === column.key)
    {
      order = this.state.sortBy.order === "desc" ?
        "asc" :
        "desc";
    }
    else
    {
      order = column.defaultOrder;
    }

    this.setState(
    {
      sortBy:
      {
        column: column,
        order: order
      }
    });
  },

  handleSelectRow: function(row)
  {
    this.setState(
    {
      selected: row
    });
  },

  shiftSelection: function(amountToShift: number)
  {
    var reverseIndexes = {};
    for (var i = 0; i < this.props.sortedItems.length; i++)
    {
      reverseIndexes[this.props.sortedItems[i].key] = i;
    };
    var currSelectedIndex = reverseIndexes[this.state.selected.key];
    var nextIndex = (currSelectedIndex + amountToShift) % this.props.sortedItems.length;
    if (nextIndex < 0)
    {
      nextIndex += this.props.sortedItems.length;
    }
    this.setState(
    {
      selected: this.props.sortedItems[nextIndex]
    });
  },
  render: function()
  {
    var self = this;
    var columns = [];
    var headerLabels = [];

    this.state.columns.forEach(function(column)
    {
      var colProps =
      {
        key: column.key
      };

      columns.push(
        React.DOM.col(colProps)
      );
      headerLabels.push(
        React.DOM.th(
          {
            title: column.title,
            onClick: self.handleSelectColumn.bind(null, column),
            key: column.key
          }, column.label)
      );
    });

    // doing sorting here should be good enough
    var propToSortBy = this.state.sortBy.column.key;
    var itemsToSort = this.props.listItems;

    if (this.state.sortBy.order === "desc")
    {
      itemsToSort.sort(function(a, b)
      {
        return a.data[propToSortBy] > b.data[propToSortBy] ? 1 : -1;
      });
    }
    else if (this.state.sortBy.order === "asc")
    {
      itemsToSort.sort(function(a, b)
      {
        return a.data[propToSortBy] > b.data[propToSortBy] ? -1 : 1;
      });
    }
    else throw new Error("Invalid sort parameter");

    var sortedItems = itemsToSort;
    this.props.sortedItems = sortedItems;
    
    var rows = [];
    sortedItems.forEach(function(item)
    {
      var cells = [];
      for (var _column in self.state.columns)
      {
        var column = self.state.columns[_column];

        cells.push(
          React.DOM.td(
            {
              key: "" + item.key + "_" + column.key
            },
            item.data[column.key] || null)
        );
      }

      var rowProps: any = {};
      rowProps.key = item.key;
      rowProps.onClick = self.handleSelectRow.bind(null, item);
      if (self.state.selected.key === item.key)
      {
        rowProps.className = "selected";
      }
      rows.push(
        React.DOM.tr(rowProps, cells)
      );
    });

    return(
      React.DOM.table(
          {
            tabIndex: 1
          },
        React.DOM.colgroup(null,
          columns
        ),

        React.DOM.thead(null,
          React.DOM.tr(null,
            headerLabels
          )
        ),

        React.DOM.tbody(null,
          rows
        )
      )
    );
  }
  
});

}

document.addEventListener('DOMContentLoaded', function()
{
  React.renderComponent(
    UIComponents.List(
      {
        // typescript qq without these
        selected: null,
        columns: null,
        sortBy: null,

        initialColumns:
        [
          {
            label: "name",
            key: "name",
            defaultOrder: "desc"
          },
          {
            label: "age",
            key: "age",
            defaultOrder: "asc"
          }
        ],
        listItems:
        [
          {
            data:
            {
              name: "a",
              age: 10
            },
            key: "a"
          },
          {
            data:
            {
              name: "d",
              age: 11
            },
            key: "d"
          },
          {
            data:
            {
              name: "b",
              age: 15
            },
            key: "b"
          },
          {
            data:
            {
              name: "c",
              age: 12
            },
            key: "c"
          },
          {
            data:
            {
              name: "e",
              age: 20
            },
            key: "e"
          }
        ]
      }),
    document.getElementById("react-container")
  );
});
