/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../../lib/pixi.d.ts" />
/// <reference path="../../../data/js/cg.d.ts" />
/// <reference path="../../js/player.d.ts" />
/// <reference path="../../js/actions.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
/// <reference path="employeelist.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="employeeaction.d.ts" />
/// <reference path="modifierpopup.d.ts" />
/// <reference path="employeeactionpopup.d.ts" />
/// <reference path="inputpopup.d.ts" />
/// <reference path="actioninfo.d.ts" />
/// <reference path="stage.d.ts" />
declare class ReactUI {
    public idGenerator: number;
    public popups: {
        [id: number]: {
            type: string;
            props: any;
            zIndex: number;
        };
    };
    public topZIndex: number;
    public stage: any;
    public frameImages: {
        [id: string]: HTMLImageElement;
    };
    public player: Player;
    public updateInterval: any;
    constructor(player: Player, frameImages: {
        [id: string]: HTMLImageElement;
    });
    public init(): void;
    public addEventListeners(): void;
    public makePopup(type: string, props: {
        employees?: {
            [key: string]: Employee;
        };
        player?: Player;
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
        player: Player;
        text?: any;
        modifierList?: any[];
        onOk?: any;
        onClose?: any;
        okBtnText?: string;
        excludeCost?: boolean;
    }): void;
    public makeRecruitPopup(props: {
        player: Player;
    }): void;
    public makeRecruitCompletePopup(props: {
        recruitingEmployee?: Employee;
        employees: {
            [key: string]: Employee;
        };
        player: Player;
        text?: any;
        delay?: number;
    }): void;
    public makeCellBuyPopup(props: {
        player: Player;
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
        player: Player;
        onOk: any;
    }): void;
    public makeBuildingConstructPopup(props: {
        player: Player;
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
    public incrementZIndex(key?: any): number;
    public destroyPopup(key: any, callback?: any): void;
    public closeTopPopup(): void;
    public clearAllPopups(): void;
    public updateReact(): void;
}
