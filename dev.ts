import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted } from "./packages/core";



let tom = {
    template: ` 我是汤姆猫 `,
    create(){
        console.log(this.$instance);
    }
}



function jerry() {
    return h(tom)
}


var app = createApp({
    components: {
        jerry
    },
    template:/*html*/`
        <jerry>
    `
})
console.log(app);


app.mount('#app')
