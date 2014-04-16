/// <reference path="../lib/pixi.d.ts" />
/// 
/// <reference path="js/spritehighlighter.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// 

// mom, dad, I'm sorry.

class Blinker extends Highlighter
{
  toBlink: { [key: string] : PIXI.Sprite[] } = {};
  idGenerator: number = 0;

  private blinkFunctions: any[] = [];
  private intervalFN: any;
  private blink: () => void;

  private clearFN: (number?) => void;

  constructor(public delay: number,
    public color: number,
    public repeat: number,
    autoStart: boolean = true)
  {
    super();

    this.repeat = repeat * 2;

    this.makeBlinkFunctions();

    if (autoStart) this.start();

    return this;
  }
  getToBlink(id?: number)
  {
    if (id) return this.toBlink[id];

    else
    {
      var cells = [];
  
      for (var group in this.toBlink)
      {
        cells = cells.concat(this.toBlink[group]);
      }
      return cells;
    }
  }
  private makeBlinkFunctions()
  {
    // allows dynamic assignment
    var getColor = function getColorFN(){return this.color}.bind(this);

    var tintFN = function(){this.tintCells(this.getToBlink(), getColor(), false)}.bind(this);
    var clearFN = this.clearFN = function(id?: number){this.tintCells(this.getToBlink(id), 0xFFFFFF, false)}.bind(this);
    this.blinkFunctions = [tintFN, clearFN];


    this.blink = function loopFN()
    {
      this.blinkFunctions[0].call();
      this.blinkFunctions[this.blinkFunctions.length - 1] = this.blinkFunctions.shift();
      eventManager.dispatchEvent({type: "updateWorld", content: ""});

      if (this.repeat > 0)
      {
        this.repeat--;
        if (this.repeat <= 0) this.stop();
      }
    }.bind(this);
  }
  addCells(cells: any[], id: number = this.idGenerator++)
  {
    if (!this.toBlink[id]) this.toBlink[id] = cells;
    else
    {
      this.toBlink[id] = this.toBlink[id].concat(cells);
    }
    
    return id;
  }
  removeCells(id: number)
  {
    if (!this.toBlink[id]) return;
    else
    {
      if (Object.keys(this.toBlink).length <= 1)
      {
        this.stop();
      }
      else
      {
        this.clearFN(id);
        this.toBlink[id] = null;
        delete this.toBlink[id];
      }

    }
    
    return id;
  }
  start()
  {
    // already running
    if (this.intervalFN) return this;

    var self = this;

    self.blink();
    this.intervalFN = window.setInterval(self.blink, self.delay);

    return this;
  }
  pause()
  {
    window.clearInterval(this.intervalFN)
    this.intervalFN = null;

    return this;
  }
  stop()
  {
    this.pause();
    this.clearFN();
    eventManager.dispatchEvent({type: "updateWorld", content: ""});

    this.toBlink = {};

    return this;
  }
}