/// <reference path="employee.d.ts" />
/// <reference path="player.d.ts" />
/// <reference path="utility.d.ts" />
/// <reference path="eventlistener.d.ts" />
/// <reference path="spriteblinker.d.ts" />
/// <reference path="../../data/js/cg.d.ts" />
declare module actions {
    function buyCell(props: {
        gridPos: number[];
        boardId: string;
        playerId: string;
        employeeId: string;
        finishedOn?: number;
    }): void;
    function recruitEmployee(player: Player, employee: Employee): void;
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
