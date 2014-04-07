/// <reference path="../lib/react.d.ts" />

/// <reference path="../js/player.d.ts" />

module aba
{
  var ana;
}

/*
class ReactUI
{
  idGenerator: number = 0;
  popups: any[] = [];
  topZIndex: number = 0;

  constructor()
  {
    
  }

  makeCellBuyPopup(player: Player, cell)
  {
    var activeEmployees = player.getActiveEmployees();

    var content = React.DOM.div(
      null,
      EmployeeList({employees: activeEmployees}),
      CellIndo({cell: cell})
    );

    var popup = Popup(
    {
      content: content
    });
  }

  newPopup(_employees: Employee[])
  {
    var el = EmployeeList({employees: _employees});
    var popup = Popup (
      {
        content: el,
        key: popupIdGenerator++,

      });
    popuplist.push(popup);
    updateReact();
  }

  destroyPopup(key)
  {
    popuplist = popuplist.filter(function(popup)
    {
      return popup.props.key !== key;
    });

    updateReact();
  }
}
*/