(function () {
    'use strict';

    function _createStyleRule(selector, declaration) {
        return {
            selector: selector,
            declaration: declaration,
            type: 1,
            ref: null
        };
    }

    new Proxy({}, { get: function () { return Symbol(); } });
    document.querySelector('#s') || document.createElement('style');
    var r = _createStyleRule('body', { 'color': 'red', 'background-color': 'blue' });
    var cssRender = function () {
        return [r];
    };
    window.s = cssRender();
    // renderStyle(style,cssRender())
    // renderStyle(style,cssRender())

}());
