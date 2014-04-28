/// <reference path="../../../lib/react.d.ts" />
declare module UIComponents {
    var Employee: React.ReactComponentFactory<{
        employee: {
            name: string;
            skills: {
                "neg": number;
                "man": number;
                "rec": number;
                "con": number;
            };
        };
    }, React.ReactComponent<{
        employee: {
            name: string;
            skills: {
                "neg": number;
                "man": number;
                "rec": number;
                "con": number;
            };
        };
    }, {}>>;
}
