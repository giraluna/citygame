/// <reference path="../cell.ts" />
/// <reference path="../selectiontypes.ts" />

module CityGame
{
  export class Tool
  {
    type: string;
    selectType: ISelectionType;
    tintColor: number;
    activateCost: number;
    mapmode: string = "default";
    continuous: boolean = true;
    tempContinuous: boolean = true;
    button: HTMLInputElement;

    activate(target:Cell[])
    {
      for (var i = 0; i < target.length; i++)
      {
        this.onActivate(target[i]);
      }
    }
    onChange(){}
    onActivate(target:Cell, props?: any){}
    onHover(targets:Cell[]){}
    onFinish(){}
}
}
