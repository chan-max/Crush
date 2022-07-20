import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted, watchTargetKey } from "./packages/core";


var x = ref(0)
window.x = x

let root = {
    template: /*html*/`
        
    `,
    create({ $self, $watch }: any) {
    }
}

var app = createApp(root)
console.log(app);



app.mount('#app')


function onHashChange(handler: any) {

}



