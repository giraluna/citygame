/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
/// 
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/actions.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
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
    this.addEventListeners();
    this.updateReact();
  }
  addEventListeners()
  {
    var self = this;

    eventManager.addEventListener("makeInfoPopup", function(event)
    {
      self.makeInfoPopup(event.content);
    });
    eventManager.addEventListener("makeConfirmPopup", function(event)
    {
      self.makeConfirmPopup(event.content)
    });
    eventManager.addEventListener("makeCellBuyPopup", function(event)
    {
      self.makeCellBuyPopup(event.content)
    });
  }

  makePopup(props:
  {
    key: number;
    text?: string;
    content?: any;
    buttons?: any[];
  })
  {
    var key = props.key

    var boundIncrementZIndex = this.incrementZIndex.bind(this);
    var popup = UIComponents.Popup(
    {
      key: key,
      text:      props.text    || null,
      content:   props.content || null,
      buttons:   props.buttons || null,

      incrementZIndex: boundIncrementZIndex
    });

    this.popups.push(popup);
    this.updateReact();
  }

  makeInfoPopup(props:
  {
    text: string;
    okText?: string;
  })
  {
    var key = this.idGenerator++;
    var boundDestroyPopup = this.destroyPopup.bind(this, key, null);

    var closeBtn = React.DOM.button(
    {
      onClick: boundDestroyPopup,
      key: "close"
    }, props.okText || "close");

    this.makePopup(
    {
      key: key,
      text: props.text,
      buttons: [closeBtn]
    });
  }
  makeConfirmPopup(props:
    {
      text: string;
      onOk: any;
      okText?: string;
      onCancel?: any;
      cancelText?: string;
    })
  {
    ///// DEFAULTS /////
    props.okText = props.okText || "confirm";
    props.onCancel = props.onCancel || function(){};
    props.cancelText = props.cancelText || "cancel";

    var key = this.idGenerator++;
    var boundDestroyPopup = this.destroyPopup.bind(this, key, null);

    ///// BUTTONS /////
    var okBtn = React.DOM.button(
    {
      onClick: function()
      {
        props.onOk.call();
        boundDestroyPopup();
      },
      key: "ok"
    }, props.okText);

    var closeBtn = React.DOM.button(
    {
      onClick: function()
      {
        props.onCancel.call();
        boundDestroyPopup();
      },
      key: "cancel"
    }, props.cancelText);

    this.makePopup(
    {
      key: key,
      text: props.text,
      buttons: [okBtn, closeBtn]
    });
  }

  makeCellBuyPopup(props:
  {
    player: Player;
    cell;
  })
  {
    var self = this;
    var player = props.player;
    var cell = props.cell;
    var key = this.idGenerator++;

    ///// CONTENT /////

    var activeEmployees = player.getActiveEmployees();
    if (activeEmployees.length < 1)
    {
      self.makeInfoPopup({text: "Recruit some employees first"});
      return;
    }

    var el = UIComponents.EmployeeList(
      {
        employees: activeEmployees,
        relevantSkills: ["negotiation"],
        selected: null
      });

    var content = React.DOM.div(
      {className: "popup-content"},
      el,
      React.DOM.div(
        null,
        UIComponents.CellInfo({cell: cell}),
        UIComponents.ActionInfo(
        {
          action: "buyCell",
        })
      )
    );

    ///// BUTTONS /////
    var boundDestroyPopup = this.destroyPopup.bind(this, key, null);

    var boundBuySelected = function()
    {
      if (!player.employees[this.state.selected])
      {
        self.makeInfoPopup({text: "No employee selected"});
        return;
      }
      actions.buyCell( player, cell, player.employees[this.state.selected]);
      boundDestroyPopup();
      self.updateReact();
    }.bind(el);

    var okBtn = React.DOM.button(
    {
      onClick: boundBuySelected,
      key: "ok"
    }, "buy");

    var closeBtn = React.DOM.button(
    {
      onClick: boundDestroyPopup,
      key: "close"
    }, "close");

    this.makePopup(
    {
      key: key,
      text: "Choose employee",
      buttons: [okBtn, closeBtn],
      content: content
    });
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