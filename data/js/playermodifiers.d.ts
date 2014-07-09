declare module playerModifiers {
    interface IPlayerModifier {
        type: string;
        title: string;
        description: any;
        effects?: {
            targets: string[];
            addedProfit?: number;
            multiplier?: number;
            buildCost?: {
                multiplier?: number;
                addedCost?: number;
            };
        }[];
        onAdd?: {
            oneTime: boolean;
            effect: (any: any) => void;
        };
        dynamicEffect?: {
            [target: string]: (any: any) => any;
        };
        unlockConditions?: any;
    }
    var testModifier: IPlayerModifier;
    var prestigeDefault: IPlayerModifier;
    var clickModifier1: IPlayerModifier;
    var clickModifier2: IPlayerModifier;
    var clickModifier3: IPlayerModifier;
    var clickModifier4: IPlayerModifier;
    var clickModifier5: IPlayerModifier;
    var clickModifier6: IPlayerModifier;
    var parkingModifier1: IPlayerModifier;
    var parkingModifier2: IPlayerModifier;
    var parkingModifier3: IPlayerModifier;
    var parkingModifier4: IPlayerModifier;
    var parkingModifier5: IPlayerModifier;
    var convenienceModifier1: IPlayerModifier;
    var convenienceModifier2: IPlayerModifier;
    var convenienceModifier3: IPlayerModifier;
    var convenienceModifier4: IPlayerModifier;
    var convenienceModifier5: IPlayerModifier;
    var fastFoodModifier1: IPlayerModifier;
    var fastFoodModifier2: IPlayerModifier;
    var fastFoodModifier3: IPlayerModifier;
    var fastFoodModifier4: IPlayerModifier;
    var fastFoodModifier5: IPlayerModifier;
    var apartmentModifier1: IPlayerModifier;
    var apartmentModifier2: IPlayerModifier;
    var apartmentModifier3: IPlayerModifier;
    var apartmentModifier4: IPlayerModifier;
    var apartmentModifier5: IPlayerModifier;
    var officeModifier1: IPlayerModifier;
    var officeModifier2: IPlayerModifier;
    var officeModifier3: IPlayerModifier;
    var officeModifier4: IPlayerModifier;
    var officeModifier5: IPlayerModifier;
    var factoryModifier1: IPlayerModifier;
    var factoryModifier2: IPlayerModifier;
    var factoryModifier3: IPlayerModifier;
    var factoryModifier4: IPlayerModifier;
    var factoryModifier5: IPlayerModifier;
    var hotelModifier1: IPlayerModifier;
    var hotelModifier2: IPlayerModifier;
    var hotelModifier3: IPlayerModifier;
    var hotelModifier4: IPlayerModifier;
    var hotelModifier5: IPlayerModifier;
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
