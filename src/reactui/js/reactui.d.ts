/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../../lib/pixi.d.ts" />
/// <reference path="../../js/player.d.ts" />
/// <reference path="../../js/actions.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
/// <reference path="employeelist.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="employeeaction.d.ts" />
/// <reference path="employeeactionpopup.d.ts" />
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
    public player: Player;
    constructor(player: Player);
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
    }): void;
    public makeCellBuyPopup(props: {
        player: Player;
        cell: any;
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
        cell: any;
    }): void;
    public makeBuildingConstructPopup(props: {
        player: Player;
        buildingTemplate: any;
        cell: any;
        text?: any;
    }): void;
    public incrementZIndex(key?: any): number;
    public destroyPopup(key: any, callback?: any): void;
    public closeTopPopup(): void;
    public updateReact(): void;
}
