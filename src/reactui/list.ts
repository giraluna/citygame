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

    var initialSelected =
    {
      index: 0,
      key: sortedItems[0].key,
      item: sortedItems[0]
    };

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

  shiftSelection: function(amount)
  {
    this.setState(
    {
      selected: (this.state.selected + amount) % this.props.listItems.length
    });
  },
  render: function()
  {
    var columns = [];
    var headerLabels = [];

    this.state.columns.forEach(function(column)
    {
      columns.push(
        React.DOM.col(column.props)
      );
      headerLabels.push(
        React.DOM.th({title: column.title}, column.label)
      );
    });

    var itemsToSort = this.props.listItems.map(function(item)
    {
      return(
      {
        sortBy: item[this.state.sortBy.column.propNameToSortBy],
        data: item
      });
    }, this);

    if (this.state.sortBy.order === "desc")
    {
      itemsToSort.sort(function(a, b)
      {
        return a.sortBy > b.sortBy ? 1 : -1;
      });
    }
    else if (this.state.sortBy.order === "asc")
    {
      itemsToSort.sort(function(a, b)
      {
        return a.sortBy > b.sortBy ? -1 : 1;
      });
    }
    else throw new Error("Invalid sort parameter");


    var sortedItems = itemsToSort;
    
    var rows = [];
    sortedItems.forEach(function(item)
    {
      rows.push(UIComponents.ListItem(
      {
        data: item.data
      }));
    });

    return(
      React.DOM.table(null,
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
        selected: null,
        columns: null,
        sortBy: null,

        initialColumns:
        [
          {
            label: "name",
            propNameToSortBy: "name"
          }
        ],
        listItems:
        [
          {
            name: "a",
            key: "a"
          },
          {
            name: "d",
            key: "d"
          },
          {
            name: "b",
            key: "b"
          },
          {
            name: "c",
            key: "c"
          },
          {
            name: "e",
            key: "e"
          }
        ]
      }),
    document.getElementById("react-container")
  );
});
