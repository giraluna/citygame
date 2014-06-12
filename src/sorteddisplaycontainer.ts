/// <reference path="../lib/pixi.d.ts" />

class SortedDisplayObjectContainer extends PIXI.DisplayObjectContainer
{
  container: PIXI.DisplayObjectContainer;
  _sortingIndexes: number[];
  // arr[1] = index 1
  // when adding new displayobject increment following indexes
  
  constructor( layers:number)
  {
    this._sortingIndexes = new Array(layers);
    super();
    this.init();
  }
  
  init()
  {
    for (var i = 0; i < this._sortingIndexes.length; i++)
    {
      this._sortingIndexes[i] = 0;
    };
  }
  incrementIndexes(start:number)
  {
    for (var i = start + 1; i < this._sortingIndexes.length; i++)
    {
      this._sortingIndexes[i]++
    }
  }
  decrementIndexes(start:number)
  {
    for (var i = start + 1; i < this._sortingIndexes.length; i++)
    {
      this._sortingIndexes[i]--
    }
  }

  
  _addChildAt(element:PIXI.DisplayObject, index:number)
  {
    super.addChildAt( element, this._sortingIndexes[index] );
    this.incrementIndexes(index);
  }
  _removeChildAt(element:PIXI.DisplayObject, index:number)
  {
    super.removeChild(element);
    this.decrementIndexes(index);
  }
}