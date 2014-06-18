/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
/// 
/// <reference path="../../data/js/cg.d.ts" />
/// 
/// <reference path="../js/player.d.ts" />
/// <reference path="../js/actions.d.ts" />
/// <reference path="../js/eventlistener.d.ts" />
/// 
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/employeeaction.d.ts" />
/// <reference path="js/employeeactionpopup.d.ts" />
/// <reference path="js/inputpopup.d.ts" />
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
      zIndex: number;
    }
  } = {};
  topZIndex: number = 15;
  stage: any;
  frameImages: {[id: string]: HTMLImageElement;}

  player: Player;

  updateInterval: any;

  constructor(player: Player, frameImages: {[id: string]: HTMLImageElement;})
  {
    this.player = player;
    this.frameImages = frameImages;
    this.init();
  }
  init()
  {
    React.initializeTouchEvents(true);
    this.addEventListeners();

    this.updateReact();

    // chrome doesnt work when called via reuqestAnimationFrame
    this.updateInterval = window.setInterval(this.updateReact.bind(this), 1000);
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
    eventManager.addEventListener("makeBuildingConstructPopup", function(event)
    {
      self.makeBuildingConstructPopup(event.content)
    });
    eventManager.addEventListener("makeInputPopup", function(event)
    {
      self.makeInputPopup(event.content)
    });
    eventManager.addEventListener("makeLoadPopup", function(event)
    {
      self.makeLoadPopup()
    });
    eventManager.addEventListener("makeSavePopup", function(event)
    {
      self.makeSavePopup()
    });
    eventManager.addEventListener("closeTopPopup", function(event)
    {
      self.closeTopPopup()
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
      var key = this.idGenerator++;

      var onCloseCallback = props.onClose;
      props.onClose = function()
      {
        this.destroyPopup(key, onCloseCallback);
      }.bind(this);

      var zIndex = this.incrementZIndex();
      var popupProps: any = {};
      for (var prop in props)
      {
        popupProps[prop] = props[prop];
      };
      popupProps.key = key;
      popupProps.initialStyle =
      {
        top: window.innerHeight / 3.5 - 60 + Object.keys(this.popups).length * 15,
        left: window.innerWidth / 3.5 - 60 + Object.keys(this.popups).length * 15,
        zIndex: zIndex
      };
      popupProps.incrementZIndex = this.incrementZIndex.bind(this, key);

      var popup =
      {
        type: type,
        props: popupProps,
        zIndex: zIndex
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
  makeLoadPopup()
  {
    this.makePopup("LoadPopup",
    {
      onOk: function(name)
      {
        eventManager.dispatchEvent(
        {
          type: "loadGame",
          content: name
        });
      }
    });
  }

  makeSavePopup()
  {
    this.makePopup("SavePopup",
    {
      onOk: function(name)
      {
        eventManager.dispatchEvent(
        {
          type: "saveGame",
          content: name
        });
      }
    });
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
        props.recruitingEmployee.trainSkill("recruitment");
      }
    };

    var recruitCloseFN = function(selected)
    {
      if (props.recruitingEmployee)
      {
        props.recruitingEmployee.active = true;
        self.updateReact();
      }
    }
    this.makeEmployeeActionPopup(
    {
      employees: props.employees,
      text: props.text || "Choose employee to recruit",
      onOk: recruitConfirmFN,
      onClose: recruitCloseFN,
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

    if (props.player.ownedCells[props.cell.gridPos]) return;

    var buyCost = props.cell.landValue;
    if (props.cell.content)
    {
      buyCost += 10;
      if (props.cell.content.type.cost)
      {
        buyCost += props.cell.content.type.cost * 1.15;
      }
    }
    var buySelected = function(selected)
    {
      actions.buyCell( props.player, props.cell, selected.employee, buyCost);
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
            amount: buyCost
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
    onOk: any;
  })
  {
    if (Object.keys(props.player.employees).length < 1)
    {
      this.makeInfoPopup({text: "Recruit some employees first"});
      return;
    }

    this.makePopup("BuildingListPopup",
    {
      player: props.player,
      buildingTemplates: cg.content.buildings,
      buildingImages: this.frameImages,
      onOk: props.onOk
    });
  }
  makeBuildingConstructPopup(props:
  {
    player: Player;
    buildingTemplate: any;
    cell: any;
    onOk?: any;
    text?: any;
  })
  {
    var buildBuilding = function(selected)
    {
      if (selected)
      {
        actions.constructBuilding(
        {
          player: props.player,
          cell: props.cell,
          building: props.buildingTemplate,
          employee: selected.employee
        });
        props.onOk.call();
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

  makeInputPopup(props:
  {
    text: any;
    onOk: (string) => any;
    okBtnText?: string;
    onClose: any;
    closeBtnText?: string;
  })
  {
    this.makePopup("InputPopup", props);
  }

  ///// OTHER METHODS /////

  incrementZIndex(key?)
  {
    var newZIndex = this.topZIndex++;
    if (key)
    {
      this.popups[key].zIndex = newZIndex;
    }
    return newZIndex;
  }
  destroyPopup(key, callback?)
  {
    if (callback) callback.call();

    this.popups[key] = null;
    delete this.popups[key];

    this.updateReact();
  }
  closeTopPopup()
  {
    if (Object.keys(this.popups).length < 1) return;
    else
    {
      var max = 0;
      var key;
      for (var popup in this.popups)
      {
        if (this.popups[popup].zIndex > max)
        {
          max = this.popups[popup].zIndex;
          key = popup;
        }
      }
      this.destroyPopup(key);
    }
  }
  clearAllPopups()
  {
    this.popups = {};
  }

  updateReact()
  {
    if (document.hidden) 
    {
      return;
    }

    React.renderComponent(
      UIComponents.Stage( {popups: this.popups, player: this.player, frameImages: this.frameImages}),
      document.getElementById("react-container")
    );
  }
}