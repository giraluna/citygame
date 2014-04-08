/// <reference path="../../lib/react.d.ts" />

/// <reference path="../js/player.d.ts" />
/// 
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/cellinfo.d.ts" />
/// <reference path="js/popup.d.ts" />
/// <reference path="js/stage.d.ts" />

class ReactUI
{
  idGenerator: number = 0;
  popups: any[] = [];
  topZIndex: number = 0;
  stage: any;

  constructor()
  {
    this.init();
  }

  init()
  {
    this.updateReact();
  }

  makeCellBuyPopup(player: Player, cell)
  {
    var activeEmployees = player.getActiveEmployees();

    var content = React.DOM.div(
      null,
      UIComponents.EmployeeList({employees: activeEmployees}),
      UIComponents.CellInfo({cell: cell})
    );

    var popup = UIComponents.Popup(
    {
      content: content,
      okText: "ok",
      closeText: "close",
      key: this.idGenerator++,
    });

    this.popups.push(popup);
  }

  newPopup(_employees: any[])
  {
    var el = UIComponents.EmployeeList({employees: _employees});
    var popup = UIComponents.Popup (
      {
        content: el,
        key: this.idGenerator++,

      });
    this.popups.push(popup);
    this.updateReact();
  }

  destroyPopup(key)
  {
    this.popups = this.popups.filter(function(popup)
    {
      return popup.props.key !== key;
    });

    this.updateReact();
  }

  updateReact()
  {
    React.renderComponent(
      UIComponents.Stage( {popups: this.popups}),
      document.getElementById("react-container")
    );
  }
}

function ABA()
{
  var abaa = new ReactUI();
  game.players.player0.addEmployee(new Employee("lolol", TEMPNAMES, {skillLevel: 1, growthLevel: 1}));

  abaa.newPopup(game.players.player0.employees);
}