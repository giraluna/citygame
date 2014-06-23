/// <reference path="../../../lib/react.d.ts" />
/// <reference path="splitmultilinetext.d.ts" />
declare module UIComponents {
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
    var List: React.ReactComponentFactory<{
        columns: any;
        selected: any;
        sortBy: {
            column: any;
            order: any;
            currColumnIndex: any;
        };
    }, React.ReactComponent<{
        columns: any;
        selected: any;
        sortBy: {
            column: any;
            order: any;
            currColumnIndex: any;
        };
    }, {}>>;
}
