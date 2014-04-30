/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
/// 
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/actions.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
/// 
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/employeeaction.d.ts" />
/// <reference path="js/employeeactionpopup.d.ts" />
/// <reference path="js/actioninfo.d.ts" />
/// <reference path="js/stage.d.ts" />

class ReactUI
{
  idGenerator: number = 0;
  popups:
  {
    [id: number]:
    {
      type: string;
      props: any;
    }
  } = {};
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
    React.initializeTouchEvents(true);
    this.addEventListeners();
    this.updateReact();
  }
  addEventListeners()
  {
    var self = this;

    eventManager.addEventListener("makeEmployeeActionPopup", function(event)
    {
      self.makeEmployeeActionPopup(event.content)
    });
    eventManager.addEventListener("makeRecruitPopup", function(event)
    {
      self.makeRecruitPopup(event.content)
    });
    eventManager.addEventListener("makeRecruitCompletePopup", function(event)
    {
      self.makeRecruitCompletePopup(event.content)
    });
    eventManager.addEventListener("makeCellBuyPopup", function(event)
    {
      self.makeCellBuyPopup(event.content)
    });
    eventManager.addEventListener("makeConfirmPopup", function(event)
    {
      self.makeConfirmPopup(event.content)
    });
    eventManager.addEventListener("makePopup", function(event)
    {
      self.makePopup(event.content.type, event.content.props)
    });
    eventManager.addEventListener("makeInfoPopup", function(event)
    {
      self.makeInfoPopup(event.content)
    });
    eventManager.addEventListener("makeBuildingSelectPopup", function(event)
    {
      self.makeBuildingSelectPopup(event.content)
    });
    eventManager.addEventListener("updateReact", function(event)
    {
      self.updateReact()
    });
  }

  ///// /////

  makePopup(type:string, props:
    {

      employees?: {[key:string]: Employee};
      player?: Player;

      text?: any; // string or string[]

      onOk?: any;
      okBtnText?: string;
      onClose?: any;
      closeBtnText?: string;

      relevantSkills?: string[];
      action?: any;
    })
    {
      var container = document.getElementById("react-container");
      var key = this.idGenerator++;

      var onCloseCallback = props.onClose;
      props.onClose = function()
      {
        this.destroyPopup(key, onCloseCallback);
      }.bind(this);

      var popupProps: any = {};
      for (var prop in props)
      {
        popupProps[prop] = props[prop];
      };
      popupProps.key = key;
      popupProps.initialStyle =
      {
        top: container.offsetHeight / 3.5 + Object.keys(this.popups).length * 15,
        left: container.offsetWidth / 3.5 + Object.keys(this.popups).length * 15,
        zIndex: this.incrementZIndex()
      };
      popupProps.incrementZIndex = this.incrementZIndex.bind(this);

      var popup =
      {
        type: type,
        props: popupProps
      };

      this.popups[key] = popup;
      this.updateReact();
    }

  makeEmployeeActionPopup(props: any)
  {
    this.makePopup("EmployeeActionPopup", props);
  }

  makeInfoPopup(props: any)
  {
    this.makePopup("InfoPopup", props);
  }

  makeRecruitPopup(props:
  {
    player: Player
  })
  {
    var self = this;
    var recruitWithSelected = function(selected)
    {
      actions.recruitEmployee(props.player, selected.employee);
    };
    this.makeEmployeeActionPopup(
    {
      player: props.player,
      relevantSkills: ["recruitment"],
      text: "Select employee in charge of recruitment",
      onOk: recruitWithSelected,
      okBtnText: "Select",
      action:
      {
        actionText: "Scouting new employees would take:",
        data:
        {
          time:
          {
            approximate: true,
            amount: 14
          }
        }
      }
    });
  }

  makeRecruitCompletePopup(props:
  {
    recruitingEmployee?: Employee;
    employees: {[key:string]: Employee};
    player: Player;
    text?: any;
  })
  {
    var self = this;
    var recruitConfirmFN = function(selected)
    {
      
      props.player.addEmployee(selected.employee);
      if (props.recruitingEmployee)
      {
        props.recruitingEmployee.active = true;
        props.recruitingEmployee.trainSkill("recruitment");
      }
      self.updateReact();
    };
    this.makeEmployeeActionPopup(
    {
      employees: props.employees,
      text: props.text || "Choose employee to recruit",
      onOk: recruitConfirmFN,
      okBtnText: "Recruit"
    });
  }

  makeCellBuyPopup(props:
  {
    player: Player;
    cell: any;
  })
  {
    if (Object.keys(props.player.employees).length < 1)
    {
      this.makeInfoPopup({text: "Recruit some employees first"});
      return;
    }
    var buySelected = function(selected)
    {
      actions.buyCell( props.player, props.cell, selected.employee);
    }
    this.makeEmployeeActionPopup(
    {
      player: props.player,
      relevantSkills: ["negotiation"],
      text: "Select employee in charge of purchasing the plot",
      onOk: buySelected,
      okBtnText: "Buy",
      action:
      {
        target: props.cell,
        actionText: "Buying this plot would take:",
        
        data:
        {
          time:
          {
            approximate: true,
            amount: 14
          },
          cost:
          {
            approximate: true,
            amount: props.cell.landValue
          }
        }
      }
    });
  }
  makeConfirmPopup(props:
  {
    text: any;
    onOk: any;
    okBtnText?: string;
    onClose?: any;
    closeBtnText?: string;
  })
  {
    this.makePopup("ConfirmPopup", props);
  }
  makeBuildingSelectPopup(props:
  {
    player: Player;
    cell: any;
  })
  {
    if (Object.keys(props.player.employees).length < 1)
    {
      this.makeInfoPopup({text: "Recruit some employees first"});
      return;
    }

    var self = this;
    var buildSelected = function(selected)
    {
      if (selected && props.player.money >= selected.cost)
      {
        self.makeBuildingConstructPopup(
        {
          player: props.player,
          buildingTemplate: selected,
          cell: props.cell
        });
      }
    }
    // TODO
    // bad
    var _: any = window;
    var _game = _.game;
    var _cg = _.cg;
    this.makePopup("BuildingListPopup",
    {
      player: props.player,
      buildingTemplates: _cg.content.buildings,
      buildingImages: _game.frameImages,
      onOk: buildSelected
    });
  }
  makeBuildingConstructPopup(props:
  {
    player: Player;
    buildingTemplate: any;
    cell: any;
    text?: any;
  })
  {
    var buildBuilding = function(selected)
    {
      if (selected && props.player.money >= props.buildingTemplate.cost)
      {
        // TODO
        var _: any = window;
        var _cg = _.cg;
        props.player.addMoney(-props.buildingTemplate.cost);

        actions.constructBuilding(
        {
          player: props.player,
          cell: props.cell,
          building: props.buildingTemplate,
          employee: selected.employee
        });
      }
    }
    this.makeEmployeeActionPopup(
    {
      player: props.player,
      relevantSkills: ["construction"],
      text: "Select employee in charge of construction",
      onOk: buildBuilding,
      okBtnText: "Build",
      action:
      {
        target: props.cell,
        actionText: "Constructing this building would take:",
        data:
        {
          time:
          {
            approximate: true,
            amount: props.buildingTemplate.buildTime
          },
          cost:
          {
            approximate: false,
            amount: props.buildingTemplate.cost
          }
        },
        baseDuration: props.buildingTemplate.buildTime,
        exactCost: props.buildingTemplate.cost,
        
      }
    });
  }

  ///// OTHER METHODS /////

  incrementZIndex()
  {
    return this.topZIndex++;
  }
  destroyPopup(key, callback)
  {
    if (callback) callback.call();

    this.popups[key] = null;
    delete this.popups[key];

    this.updateReact();
  }
  closeTopPopup()
  {

  }

  updateReact()
  {
    React.renderComponent(
      UIComponents.Stage( {popups: this.popups}),
      document.getElementById("react-container")
    );
  }
}