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
        //eventManager.dispatchEvent({type: "togglePause", content:""});
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
      },
      // r
      // recruit
      "82": function()
      {
        eventManager.dispatchEvent(
        {
          type: "recruitHotkey",
          content: ""
        });
        //document.getElementById("recruitBtn").click();
      },
      // u
      // buy
      "85": function(e)
      {
        eventManager.dispatchEvent(
        {
          type: "buyHotkey",
          content: e
        });
        //document.getElementById("buyBtn").click();
      },
      // b
      // build
      "66": function(e)
      {
        eventManager.dispatchEvent(
        {
          type: "buildHotkey",
          content: e
        });
        //document.getElementById("buildBtn").click();
      },
      // c
      // click
      "67": function(e)
      {
        eventManager.dispatchEvent(
        {
          type: "clickHotkey",
          content: e
        });
      },
      // s
      // sell
      "83": function(e)
      {
        eventManager.dispatchEvent(
        {
          type: "sellHotkey",
          content: e
        });
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
      if ((event.target.tagName === "INPUT" && event.target.type === "text") ||
        event.target.tagName === "TEXTAREA")
      {
        return;
      }
      event.preventDefault();
      this.statesObj[this.currState]["keydown"][event.keyCode].call(null, event);
    }
  }
  handleKeyup(event)
  {

  }
}