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

    eventManager.addEventListener("makeEmployeeActionPopup", function(event)
    {
      self.makeEmployeeActionPopup(event.content)
    });
  }

  ///// /////

  makeEmployeeActionPopup(props:
  {
    employees?: Employee[];
    player?: Player;

    text?: string;

    onOk?: any;
    okBtnText?: string;
    onClose?: any;
    closeBtnText?: string;

    relevantSkills?: string[];
    action?: any;
  })
  {
    var container = document.getElementById("react-container");

    var popupProps: any = {};
    for (var prop in props)
    {
      popupProps[prop] = props[prop];
    };
    popupProps.key = this.idGenerator++;
    popupProps.initialStyle =
    {
      top: container.offsetHeight / 3.5 + this.popups.length * 15,
      left: container.offsetWidth / 3.5 + this.popups.length * 15,
      zIndex: this.incrementZIndex()
    };
    popupProps.incrementZIndex = this.incrementZIndex.bind(this);

    var popup = UIComponents.EmployeeActionPopup(popupProps);

    this.popups.push(popup);
    this.updateReact();
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