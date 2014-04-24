/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
/// 
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/actions.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
/// 
/// <reference path="js/buildinglist.d.ts" />
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/cellinfo.d.ts" />
/// <reference path="js/employeeaction.d.ts" />
/// <reference path="js/actioninfo.d.ts" />
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
    eventManager.addEventListener("makeEmployeeActionPopup", function(event)
    {
      self.makeEmployeeActionPopup(event.content)
    });

    eventManager.addEventListener("makeCellBuyPopup", function(event)
    {
      self.makeCellBuyPopup(event.content)
    });
    eventManager.addEventListener("makeRecruitPopup", function(event)
    {
      self.makeRecruitPopup(event.content)
    });
    eventManager.addEventListener("makeRecruitCompletePopup", function(event)
    {
      self.makeRecruitCompletePopup(event.content)
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

    var container = document.getElementById("react-container");

    var boundIncrementZIndex = this.incrementZIndex.bind(this);
    var popup = UIComponents.Popup(
    {
      key: key,
      text:      props.text    || null,
      content:   props.content || null,
      buttons:   props.buttons || null,
      initialStyle:
      {
        top: container.offsetHeight / 3.5 + this.popups.length * 15,
        left: container.offsetWidth / 3.5 + this.popups.length * 15,
        zIndex: this.incrementZIndex()
      },

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
  makeEmployeeActionPopup(props:
  {
    employees: Employee[];
    relevantSkills?: string[];
    player?: Player;
    action?:
    {
      target?: any;
      baseCost?: number;
      baseDuration?: number;
      actionText?: string;
    };

    text?: string;

    onOk: (employee) => any;
    onCancel?: any;
    okText?: string;
    cancelText?: string;
  })
  {
    ///// DEFAULTS /////
    props.text = props.text || "Choose employee";
    props.okText = props.okText || "Confirm";
    props.onCancel = props.onCancel || function(){};
    props.cancelText = props.cancelText || "Cancel";

    props.relevantSkills = props.relevantSkills || [];

    props.action = props.action || {};


    var self = this;
    var key = this.idGenerator++;
    var player = props.player;
    var boundDestroyPopup = this.destroyPopup.bind(this, key, null);

    ///// CONTENT /////
    
    var activeEmployees = props.employees;
    if (activeEmployees.length < 1)
    {
      this.makeInfoPopup({text: "Recruit some employees first"});
      return;
    }

    var ea = UIComponents.EmployeeAction(
      {
        employees: activeEmployees,
        relevantSkills: props.relevantSkills,
        selected: null,
        action: props.action,
        actionText: props.action.actionText
      });

    var content = React.DOM.div(
      {className: "popup-content"},
      ea
    );

    ///// BUTTONS /////
    var okBtn = React.DOM.button(
    {
      onClick: function()
      {
        if (!this.state.selected)
        {
          self.makeInfoPopup({text: "No employee selected"});
          return;
        }
        else
        {
          props.onOk.call(this, this.state.selected.employee);
          boundDestroyPopup();
        }
      }.bind(ea),
      key: "ok"
    }, props.okText);

    var closeBtn = React.DOM.button(
    {
      onClick: function()
      {
        props.onCancel.call(ea);
        boundDestroyPopup();
      }.bind(ea),
      key: "cancel"
    }, props.cancelText);

    

    this.makePopup(
    {
      key: key,
      text: props.text,
      content: content,
      buttons: [okBtn, closeBtn]
    });

  }

  makeCellBuyPopup(props:
  {
    player: Player;
    cell;
  })
  {
    var player = props.player;
    var cell = props.cell;

    ///// BUTTONS /////

    var buySelected = function(selected)
    {
      actions.buyCell( player, cell, selected);
    };


    this.makeEmployeeActionPopup(
    {
      employees: player.getEmployees(),
      relevantSkills: ["negotiation"],

      action: {
        target: cell,
        baseDuration: 14,
        baseCost: cell.landValue,
        actionText: "Buying this plot would take:"
      },

      text: "Choose employee to buy plot",
      onOk: buySelected,
      okText: "Buy"

    });
  }

  makeRecruitPopup(props:
  {
    player: Player;
  })
  {
    var player = props.player;

    ///// BUTTONS /////

    var recruitWithSelected = function(selected)
    {
      actions.recruitEmployee(player, selected);
    };


    this.makeEmployeeActionPopup(
    {
      player: player,
      employees: player.getEmployees(),
      relevantSkills: ["recruitment"],

      action: {actionText: null},

      text: "Select employee in charge of recruitment",
      onOk: recruitWithSelected,
      okText: "Select"

    });
  }

  makeRecruitCompletePopup(props:
  {
    player: Player;
    employees: Employee[];

    onConfirm?: any;
    text?: string;
  })
  {
    var player = props.player;

    props.onConfirm = props.onConfirm || function(){};
    props.text = props.text || "Choose employee to recruit";

    ///// BUTTONS /////

    var recruitConfirmFN = function(selected)
    {
      player.addEmployee(selected);
      props.onConfirm.call();
    }


    this.makeEmployeeActionPopup(
    {
      employees: props.employees,
      text: props.text,
      onOk: recruitConfirmFN,
      okText: "Recruit",
      onCancel: props.onConfirm
    });
  }

  makeConstructBuildingPopup(props:
  {
    player: Player;
    buildingTemplates: any;
    buildingImages: any;
  })
  {
    this.makePopup(
    {
      key: this.idGenerator++,
      content: React.DOM.div({className: "popup-content"},
        UIComponents.BuildingList(
        {
          selected: null,
          player: props.player,
          buildingTemplates: props.buildingTemplates,
          buildingImages: props.buildingImages
        })
      )

    });
  }

  ///// OTHER METHODS /////

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