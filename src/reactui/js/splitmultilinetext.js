/// <reference path="../../lib/react.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SplitMultilineText = {
        splitMultilineText: function (text) {
            if (Array.isArray(text)) {
                var returnArr = [];
                for (var i = 0; i < text.length; i++) {
                    returnArr.push(text[i]);
                    returnArr.push(React.DOM.br(null));
                }
                return returnArr;
            } else {
                return text;
            }
        }
    };
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=splitmultilinetext.js.map
