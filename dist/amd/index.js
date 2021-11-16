define(['exports'], function (exports) { 'use strict';

    class appModule {
    }
    function createModule() {
        return new appModule();
    }

    exports.createModule = createModule;

    Object.defineProperty(exports, '__esModule', { value: true });

});
