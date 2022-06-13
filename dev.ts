import { createApp, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/reactivity/lib/effect";


var root = {
    components: {
        hello: {
            template: `
            <h1 @click="$emit('add')"> 子组件 </h1>
            `,
            emits: ['add'],
            create($) {
                console.log(this);
            }
        }
    },
    template: `
        <h1 @click="add"> {{x}} </h1>
        <hello @add>
    `,
    create() {
        var x = ref(666)
        function add() {
            x.value++
        }
        return {
            x,
            add,
        }
    }
}

var app = createApp(root)


console.log('app', app);
var instance = app.mount('#app')

var scope = reactive({
    a: 123,
    b: 465
})

console.log(scope);

Object.defineProperty(scope, 'x', {
    configurable: false,
    enumerable: false,
    get() {
        return 
    }
})

window.scope = scope