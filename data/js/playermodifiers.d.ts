declare module playerModifiers {
    interface IPlayerModifier {
        type: string;
        title: string;
        description: string;
        effects: {
            targets: string[];
            addedProfit?: number;
            multiplier?: number;
            buildCost?: number;
        }[];
        unlockConditions?: any;
    }
    var testModifier: IPlayerModifier;
    var clickModifier1: IPlayerModifier;
    var clickModifier2: IPlayerModifier;
    var clickModifier3: IPlayerModifier;
    var clickModifier4: IPlayerModifier;
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
