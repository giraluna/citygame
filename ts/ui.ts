/// <reference path="../js/lib/pixi.d.ts" />
/// <reference path="../js/lib/tween.js.d.ts" />

class UIObject extends PIXI.DisplayObjectContainer
{
  timeouts: any = {};

  constructor(
    public _parent: PIXI.DisplayObjectContainer,
    public delay: number,
    public lifeTime: number
    )
  {
    super();
    this.visible = false;

    this.init()
    
  }
  init()
  {
    this._parent.addChild(this);

    var self = this;
    self.timeouts["add"] = window.setTimeout(
      function UIObjectAddFN()
      {
        self.visible = true;

        if (self.lifeTime > 0)
        {
          self.timeouts["remove"] = window.setTimeout(
            function UIObjectRemoveFN()
            {
              self.remove();
            }, self.lifeTime)
        }
      }, self.delay)
  }
  remove()
  {
    this.clearTimeouts();
    if (this.parent)
    {
      this.parent.removeChild(this);
    }
  }
  clearTimeouts()
  {
    for (var timeout in this.timeouts)
    {
      window.clearTimeout( this.timeouts[timeout] );
    }
  }

}

/*
class UIDrawer
{
  layer: PIXI.DisplayObjectContainer;
  fonts: any = {};

  constructor()
  {
    this.layer = game.layers["tooltips"];
    this.init();
  }
  init()
  {
    this.registerFont( "base",
    {
      font: "12px Snippet",
      fill: "#61696B",
      align: "left",
    });
  }

  registerFont( name: string, fontObject: any )
  {
    this.fonts[name] = fontObject;
  }

  addText( text: string, font: string )
  {

    var container = new UIObject( this.layer, 1000, 1000);

    var speechBubble = new PIXI.Graphics();
    container.addChild(speechBubble);
    speechBubble.lineStyle(3, 0xB3C3C6, 1);
    speechBubble.beginFill(0xE8FBFF, 0.8);

    speechBubble.moveTo(0, 0);
    speechBubble.lineTo(10, -20);
    speechBubble.lineTo(150, -20);
    speechBubble.lineTo(150, -120);
    speechBubble.lineTo(-50, -120);
    speechBubble.lineTo(-50, -20);
    speechBubble.lineTo(0, -20);
    speechBubble.lineTo(0, 0);
    speechBubble.endFill();
    

    var textObject = new PIXI.Text(text, this.fonts[font]);
    textObject.position.set(-40, -110)
    container.addChild(textObject);
    return container;
  }
  removeObject( uiObject: PIXI.DisplayObject )
  {
    //this.layer.removeChild( uiObject );
  }
  addFadeyText( text: string, font: string,
    timeout: number, delay: number )
  {
    var uiObject = this.addText(text, font);
    var self = this;
    var tween = new TWEEN.Tween( {alpha: 1} )
    .to( {alpha: 0}, timeout )
    .delay(delay)
    .onUpdate( function()
    {
      uiObject.alpha = this.alpha;
      })
    .onComplete(function()
    {
      //self.removeObject(uiObject)
      });
    tween.start();
    return uiObject;
  }
  clearLayer()
  {
    for (var i = this.layer.children.length - 1; i >= 0; i--)
    {
      this.layer.removeChild(this.layer.children[i]);
    }
  }
}
*/