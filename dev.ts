import { createApp, doKeyframesAnimation, getElementStyle, h, hasOwn, important, isReactive, isRef, mountDeclaration, onCreated, onMounted, onSet, removeElement, setElementStyleDeclaration } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";
import { useNumber } from "@crush/reactivity/lib/custom/number";
import { watchRef } from "@crush/reactivity/lib/watchRef";
import { shallowWatchReactive, watchReactive } from "@crush/reactivity/lib/watchReactive";
import { useBoolean } from "@crush/reactivity/lib/custom/boolean";

var obj = reactive({ a: 66, b: { c: 798456 } })

var root = {
    components: {
        tom: { template: `tom` }
    },
    template: /*html*/`
        <button @click="add" ref="btn"> y {{y}} </button>
        <tom ref="tom" x="666">
    `,
    create() {
        this.y = 666
        this.add = () => this.y++
    },
}



var app = createApp(root)

console.log('app', app);
var instance = app.mount('#app')



