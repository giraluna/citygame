declare module playerModifiers {
    interface IPlayerModifier {
        type: string;
        effects?: {
            targets: string[];
            addedProfit?: number;
            multiplier?: number;
            buildCost?: number;
        }[];
    }
    var testModifier: IPlayerModifier;
    var clickModifier1: IPlayerModifier;
    var clickModifier2: IPlayerModifier;
    var clickModifier3: IPlayerModifier;
    var clickModifier4: IPlayerModifier;
}
