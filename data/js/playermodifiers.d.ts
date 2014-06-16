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
}
