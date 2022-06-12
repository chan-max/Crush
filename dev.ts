import { createApp, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement, functionalComponent } from "./packages/core";


var root = {
    template: `
        <button @click="add"> {{count}} </button>
    `,
    create($) {
        $.count = 0
        $.add= () => {
            $.count++
        }
    }
}

var app = createApp(root)


console.log('app', app);
var instance = app.mount('#app')
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/reactivity/lib/effect";




