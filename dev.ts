import { createApp, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useColor, useNumber, useString } from "./packages/reactivity/lib/useData";

var root = {
    components:{
        hello:{
            emits:['submit'],
            template:`123456`
        }
    },
    template: `
        <hello @submit:aa:bb:cc.xx.yy.zz="666">
    `,
    create($) {

    }
}

var app = createApp(root)


console.log('app', app);
var instance = app.mount('#app')
console.log(instance);


