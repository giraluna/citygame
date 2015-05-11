/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../../lib/tween.js.d.ts" />
/// <reference path="../../lib/react.d.ts" />
declare module CityGame {
    interface ISelectionType {
        (startPoint: number[], endPoint: number[]): number[][];
    }
    module SelectionTypes {
        function singleSelect(a: number[], b: number[]): number[][];
        function rectSelect(a: number[], b: number[]): number[][];
        function manhattanSelect(a: number[], b: number[]): number[][];
    }
}
declare module CityGame {
    function getFrom2dArrayByPosition(targetArray: any[][], toFetch: number[][]): any;
    function getRandomKey(target: any): string;
    function getRandomProperty(target: any): any;
    function getRandomArrayItem(target: any[]): any;
    function setDeepProperties(baseObj: any, target: any[], props: any): any;
    function deepDestroy(toDestroy: any): void;
    function rectToIso(width: number, height: number): number[][];
    function getOrthoCoord(click: number[], tileSize: number[], worldSize: number[]): number[];
    function getIsoCoord(x: number, y: number, width: number, height: number, offset?: number[]): number[];
    function getTileScreenPosition(x: number, y: number, tileSize: number[], worldSize: number[], container: PIXI.DisplayObjectContainer): void;
    function randInt(min: any, max: any): number;
    function randRange(min: any, max: any): any;
    function rollDice(dice: any, sides: any): number;
    interface ISpritesheetData {
        frames: {
            [id: string]: {
                frame: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                };
            };
        };
        meta: any;
    }
    function spritesheetToImages(sheetData: ISpritesheetData, baseUrl: string): {
        [id: string]: HTMLImageElement;
    };
    function addClickAndTouchEventListener(target: any, callback: any): void;
    /**
    * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
    *
    * Converts an HSL color value to RGB. Conversion formula
    * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
    * Assumes h, s, and l are contained in the set [0, 1] and
    * returns r, g, and b in the set [0, 255].
    *
    * @param   Number  h       The hue
    * @param   Number  s       The saturation
    * @param   Number  l       The lightness
    * @return  Array           The RGB representation
    */
    function hslToRgb(h: number, s: number, l: number): number[];
    function hslToHex(h: any, s: any, l: any): number;
    function getNeighbors(targetArray: any[][], gridPos: number[], diagonal?: boolean): {
        n: any;
        e: any;
        s: any;
        w: any;
        ne: any;
        nw: any;
        se: any;
        sw: any;
    };
    function getDistanceFromCell(cells: any[][], center: any[], maxDistance: number, diagonal?: boolean): any;
    function getArea(props: {
        targetArray: any[][];
        start: number[];
        centerSize?: number[];
        size: number;
        anchor?: string;
        excludeStart?: boolean;
    }): any;
    function arrayToPolygon(points: any): PIXI.Polygon;
    function arrayToPoint(point: any): PIXI.Point;
    function getReverseDir(dir: string): string;
    function formatEveryThirdPower(notations: any, precision: number): any;
    function rawFormatter(value: any): number;
    function beautify(value: number, formatterIndex?: number): any;
    function toggleDebugmode(): void;
    function capitalize(str: string): string;
    function cloneObject(toClone: any): any;
}
declare module CityGame {
    var idGenerator: {
        content: number;
        player: number;
        board: number;
        employee: number;
    };
}
declare var arrayLogic: any;
declare module CityGame {
    class Sprite extends PIXI.Sprite {
        public type: string;
        constructor(template: any, frameIndex?: number);
    }
}
declare module CityGame {
    class GroundSprite extends CityGame.Sprite {
        public cell: CityGame.Cell;
        constructor(type: any, cell: any);
    }
}
declare module CityGame {
    class ContentSprite extends CityGame.Sprite {
        public content: CityGame.Content;
        constructor(type: any, content: any, frameIndex: number);
    }
}
declare module cellModifiers {
    function niceEnviroment(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
        landValue: {
            radius: number;
            multiplier: number;
            scalingFN: (strength: any) => number;
        };
    };
    function crowded(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        scaling: (strength: any) => number;
        effect: {
            multiplier: number;
        };
    };
    function population(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
        scaling: (strength: any) => any;
        landValue: {
            radius: number;
            multiplier: number;
        };
    };
    function fastfoodCompetition(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
    function shoppingCompetition(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
    function nearbyShopping(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
    };
    function nearbyStation(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
        landValue: {
            radius: number;
            multiplier: number;
            falloffFN: (distance: any, invertedDistance: any, invertedDistanceRatio: any) => number;
        };
    };
    function parkingCompetition(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
    function nearbyParking(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
    function nearbyFactory(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
        landValue: {
            radius: number;
            multiplier: number;
            falloffFN: (distance: any, invertedDistance: any, invertedDistanceRatio: any) => number;
        };
    };
    function nearbyRoad(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
        scaling: (strength: any) => number;
    };
    function nearbyHotel(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
        landValue: {
            radius: number;
            multiplier: number;
            falloffFN: (distance: any, invertedDistance: any, invertedDistanceRatio: any) => number;
        };
    };
    function hotelCompetition(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
    };
    function nearbyStadium(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
    };
    function stadiumCompetition(range: number, strength?: number): {
        type: string;
        title: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
    };
}
declare var cg: any;
declare var buildingTypeIndexes: any;
declare function findType(typeName: string, target?: any): any;
declare var effectSourcesIndex: any;
declare var playerBuildableBuildings: any[];
declare module CityGame {
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
    module PlayerModifiers {
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
        var stadiumModifier1: IPlayerModifier;
        var stadiumModifier2: IPlayerModifier;
        var stadiumModifier3: IPlayerModifier;
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
        *     69: [PlayerModifiers.äbäbäbä]
        *   }
        * }
        */
        var modifiersByUnlock: any;
        var allModifiers: any[];
    }
}
declare module CityGame {
    module LevelUpModifiers {
        var testModifier: CityGame.IPlayerModifier;
        var fundingBoost1: CityGame.IPlayerModifier;
        var clicksPerParking1: CityGame.IPlayerModifier;
        var clicksPerLevel1: CityGame.IPlayerModifier;
        var shoppingCostReduction1: CityGame.IPlayerModifier;
        var parkingCostReduction1: CityGame.IPlayerModifier;
        var fundingBoost2: CityGame.IPlayerModifier;
        var america1: CityGame.IPlayerModifier;
        var betterSellPrice1: CityGame.IPlayerModifier;
        var increasedRecruitQuality1: CityGame.IPlayerModifier;
        var fundingBoost3: CityGame.IPlayerModifier;
        var buildRush1: CityGame.IPlayerModifier;
        var buildCostReduction1: CityGame.IPlayerModifier;
        var buyRush1: CityGame.IPlayerModifier;
        var clickFrenzy1: CityGame.IPlayerModifier;
        var shoppingProfitPerApartment: CityGame.IPlayerModifier;
        var branchOffices1: CityGame.IPlayerModifier;
        var increasedRecruitQuality2: CityGame.IPlayerModifier;
        var prestigeEffectIncrease1: CityGame.IPlayerModifier;
        var shoppingCostReductionPerFactory: CityGame.IPlayerModifier;
        var hotelParking1: CityGame.IPlayerModifier;
        var hotelFastfood1: CityGame.IPlayerModifier;
        var factoryPerLevel1: CityGame.IPlayerModifier;
        var prestigeHotel1: CityGame.IPlayerModifier;
        var branchOffices2: CityGame.IPlayerModifier;
        var modifiersByUnlock: any;
        var allModifiers: any[];
    }
}
declare var names: {
    "american": {
        "male": string[];
        "female": string[];
        "surnames": string[];
    };
    "british": {
        "male": string[];
        "female": string[];
        "surnames": string[];
    };
    "german": {
        "male": string[];
        "female": string[];
        "surnames": string[];
    };
    "chinese": {
        "props": {
            "surname_first": boolean;
        };
        "male": string[];
        "female": string[];
        "surnames": string[];
    };
    "japanese": {
        "props": {
            "surname_first": boolean;
        };
        "male": string[];
        "female": string[];
        "surnames": string[];
    };
    "korean": {
        "props": {
            "surname_first": boolean;
        };
        "male": string[];
        "female": string[];
        "surnames": string[];
    };
};
declare module CityGame {
    module EmployeeModifiers {
        var fastFoodTrait1: CityGame.IPlayerModifier;
        var clicksPerShoppingTrait1: CityGame.IPlayerModifier;
        var apartmentTrait1: CityGame.IPlayerModifier;
        var apartmentFactoriesTrait1: CityGame.IPlayerModifier;
        var factoryBuildingsTrait1: CityGame.IPlayerModifier;
        var hotelShoppingTrait1: CityGame.IPlayerModifier;
        var hotelTrait1: CityGame.IPlayerModifier;
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
        *     69: [PlayerModifiers.äbäbäbä]
        *   }
        * }
        */
        var modifiersByUnlock: any;
        var allModifiers: any[];
    }
}
declare module CityGame {
    interface ISkillsObj {
        negotiation: number;
        recruitment: number;
        construction: number;
    }
    class Employee {
        public id: string;
        public name: string;
        public player: any;
        public gender: string;
        public ethnicity: string;
        public skills: ISkillsObj;
        public growth: ISkillsObj;
        public skillTotal: number;
        public potential: number;
        public trait: CityGame.IPlayerModifier;
        public active: boolean;
        public currentAction: string;
        constructor(names: any, params: {
            id?: string;
            name?: string;
            gender?: string;
            ethnicity?: string;
            skillLevel?: number;
            skillVariance?: number;
            growthLevel?: number;
            growth?: ISkillsObj;
            potential?: number;
            skills?: ISkillsObj;
            trait?: string;
            traitChance?: number;
        });
        public getName(names: any, gender: string, ethnicity: string): string;
        public setSkillsByLevel(skillLevel: any, variance: any): ISkillsObj;
        public setGrowthByLevel(growthLevel: any): ISkillsObj;
        public setSkillTotal(): void;
        public trainSkill(skill: string): void;
        public addTrait(modifier: any): void;
        public addRandomTrait(): void;
        public getAvailableTraits(): any[];
    }
    function makeNewEmployees(employeeCount: number, recruitingSkill: number): any[];
}
declare module CityGame {
    class Player {
        public id: string;
        public color: number;
        public money: number;
        public clicks: number;
        public level: number;
        public experience: number;
        public experienceForCurrentLevel: number;
        public experienceToNextLevel: number;
        public timesReset: number;
        public prestige: number;
        public totalResetExperience: number;
        public permanentLevelupUpgrades: string[];
        public ownedContent: any;
        public amountBuiltPerType: any;
        public amountBuiltPerCategory: any;
        public ownedCells: any;
        public ownedCellsAmount: number;
        public employees: any;
        public usedInitialRecruit: boolean;
        public incomePerDate: any;
        public incomePerType: any;
        public rollingIncome: number[];
        public lastRollingIncomeDay: number;
        public modifiers: any;
        public dynamicModifiers: any;
        public timedModifiers: any;
        public LevelUpModifiers: any;
        public specialModifiers: any;
        public defaultModifiers: any;
        public EmployeeModifiers: any;
        public modifierEffects: any;
        public unlockedModifiers: any[];
        public lockedModifiers: any[];
        public unlockedLevelUpModifiers: {
            [level: number]: CityGame.IPlayerModifier[];
        };
        public LevelUpModifiersPerLevelUp: number;
        public levelsAlreadyPicked: any;
        public recentlyCheckedUnlockConditions: any;
        public indexedProfits: any;
        public indexedProfitsWithoutGlobals: any;
        public moneySpan: HTMLElement;
        public incomeSpan: HTMLElement;
        constructor(id: string, color?: number);
        public updateElements(): void;
        public init(): void;
        public addEmployee(employee: CityGame.Employee): void;
        public removeEmployee(employee: CityGame.Employee): void;
        public getEmployees(): any[];
        public getActiveEmployees(): any[];
        public addCell(cell: any): void;
        public removeCell(cell: any): void;
        public sellCell(cell: any): void;
        public addContent(content: any): void;
        public removeContent(content: any): void;
        public sellContent(content: any): void;
        public addMoney(initialAmount: any, incomeType?: string, baseMultiplier?: number, date?: any): any;
        public subtractCost(amount: number): number;
        public addModifier(modifier: any, collection?: string, firstTime?: boolean): void;
        public addSpecialModifier(modifier: any): void;
        public addTimedModifier(modifier: any): void;
        public addDynamicModifier(sourceModifier: any): void;
        public addEmployeeModifier(modifier: any): void;
        public applyModifier(modifier: any): void;
        public applyAllModifiers(): void;
        public removeModifier(modifier: any, collection?: string): void;
        public getBuildCost(type: any): number;
        public getCellBuyCost(cell: any): number;
        public addExperience(amount: any): void;
        public levelUp(callSize?: number): void;
        public getExperienceForLevel(level: any): number;
        public setExperienceToNextLevel(): void;
        public getExperiencePercentage(): number;
        public getModifiedProfit(initialAmount: number, type?: string, baseMultiplier?: number, includeGlobal?: boolean): number;
        public getIndexedProfit(type: any, amount: number, baseMultiplier?: number): any;
        public getIndexedProfitWithoutGlobals(type: any, amount: any): any;
        public clearIndexedProfits(): void;
        public getUnlockConditionVariable(conditionType: string): any;
        public checkIfUnlocked(modifier: CityGame.IPlayerModifier): boolean;
        public setInitialAvailableModifiers(): void;
        public checkLockedModifiers(conditionType: string, timeout?: number): void;
        public unlockModifier(modifier: CityGame.IPlayerModifier): void;
        public updateDynamicModifiers(conditionType: string): void;
        public addClicks(amount: number): void;
        public unlockLevelUpModifiers(level: any): void;
        public addLevelUpModifier(modifier: any, preventMultiplePerLevel?: boolean, firstTime?: boolean): boolean;
        public applyPermedModifiers(firstTime?: boolean): void;
        public getPrestige(exp: number): number;
        public applyPrestige(): void;
        public addToRollingIncome(amount: any, date: any): void;
    }
}
declare module CityGame {
    class Content {
        public type: any;
        public baseType: string;
        public categoryType: string;
        public id: number;
        public sprites: CityGame.ContentSprite[];
        public cells: CityGame.Cell[];
        public baseCell: CityGame.Cell;
        public size: number[];
        public flags: string[];
        public baseProfit: number;
        public modifiers: any;
        public modifiedProfit: number;
        public player: CityGame.Player;
        constructor(props: {
            cells: CityGame.Cell[];
            type: any;
            player?: CityGame.Player;
            id?: number;
            layer?: string;
        });
        public init(type: any, layer?: string): void;
        public applyModifiers(): void;
        public remove(): void;
    }
}
declare module CityGame {
    interface neighborCells {
        n: Cell;
        e: Cell;
        s: Cell;
        w: Cell;
        ne: Cell;
        nw: Cell;
        se: Cell;
        sw: Cell;
    }
    class Cell {
        public type: any;
        public board: CityGame.Board;
        public sprite: CityGame.Sprite;
        public content: CityGame.Content;
        public undergroundContent: CityGame.Content;
        public baseLandValue: number;
        public landValue: number;
        public gridPos: number[];
        public flags: string[];
        public modifiers: any;
        public landValueModifiers: any;
        public overlay: PIXI.Graphics;
        public overlayColor: number;
        public player: CityGame.Player;
        public neighbors: neighborCells;
        public neighborsWithDiagonals: neighborCells;
        constructor(gridPos: any, type: any, board: any, autoInit?: boolean);
        public init(): void;
        public getScreenPos(container: any): number[];
        public getNeighbors(diagonal?: boolean): neighborCells;
        public getArea(_props: {
            size: number;
            centerSize?: number[];
            anchor?: string;
            excludeStart?: boolean;
        }): Cell[];
        public getDistances(radius: number, centerSize?: number[]): any;
        public replace(type: any): void;
        public changeUndergroundContent(type?: string, update?: boolean): void;
        public changeContent(type: any, update?: boolean, player?: CityGame.Player, checkPlayer?: boolean): void;
        public checkBuildable(type: any, player?: CityGame.Player, checkContent?: boolean): boolean;
        public addPlant(): void;
        public updateCell(): void;
        public addContent(type: any, cells: Cell[], player?: CityGame.Player): CityGame.Content;
        public removeContent(): void;
        public checkIfModifierApplies(modifier: any): boolean;
        public getModifierPolarity(modifier: any): boolean;
        public addModifier(modifier: any, source: any): void;
        public removeModifier(modifier: any, source: any): void;
        public propagateModifier(modifier: any): void;
        public propagateAllModifiers(modifiers: any[]): void;
        public removePropagatedModifier(modifier: any): void;
        public removeAllPropagatedModifiers(modifiers: any[]): void;
        public getValidModifiers(contentType?: any): any;
        public applyModifiersToContent(): void;
        public propagateLandValueModifier(modifier: any): void;
        public removePropagatedLandValueModifier(modifier: any): void;
        public updateLandValue(): void;
        public forEachNeighborWithQualifier(target: Cell, qualifier: (toCheck: Cell) => boolean, operator: (toOperateOn: Cell, directions: string) => void, depth: number): any;
        public setRoadConnections(depth: number): void;
        public setTubeConnections(depth: number): void;
        public addOverlay(color: any, depth?: number): void;
        public removeOverlay(): void;
    }
}
declare class SortedDisplayObjectContainer extends PIXI.DisplayObjectContainer {
    public container: PIXI.DisplayObjectContainer;
    public _sortingIndexes: number[];
    constructor(layers: number);
    public init(): void;
    public incrementIndexes(start: number): void;
    public decrementIndexes(start: number): void;
    public _addChildAt(element: PIXI.DisplayObject, index: number): void;
    public _removeChildAt(element: PIXI.DisplayObject, index: number): void;
}
declare module CityGame {
    module MapGeneration {
        function makeBlankCells(props: {
            width: number;
            height?: number;
        }): string[][];
        function convertCells(cellTypes: string[][], board: CityGame.Board, autoInit: boolean): CityGame.Cell[][];
        function readSavedMap(props: {
            board: any;
            savedCells: any;
        }): void;
        interface ICardinalDirections {
            n: any;
            e: any;
            s: any;
            w: any;
        }
        function generateCellNoise(props: {
            width: number;
            mapHeight?: number;
            coasts?: any;
            amount?: number;
            amountWeights?: number[];
            depth?: number;
            variation?: number;
            baseVariation?: number[];
            yFalloff?: number;
            yFalloffType?: number;
            xCutoff?: number;
            xFalloff?: number;
            xFalloffType?: number;
            xFalloffPerY?: number;
            landThreshhold?: number;
        }): any;
        function applyCoastsToCells(props: {
            cells: string[][];
            primaryType: string;
            subType: string;
            coasts: any;
            offset?: number[];
        }): void;
        function makeRivers(coasts: any, genChance: any, riverProps: any, offset: any, maxCoastsToDrawRiver?: number): any;
        function smoothCells(cells: any, minToChange?: number, radius?: number, times?: number): any;
    }
}
declare module CityGame {
    module CityGeneration {
        interface IExclusionTypes {
            radius: number;
            flags: string[];
        }
        function placeBuilding(board: any, _buildingType: string, includedArea: number, exclusions?: IExclusionTypes[]): any;
        function placeMainSubwayLines(board: any): void;
        function placeStationRoads(board: any): void;
        function placeInitialHousing(board: any): void;
    }
}
declare module CityGame {
    class Board {
        public id: number;
        public name: string;
        public width: number;
        public height: number;
        public totalSize: number;
        public generationCells: string[][];
        public cells: CityGame.Cell[][];
        public mapGenInfo: any;
        public layers: any;
        public population: number;
        constructor(props: {
            width: number;
            height?: number;
            savedCells?: any[][];
            population?: number;
            id?: number;
        });
        public generateMap(): void;
        public generateCity(): void;
        public getCell(toFetch: number[]): CityGame.Cell;
        public getCells(toFetch: number[][]): CityGame.Cell[];
        public destroy(): void;
        public initLayers(): void;
        public addSpriteToLayer(layerToAddTo: string, spriteToAdd: any, gridPos?: number[]): void;
        public removeSpriteFromLayer(layerToRemoveFrom: string, spriteToRemove: any, gridPos?: number[]): void;
    }
}
declare module CityGame {
    class Camera {
        public container: PIXI.DisplayObjectContainer;
        public width: number;
        public height: number;
        public bounds: any;
        public startPos: number[];
        public startClick: number[];
        public currZoom: number;
        public zoomField: any;
        constructor(container: PIXI.DisplayObjectContainer, bound: any);
        public startScroll(mousePos: any): void;
        public end(): void;
        public setBounds(): void;
        public getDelta(currPos: any): number[];
        public move(currPos: any): void;
        public zoom(zoomAmount: number): void;
        public deltaZoom(delta: any, scale: any): void;
        public clampEdges(): void;
    }
}
declare var eventManager: PIXI.EventTarget;
declare module CityGame {
    module Options {
        var drawClickPopups: boolean;
        var autosaveLimit: number;
        var autoSwitchTools: boolean;
    }
}
declare module CityGame {
    class MouseEventHandler {
        public startPoint: number[];
        public currPoint: number[];
        public startCell: number[];
        public currCell: number[];
        public hoverCell: number[];
        public currAction: string;
        public stashedAction: string;
        public selectedCells: CityGame.Cell[];
        public preventingGhost: boolean;
        public camera: CityGame.Camera;
        constructor();
        public preventGhost(delay: number): void;
        public mouseDown(event: any, targetType: string): void;
        public mouseMove(event: any, targetType: string): void;
        public mouseUp(event: any, targetType: string): void;
        public startScroll(event: any): void;
        public startZoom(event: any): void;
        public stageMove(event: any): void;
        public stageEnd(event: any): void;
        public startCellAction(event: any): void;
        public worldMove(event: any): void;
        public worldEnd(event: any): void;
        public hover(event: any): void;
    }
}
declare var keyboardStates: {
    "default": {
        "keydown": {
            "32": () => void;
            "107": () => void;
            "187": () => void;
            "109": () => void;
            "189": () => void;
            "82": () => void;
            "85": (e: any) => void;
            "66": (e: any) => void;
            "67": (e: any) => void;
            "83": (e: any) => void;
        };
    };
};
declare class KeyboardEventHandler {
    public currState: string;
    public statesObj: any;
    public listeners: any;
    constructor(initialState?: string);
    public setState(state: string): void;
    public addEventListeners(state: string): void;
    public removeListeners(): void;
    public handleKeydown(event: any): void;
    public handleKeyup(event: any): void;
}
declare class SpriteHighlighter {
    public currHighlighted: PIXI.Sprite[];
    public currTransparent: PIXI.Sprite[];
    public tintSprites(sprites: PIXI.Sprite[], color: number, shouldGroup?: boolean): void;
    public clearSprites(shouldClear?: boolean): void;
    public clearHighlighted(): void;
    public tintCells(cells: any[], color: number, shouldGroup?: boolean): void;
    public alphaBuildings(cells: any[], value: number): void;
    public clearAlpha(): void;
}
declare module CityGame {
    class UIObject extends PIXI.DisplayObjectContainer {
        public _destroyChildren: boolean;
        public _timeouts: any;
        public _callbacks: any;
        public _delay: number;
        public _lifeTime: number;
        public _parent: PIXI.DisplayObjectContainer;
        constructor(parent: any, destroyChildren?: boolean);
        public start(): UIObject;
        public setParent(parent: PIXI.DisplayObjectContainer): UIObject;
        public delay(time: number): UIObject;
        public lifeTime(time: number): UIObject;
        public addChild(child: any): UIObject;
        public fireCallbacks(id: string): UIObject;
        public remove(): void;
        public onStart(callback: any): UIObject;
        public onAdded(callback: any): UIObject;
        public onComplete(callback: any): UIObject;
        private clearTimeouts();
    }
}
declare module CityGame {
    function makeToolTip(data: any, text: PIXI.Text): PIXI.DisplayObjectContainer;
    function drawPolygon(gfx: PIXI.Graphics, polygon: number[][], lineStyle: any, fillStyle: any): PIXI.Graphics;
    function makeSpeechRect(data: any, text?: PIXI.Text): number[][];
}
declare module CityGame {
    interface IFontDefinition {
        font: string;
        fill: string;
        align: string;
        stroke?: string;
        strokeThickness?: number;
    }
    class UIDrawer {
        public layer: PIXI.DisplayObjectContainer;
        public fonts: {
            [fontName: string]: IFontDefinition;
        };
        public styles: any;
        public textureCache: any;
        public active: CityGame.UIObject;
        public permanentUIObjects: CityGame.UIObject[];
        public buildingTipTimeOut: any;
        constructor();
        public init(): void;
        public removeActive(): void;
        public clearAllObjects(): void;
        public makeCellTooltip(event: any, cell: CityGame.Cell, container: PIXI.DisplayObjectContainer): CityGame.UIObject;
        public makeCellPopup(cell: CityGame.Cell, text: string, container: PIXI.DisplayObjectContainer, fontName?: string): void;
        public makeBuildingTipsForCell(baseCell: CityGame.Cell, delay?: number): void;
        public makeBuildingTips(buildArea: CityGame.Cell[], buildingType: any): void;
        public makeBuildingPlacementTip(cell: CityGame.Cell, type: string, container: PIXI.DisplayObjectContainer): void;
        public makeFadeyPopup(pos: number[], drift: number[], lifeTime: number, content: any, easing?: (k: number) => number): CityGame.UIObject;
        public clearLayer(): void;
    }
}
declare module CityGame {
    function makeLandValueOverlay(board: any): PIXI.DisplayObjectContainer;
}
declare module CityGame {
    class WorldRenderer {
        public layers: any;
        public renderTexture: PIXI.RenderTexture;
        public worldSprite: PIXI.Sprite;
        public zoomLevel: number;
        public mapmodes: {
            default: {
                layers: {
                    type: string;
                }[];
            };
            landValue: {
                layers: {
                    type: string;
                }[];
            };
            underground: {
                layers: {
                    type: string;
                }[];
                properties: {
                    offsetY: number;
                };
            };
        };
        public currentMapmode: string;
        constructor(width: any, height: any);
        public addEventListeners(): void;
        public initContainers(width: any, height: any): void;
        public initLayers(): void;
        public clearLayers(): void;
        public setBoard(board: CityGame.Board): void;
        public changeZoomLevel(level: any): void;
        public setMapmode(newMapmode: string): void;
        public changeMapmode(newMapmode: string): void;
        public render(clear?: boolean): void;
    }
}
declare class SpriteBlinker extends SpriteHighlighter {
    public delay: number;
    public color: number;
    public repeat: number;
    public toBlink: {
        [key: string]: PIXI.Sprite[];
    };
    public idGenerator: number;
    private blinkFunctions;
    private onRemoveCallbacks;
    private intervalFN;
    private blink;
    private clearFN;
    constructor(delay: number, color: number, repeat: number, autoStart?: boolean);
    public getToBlink(id?: number): any[];
    private makeBlinkFunctions();
    public addCells(cells: any[], onRemove?: any, id?: number): number;
    public removeCells(id: number): number;
    public start(): SpriteBlinker;
    public pause(): SpriteBlinker;
    public stop(): SpriteBlinker;
}
declare module CityGame {
    module Actions {
        function buyCell(props: {
            gridPos: number[];
            boardId: string;
            playerId: string;
            employeeId: string;
            finishedOn?: number;
        }): void;
        function recruitEmployee(props: {
            playerId: string;
            employeeId: string;
            finishedOn?: number;
        }): void;
        function constructBuilding(props: {
            gridPos: number[];
            boardId: string;
            buildingType: string;
            playerId: string;
            employeeId: string;
            finishedOn?: number;
        }): void;
        function getActionTime(skills: number[], base: number): {
            approximate: number;
            actual: number;
        };
        function getActionCost(skills: number[], base: number): {
            approximate: number;
            actual: number;
        };
    }
}
declare module CityGame {
    module UIComponents {
        /**
        * props:
        *   player
        *   buildableTypes
        */
        var SideMenuBuildings: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var SideMenuZoom: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var SideMenuMapmode: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var SideMenuSave: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var SideMenuStats: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var SideMenuTools: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var SideMenuModifierButton: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var SideMenu: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var Draggable: {
            handleDragStart: (e: any) => void;
            handleDrag: (e: any) => void;
            handleDragEnd: (e: any) => void;
            componentDidMount: () => void;
        };
    }
}
declare module CityGame {
    module UIComponents {
        var SplitMultilineText: {
            splitMultilineText: (text: any) => any;
        };
    }
}
declare module CityGame {
    module UIComponents {
        /**
        * props:
        *   listItems
        *   initialColumns
        *
        * state:
        *   selected
        *   columns
        *   sortBy
        *
        * children:
        *   listelement:
        *     key
        *     tr
        *     getData()
        *
        *  columns:
        *    props (classes etc)
        *    label
        *    sorting (alphabet, numeric, null)
        *    title?
        */
        var List: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var ModifierList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var StatList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var EmployeeList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var Stats: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var OptionList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var OptionsPopup: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var Notifications: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var Changelog: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module CityGame {
    module UIComponents {
        var Stage: React.ReactComponentFactory<{
            fullScreenPopups: {
                stats: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
                options: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
                changelog: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
            };
        }, React.ReactComponent<{
            fullScreenPopups: {
                stats: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
                options: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
                changelog: () => React.ReactComponent<React.HTMLGlobalAttributes, void>;
            };
        }, {}>>;
    }
}
declare module CityGame {
    class ReactUI {
        public idGenerator: number;
        public popups: {
            [id: number]: {
                type: string;
                props: any;
                zIndex: number;
            };
        };
        public notifications: any[];
        public topZIndex: number;
        public stage: any;
        public frameImages: {
            [id: string]: HTMLImageElement;
        };
        public icons: any;
        public player: CityGame.Player;
        public updateInterval: any;
        constructor(player: CityGame.Player, frameImages: {
            [id: string]: HTMLImageElement;
        });
        public init(): void;
        public addEventListeners(): void;
        public makePopup(type: string, props: {
            employees?: {
                [key: string]: CityGame.Employee;
            };
            player?: CityGame.Player;
            text?: any;
            onOk?: any;
            okBtnText?: string;
            onClose?: any;
            closeBtnText?: string;
            relevantSkills?: string[];
            action?: any;
        }): void;
        public makeEmployeeActionPopup(props: any): void;
        public makeInfoPopup(props: any): void;
        public makeLoadPopup(): void;
        public makeSavePopup(): void;
        public makeModifierPopup(props: {
            player: CityGame.Player;
            text?: any;
            modifierList?: any[];
            onOk?: any;
            onClose?: any;
            okBtnText?: string;
            excludeCost?: boolean;
        }): void;
        public makeRecruitPopup(props: {
            player: CityGame.Player;
        }): void;
        public makeRecruitCompletePopup(props: {
            recruitingEmployee?: CityGame.Employee;
            employees: {
                [key: string]: CityGame.Employee;
            };
            player: CityGame.Player;
            text?: any;
            delay?: number;
        }): void;
        public makeCellBuyPopup(props: {
            player: CityGame.Player;
            cell: any;
            onOk?: any;
        }): void;
        public makeConfirmPopup(props: {
            text: any;
            onOk: any;
            okBtnText?: string;
            onClose?: any;
            closeBtnText?: string;
        }): void;
        public makeBuildingSelectPopup(props: {
            player: CityGame.Player;
            onOk: any;
        }): void;
        public makeBuildingConstructPopup(props: {
            player: CityGame.Player;
            buildingTemplate: any;
            cell: any;
            onOk?: any;
            text?: any;
        }): void;
        public makeInputPopup(props: {
            text: any;
            onOk: (string: any) => any;
            okBtnText?: string;
            onClose: any;
            closeBtnText?: string;
        }): void;
        public makeNotification(props: {
            onOk: any;
            icon: string;
            timeout?: number;
            id?: number;
            onClose?: any;
        }): void;
        public removeNotification(id: any): void;
        public incrementZIndex(key?: any): number;
        public destroyPopup(key: any, callback?: any): void;
        public closeTopPopup(): void;
        public clear(): void;
        public clearNotifications(): void;
        public clearAllPopups(): void;
        public updateReact(): void;
    }
}
declare module CityGame {
    /**
    * @class Timer
    * @classdesc Timing module
    * @memberof CityGame
    *
    * @param    autostart      {boolean}
    *
    * @property startTime      First start
    * @property totalTime      Time since clock first started
    * @property runningTime    Time clock has been running since start
    * @property deltaTime      Time since last deltaTime call or start in ms
    * @property _runStartTime  Time clock last started running
    * @property _previousTime  Same as delta
    *
    */
    class Timer {
        public autoStart: any;
        public startTime: number;
        public totalTime: number;
        public deltaTime: number;
        public runningTime: number;
        private _runStartTime;
        private _previousTime;
        public running: boolean;
        public getTime: () => number;
        constructor(autoStart?: any);
        /**
        * @method CityGame.Timer#start
        */
        public start(): void;
        /**
        * @method CityGame.Timer#stop
        */
        public stop(): void;
        /**
        * @method CityGame.Timer#getTotalTime
        */
        public getTotalTime(): number;
        /**
        * @method CityGame.Timer#getRunningTime
        */
        public getRunningTime(): number;
        /**
        * @method CityGame.Timer#getDelta
        */
        public getDelta(): number;
    }
}
declare module CityGame {
    class System {
        public systemsManager: CityGame.SystemsManager;
        public activationRate: number;
        public lastTick: number;
        public nextTick: number;
        public activate(any: any): void;
        constructor(activationRate: number, currTick: number);
        public updateTicks(currTick: number): void;
        public tick(currTick: number): void;
    }
}
declare module CityGame {
    module Systems {
        class AutosaveSystem extends CityGame.System {
            constructor(activationRate: number, systemsManager: CityGame.SystemsManager);
            public activate(currTick: number): void;
        }
    }
}
declare module CityGame {
    module Systems {
        interface IDateObj {
            year: number;
            month: number;
            day: number;
        }
        class DateSystem extends CityGame.System {
            public year: number;
            public month: number;
            public day: number;
            public dateElem: HTMLElement;
            public onDayChange: {
                (): any;
            }[];
            public onMonthChange: {
                (): any;
            }[];
            public onYearChange: {
                (): any;
            }[];
            constructor(activationRate: number, systemsManager: CityGame.SystemsManager, dateElem: HTMLElement, startDate?: IDateObj);
            public activate(): void;
            public incrementDate(): void;
            public calculateDate(): void;
            public fireCallbacks(targets: {
                (): any;
            }[], date: number): void;
            public getDate(): IDateObj;
            public setDate(newDate: IDateObj): void;
            public toString(): string;
            public updateDate(): void;
        }
    }
}
declare module CityGame {
    module Systems {
        class DelayedActionSystem extends CityGame.System {
            public callbacks: any;
            constructor(activationRate: number, systemsManager: CityGame.SystemsManager);
            public addEventListeners(): void;
            public addAction(action: any): void;
            public activate(currTick: number): void;
            public reset(): void;
        }
    }
}
declare module CityGame {
    module Systems {
        class ProfitSystem extends CityGame.System {
            public players: CityGame.Player[];
            public targetTypes: string[];
            constructor(activationRate: number, systemsManager: CityGame.SystemsManager, players: CityGame.Player[], targetTypes: string[]);
            public activate(): void;
        }
    }
}
declare module CityGame {
    /**
    * @class SystemsManager
    * @classdesc
    *
    * @param    tickTime    {number}
    *
    * @property systems     List of systems registered with this
    * @property timer
    * @property tickTime    Amount of time for single tick in ms
    * @property tickNumber  Counter for total ticks so far
    * @property accumulated Amount of time banked towards next tick
    *
    */
    class SystemsManager {
        public systems: {
            dailyProfitSystem: CityGame.Systems.ProfitSystem;
            delayedAction: CityGame.Systems.DelayedActionSystem;
            autosave: CityGame.Systems.AutosaveSystem;
            date: CityGame.Systems.DateSystem;
        };
        public timer: CityGame.Timer;
        public tickTime: number;
        public tickNumber: number;
        public accumulated: number;
        public paused: boolean;
        public speed: number;
        public speedBeforePausing: number;
        constructor(tickTime: number, players: CityGame.Player[]);
        public init(players: CityGame.Player[]): void;
        public makeSystems(players: CityGame.Player[]): void;
        public addEventListeners(): void;
        public pause(): void;
        public unPause(newSpeed?: number): void;
        public togglePause(): void;
        public setSpeed(speed: number): void;
        public update(): void;
        public tick(): void;
    }
}
declare module CityGame {
    class Tool {
        public type: string;
        public selectType: CityGame.ISelectionType;
        public tintColor: number;
        public activateCost: number;
        public mapmode: string;
        public continuous: boolean;
        public tempContinuous: boolean;
        public button: HTMLInputElement;
        public activate(target: CityGame.Cell[]): void;
        public onChange(): void;
        public onActivate(target: CityGame.Cell, props?: any): void;
        public onHover(targets: CityGame.Cell[]): void;
        public onFinish(): void;
    }
}
declare module CityGame {
    module Tools {
        class NothingTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class WaterTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class GrassTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class SandTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class SnowTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class RemoveTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class PlantTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class HouseTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class RoadTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class SubwayTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class ClickTool extends CityGame.Tool {
            constructor();
            public onChange(): void;
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class BuyTool extends CityGame.Tool {
            constructor();
            public onActivate(target: CityGame.Cell): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class BuildTool extends CityGame.Tool {
            public selectedBuildingType: any;
            public canBuild: boolean;
            public mainCell: CityGame.Cell;
            public continuous: boolean;
            public timesTriedToBuiltOnNonOwnedPlot: number;
            public ghostSprites: {
                sprite: PIXI.Sprite;
                pos: number[];
            }[];
            constructor();
            public setDefaults(): void;
            public changeBuilding(buildingType: any, continuous?: boolean): void;
            public activate(selectedCells: any[]): void;
            public onHover(targets: CityGame.Cell[]): void;
            public onFinish(): void;
            public clearEffects(): void;
            public clearGhostBuilding(): void;
        }
    }
}
declare module CityGame {
    module Tools {
        class SellTool extends CityGame.Tool {
            constructor();
            public activate(selectedCells: any[]): void;
            public onActivate(target: CityGame.Cell, props?: any): void;
        }
    }
}
declare module CityGame {
    class Game {
        public boards: CityGame.Board[];
        public activeBoard: CityGame.Board;
        public indexOfActiveBoard: number;
        public tools: any;
        public activeTool: CityGame.Tool;
        public mouseEventHandler: CityGame.MouseEventHandler;
        public keyboardEventHandler: KeyboardEventHandler;
        public spriteHighlighter: SpriteHighlighter;
        public stage: PIXI.Stage;
        public renderer: any;
        public layers: any;
        public uiDrawer: CityGame.UIDrawer;
        public reactUI: CityGame.ReactUI;
        public systemsManager: CityGame.SystemsManager;
        public worldRenderer: CityGame.WorldRenderer;
        public players: {
            [id: string]: CityGame.Player;
        };
        public toolCache: any;
        public editModes: string[];
        public currentMode: string;
        public frameImages: {
            [id: string]: HTMLImageElement;
        };
        constructor();
        public init(): void;
        public initContainers(): void;
        public initTools(): void;
        public bindElements(): void;
        public bindRenderer(): void;
        public updateBoardSelect(): void;
        public updateWorld(clear?: boolean): void;
        public resize(): void;
        public changeTool(tool: any): void;
        public changeActiveBoard(index: number): void;
        public destroyAllBoards(): void;
        public getCell(props: {
            gridPos: number[];
            boardId: number;
        }): CityGame.Cell;
        public save(name: string): void;
        public autosave(): void;
        public load(name: string): void;
        public saveBoards(boardsToSave: CityGame.Board[]): any[];
        public loadBoards(data: any): void;
        public savePlayer(player: CityGame.Player): any;
        public loadPlayer(data: any): void;
        public saveOptions(): void;
        public loadOptions(): void;
        public saveActions(system: CityGame.Systems.DelayedActionSystem): any[];
        public loadActions(toLoad: any[]): void;
        public prestigeReset(onReset: any): void;
        public render(): void;
        public updateSystems(): void;
        public resetLayers(): void;
        public switchEditingMode(newMode: string): void;
    }
}
declare var WebFont: any;
declare var WebFontConfig: any;
declare module CityGame {
    class Loader {
        public loaded: any;
        public game: any;
        public startTime: number;
        public spriteImages: {
            [id: string]: HTMLImageElement;
        };
        constructor(game: any);
        public loadFonts(): void;
        public loadSprites(): void;
        public checkLoaded(): void;
    }
}
declare module CityGame {
    var TILE_WIDTH: number, TILE_HEIGHT: number, SCREEN_WIDTH: number, SCREEN_HEIGHT: number, SPRITE_HEIGHT: number, TILES: number, WORLD_WIDTH: number, WORLD_HEIGHT: number, ZOOM_LEVELS: number[], AMT_OF_BOARDS: number;
    var game: Game;
    var loader: Loader;
}
