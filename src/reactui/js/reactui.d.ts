/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../../lib/pixi.d.ts" />
/// <reference path="../../js/player.d.ts" />
/// <reference path="../../js/actions.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
/// <reference path="employeelist.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="cellinfo.d.ts" />
/// <reference path="popup.d.ts" />
/// <reference path="stage.d.ts" />
declare class ReactUI {
    public idGenerator: number;
    public popups: any[];
    public topZIndex: number;
    public stage: any;
    public player: Player;
    constructor(player: Player);
    public init(): void;
    public addEventListeners(): void;
    public makePopup(props: {
        key: number;
        text?: string;
        content?: any;
        buttons?: any[];
    }): void;
    public makeInfoPopup(props: {
        text: string;
        okText?: string;
    }): void;
    public makeConfirmPopup(props: {
        text: string;
        onOk: any;
        okText?: string;
        onCancel?: any;
        cancelText?: string;
    }): void;
    public makeCellBuyPopup(props: {
        player: Player;
        cell: any;
    }): void;
    public incrementZIndex(): number;
    public destroyPopup(key: any, callback: any): void;
    public updateReact(): void;
}
