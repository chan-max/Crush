import { createApp, doKeyframesAnimation, getElementStyle, h, hasOwn, important, isReactive, isRef, markRaw, mountDeclaration, onCreated, onMounted, onSet, removeElement, setElementStyleDeclaration } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";
import { useNumber } from "@crush/reactivity/lib/custom/number";
import { watchRef } from "@crush/reactivity/lib/watchRef";
import { shallowWatchReactive, watchReactive } from "@crush/reactivity/lib/watchReactive";
import { useBoolean } from "@crush/reactivity/lib/custom/boolean";
import { useRefState } from "@crush/core/lib/instance/refState";
import { createRouter } from "./packages/router/lib/router";



var root = {

    template: /*html*/`
        666
    `,
    create(scope) {
        debugger
        console.log(scope.$router);
    },
}



var app = createApp(root)

app.use(router)

console.log('app', app);
var instance = app.mount('#app')


