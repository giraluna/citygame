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

    var el = UIComponents.EmployeeList({employees: activeEmployees});

    var content = React.DOM.div(
      {className: "popup-content"},
      el,
      UIComponents.CellInfo({cell: cell})
    );


    var boundDestroyPopup = this.destroyPopup.bind(this, key);
    var boundIncrementZIndex = this.incrementZIndex.bind(this);

    var boundReturnSelected = function()
    {
      console.log(this.state.selected);
      return this.state.selected;
    }.bind(el);

    var onOk = this.destroyPopup.bind(this, key, boundReturnSelected);

    var popup = UIComponents.Popup(
    {
      content: content,
      okText: "ok",
      closeText: "close",
      key: key,
      handleOk: onOk,
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

  destroyPopup(key, callback?)
  {
    this.popups = this.popups.filter(function(popup)
    {
      return popup.props.key !== key;
    });

    callback.call();

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