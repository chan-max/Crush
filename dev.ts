import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted } from "./packages/core";

let teleport = {
    components: {
        tom({ x }) {
            return h('h1', null, x)
        }
    },
    template:/*html*/`
        <style>
            #teleport-container1 *{
                color:red;
            }
            #teleport-container2 *{
                color:yellow;
            }
        </style>
        <button @click="count++">{{count}}</button>
        <div #teleport-container1></div>
        <div #teleport-container2></div>
        <teleport to="#teleport-container1" $disabled="count%2 === 0">
            <h1> 111 </h1>
            <h2> 222 </h2>
        </teleport>
    `,
    create({ $self }: any) {
        $self.count = 0
    }
}


var app = createApp(teleport)
console.log(app);


app.mount('#app')
