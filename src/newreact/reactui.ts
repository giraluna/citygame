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
    eventManager.addEventListener("updateReact", function(event)
    {
      self.updateReact()
    });
  }

  ///// /////

  makeEmployeeActionPopup(props:
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
      type: "EmployeeActionPopup",
      props: popupProps
    };

    this.popups[key] = popup;
    this.updateReact();
  }

  makeRecruitPopup(props:
  {
    player: Player
  })
  {
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
      okBtnText: "Select"
    });
  }

  makeRecruitCompletePopup(props:
  {
    recruitingEmployee?: Employee;
    employees: {[key:string]: Employee};
    player: Player;
    text: any;
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

  updateReact()
  {
    React.renderComponent(
      UIComponents.Stage( {popups: this.popups}),
      document.getElementById("react-container")
    );
  }
}