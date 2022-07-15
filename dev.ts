import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h } from "./packages/core";

import { Nodes } from '@crush/const'

const loading = {
    template: `
        ...
    `
}

const error = {
    template: `加载失败`
}

const loader = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('cuo cuo')
        }, 3000);
    })
}

let tom = defineAsyncComponent({
    loader,
    loading,
    error,
    onError() { }
})



var app = createApp(tom)
console.log(app);



app.mount('#app')
