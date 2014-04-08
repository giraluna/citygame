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
    var self = this;

    var activeEmployees = player.getActiveEmployees();
    var key = this.idGenerator++;

    var content = React.DOM.div(
      {className: "popup-content"},
      UIComponents.EmployeeList({employees: activeEmployees}),
      UIComponents.CellInfo({cell: cell})
    );

    var boundDestroyPopup = this.destroyPopup.bind(this, key);
    var boundIncrementZIndex = this.incrementZIndex.bind(this);

    var popup = UIComponents.Popup(
    {
      content: content,
      okText: "ok",
      closeText: "close",
      key: key,
      handleOk: boundDestroyPopup,
      handleClose: boundDestroyPopup,

      incrementZIndex: boundIncrementZIndex
    });


    this.popups.push(popup);
    this.updateReact();
  }

  incrementZIndex()
  {
    return this.topZIndex++;
  }

  destroyPopup(key)
  {
    console.log(this);
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