/// <reference path="employee.d.ts" />
/// <reference path="player.d.ts" />
/// <reference path="eventlistener.d.ts" />
/// <reference path="spriteblinker.d.ts" />
declare module actions {
    function buyCell(player: Player, cell: any, employee: Employee): void;
    function getActionTime(skills: number[], base: number): {
        approximate: number;
        actual: number;
    };
    function getActionCost(skills: number[], base: number): {
        approximate: number;
        actual: number;
    };
}
