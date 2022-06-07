import { createApp, hasOwn, isReactive, isRef, onMounted } from "./packages/core";

var root = {
    template: `
        <button @click="count++">
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

var m = new Map()

m.set(1, 1)

var p = readonly(m)

window.p = p


