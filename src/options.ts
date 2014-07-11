/// <reference path="js/eventlistener.d.ts" />

module Options
{
  export var drawClickPopups = true;
  eventManager.addEventListener("toggleDrawClickPopups", function()
  {
    drawClickPopups = !drawClickPopups;
    eventManager.dispatchEvent({type:"saveOptions", content:null});
  });
}