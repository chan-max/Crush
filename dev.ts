import { createApp, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/reactivity/lib/effect";


var root = {
    components: {
        hello: {
            template: `
            <h1> 子组件 </h1>
            `,
            create() {

            }
        }
    },
    template: `
        <h1 @click="add"> {{x}} </h1>
    `,
    create() {
        var x = ref(666)
        function add(){
            x.value++
        }
        return {
            x,
            add
        }
    }
}

var app = createApp(root)


console.log('app', app);
var instance = app.mount('#app')

