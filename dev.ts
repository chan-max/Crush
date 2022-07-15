import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h } from "./packages/core";

import {Nodes} from '@crush/const'


let root = defineAsyncComponent({
    loader: () => import('./test.js')
})

var app = createApp(root)
console.log(app);



app.mount('#app')
