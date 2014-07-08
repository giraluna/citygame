/// <reference path="playermodifiers.d.ts" />
declare module employeeModifiers {
    var fastFoodTrait1: playerModifiers.IPlayerModifier;
    var clicksPerShoppingTrait1: playerModifiers.IPlayerModifier;
    var apartmentTrait1: playerModifiers.IPlayerModifier;
    var apartmentFactoriesTrait1: playerModifiers.IPlayerModifier;
    var factoryBuildingsTrait1: playerModifiers.IPlayerModifier;
    var hotelShoppingTrait1: playerModifiers.IPlayerModifier;
    var hotelTrait1: playerModifiers.IPlayerModifier;
    /**
    * unlockConditions:
    * [
    *   {
    *     type: "buildings", "level", "money"
    *     value: 69
    *   }
    * ]
    * */
    /**
    * modifiersbyUnlock =
    * {
    *   money:
    *   {
    *     69: [playerModifiers.äbäbäbä]
    *   }
    * }
    */
    var modifiersByUnlock: any;
    var allModifiers: any[];
}
