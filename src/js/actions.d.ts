/// <reference path="employee.d.ts" />
/// <reference path="player.d.ts" />
/// <reference path="eventlistener.d.ts" />
declare module actions {
    function buyCell(player: Player, cell: any, employee: Employee): void;
    function getActionTime(skill: any, baseDuration: any): {
        approximate: number;
        actual: number;
    };
}
