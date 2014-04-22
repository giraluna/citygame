/// <reference path="eventlistener.d.ts" />
declare var keyboardStates: {
    "default": {
        "keydown": {
            "32": () => void;
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
