/// <reference path="js/eventlistener.d.ts" />

var keyboardStates =
{
  "default":
  {
    "keydown":
    {
      // space
      "32": function()
      {
        eventManager.dispatchEvent({type: "togglePause", content:""});
      },
      // numpad plus
      "107": function()
      {
        eventManager.dispatchEvent({type: "incrementSpeed", content:""});
      },
      // plus
      "187": function()
      {
        eventManager.dispatchEvent({type: "incrementSpeed", content:""});
      },
      // numpad minus
      "109": function()
      {
        eventManager.dispatchEvent({type: "decrementSpeed", content:""});
      },
      // minus
      "189": function()
      {
        eventManager.dispatchEvent({type: "decrementSpeed", content:""});
      }
    }
  }
}

class KeyboardEventHandler
{
  currState: string;
  statesObj: any;
  listeners: any = {};
  constructor(initialState:string = "default")
  {
    this.statesObj = keyboardStates;
    this.setState(initialState);
  }
  setState(state: string)
  {
    this.removeListeners();
    this.addEventListeners(state);
    this.currState = state;
  }
  addEventListeners(state: string)
  {
    for (var type in this.statesObj[state])
    {
      var eventHandler;
      if (type === "keydown")
      {
        eventHandler = this.handleKeydown.bind(this);
      }
      else if (type === "keyup")
      {
        eventHandler = this.handleKeyup.bind(this);
      }
      else
      {
        console.warn("Tried to bind invalid keyboard event ", type);
        return;
      }
      this.listeners[type] = document.addEventListener(type, eventHandler);
    }
  }
  removeListeners()
  {
    for (var type in this.listeners)
    {
      document.removeEventListener(type, this.listeners[type]);
    }
    this.listeners = {};
  }
  handleKeydown(event)
  {
    if (this.statesObj[this.currState]["keydown"][event.keyCode])
    {
      this.statesObj[this.currState]["keydown"][event.keyCode].call();
    }
  }
  handleKeyup(event)
  {

  }
}