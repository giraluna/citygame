/// <reference path="../lib/pixi.d.ts" />

/// <reference path="utility.ts" />

module CityGame
{
  export class UIObject extends PIXI.DisplayObjectContainer
  {
    _destroyChildren: boolean;
    _timeouts: any = {};
    _callbacks: any =
    {
      start: [],
      added: [],
      complete: []
    };

    _delay: number = 0;
    _lifeTime: number = -1;

    _parent: PIXI.DisplayObjectContainer;

    constructor(parent, destroyChildren:boolean = true)
    {
      super();
      this.visible = false;
      this.setParent(parent);
      this._destroyChildren = destroyChildren;

      return this
    }
    start()
    {
      var self = this;

      self.fireCallbacks("start");
      self._timeouts["add"] = window.setTimeout(
        function UIObjectAddFN()
        {
          self._parent.addChild(self);
          self.visible = true;
          self.fireCallbacks("added");

          if (self._lifeTime > 0)
          {
            self._timeouts["remove"] = window.setTimeout(
              function UIObjectRemoveFN()
              {
                self.remove.call(self);
              }, self._lifeTime)
          }
        }, self._delay)
      return this
    }
    setParent(parent:PIXI.DisplayObjectContainer)
    {
      this._parent = parent;
      return this
    }
    delay(time:number)
    {
      this._delay = time;
      return this
    }
    lifeTime(time:number)
    {
      this._lifeTime = time;
      return this
    }
    addChild(child)
    {
      super.addChild(child);
      return this
    }
    fireCallbacks(id: string)
    {
      if (! this._callbacks[id])
      {
        throw new Error("UIObject fired callbacks with id: " + id);
        return  
      }
      var callbacks = this._callbacks[id];

      for (var i = 0; i < callbacks.length; i++)
      {
        callbacks[i].call();
      }
      return this
    }
    remove()
    {
      this.fireCallbacks("complete");
      this.clearTimeouts();
      if (this.parent)
      {
        this.parent.removeChild(this);
      }
      if (this._destroyChildren) deepDestroy(this);
    }
    onStart(callback)
    {
      this._callbacks["start"].push(callback);
      return this
    }
    onAdded(callback)
    {
      this._callbacks["added"].push(callback);
      return this
    }
    onComplete(callback)
    {
      this._callbacks["complete"].push(callback);
      return this
    }
    private clearTimeouts()
    {
      for (var timeout in this._timeouts)
      {
        window.clearTimeout( this._timeouts[timeout] );
      }
    }
  }
}