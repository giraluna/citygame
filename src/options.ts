/// <reference path="eventmanager.ts" />

module CityGame
{
  export module Options
  {
    export var drawClickPopups = true;
    eventManager.addEventListener("toggleDrawClickPopups", function()
    {
      drawClickPopups = !drawClickPopups;
      eventManager.dispatchEvent({type:"saveOptions", content:null});
    });

    export var autosaveLimit = 3;
    eventManager.addEventListener("setAutosaveLimit", function(e)
    {
      autosaveLimit = e.content;
      eventManager.dispatchEvent({type:"saveOptions", content:null});
    });

    export var autoSwitchTools = false;
    eventManager.addEventListener("toggleAutoSwitchTools", function(e)
    {
      autoSwitchTools = !autoSwitchTools;
      eventManager.dispatchEvent({type:"saveOptions", content:null});
    });
  }
}
