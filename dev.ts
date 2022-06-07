import { createApp, hasOwn, isReactive, isRef, onMounted } from "./packages/core";

var root = {
    template: `
        <button >
            {{count}}
        </button>
    `,
    create($) {
        $.count = 0
        $.log = () => {
            console.log(666);
        }
        console.log(this);
    },
}



var app = createApp(root)

console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref} from "./packages/reactivity/lib/ref";



var c = computed(() => 999)

window.c = c

