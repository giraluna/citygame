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
  topZIndex: number = 15;
  stage: any;

  player: Player;

  constructor(player: Player)
  {
    this.player = player;
    this.init();
  }

  init()
  {
    this.updateReact();
  }

  makeInfoPopup(infoText: string)
  {
    var self = this;
    var key = this.idGenerator++;

    var boundDestroyPopup = this.destroyPopup.bind(this, key, null);
    var boundIncrementZIndex = this.incrementZIndex.bind(this);

    var closeBtn = React.DOM.button(
    {
      onClick: boundDestroyPopup,
      key: "close"
    }, "close");

    var popup = UIComponents.Popup(
    {
      popupText: infoText,
      content: null,
      buttons: [closeBtn],
      key: key,

      incrementZIndex: boundIncrementZIndex
    });

    this.popups.push(popup);
    this.updateReact();
  }

  makeCellBuyPopup(player: Player, cell)
  {
    var self = this;

    var activeEmployees = player.getActiveEmployees();

    if (activeEmployees.length < 1)
    {
      self.makeInfoPopup("Recruit some employees first");
      return;
    }

    var key = this.idGenerator++;

    var el = UIComponents.EmployeeList(
      {
        employees: activeEmployees,
        relevantSkills: ["negotiation"]
      });

    var content = React.DOM.div(
      {className: "popup-content"},
      el,
      UIComponents.CellInfo({cell: cell})
    );


    var boundDestroyPopup = this.destroyPopup.bind(this, key, null);
    var boundIncrementZIndex = this.incrementZIndex.bind(this);

    var boundBuySelected = function()
    {
      if (!self.player.employees[this.state.selected])
      {
        self.makeInfoPopup("No employee selected");
        return;
      }
      self.player.buyCell(cell, self.player.employees[this.state.selected]);
      boundDestroyPopup();
    }.bind(el);

    var onOk = boundBuySelected;

    var okBtn = React.DOM.button(
    {
      onClick: onOk,
      key: "ok"
    }, "buy");

    var closeBtn = React.DOM.button(
    {
      onClick: boundDestroyPopup,
      key: "close"
    }, "close");

    var popup = UIComponents.Popup(
    {
      popupText: "hello",
      content: content,
      buttons: [okBtn, closeBtn],
      key: key,

      incrementZIndex: boundIncrementZIndex
    });

    this.popups.push(popup);
    this.updateReact();
  }
  incrementZIndex()
  {
    return this.topZIndex++;
  }

  destroyPopup(key, callback)
  {
    this.popups = this.popups.filter(function(popup)
    {
      return popup.props.key !== key;
    });

    if (callback) callback.call();

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