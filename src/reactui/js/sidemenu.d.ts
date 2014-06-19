/// <reference path="../../../lib/react.d.ts" />
/// <reference path="sidemenubuildings.d.ts" />
/// <reference path="sidemenuzoom.d.ts" />
/// <reference path="sidemenumapmode.d.ts" />
/// <reference path="sidemenusave.d.ts" />
/// <reference path="sidemenustats.d.ts" />
/// <reference path="sidemenutools.d.ts" />
declare module UIComponents {
    var SideMenu: React.ReactComponentFactory<{
        selectedTool: any;
    }, React.ReactComponent<{
        selectedTool: any;
    }, {}>>;
}
