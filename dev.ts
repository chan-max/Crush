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

var arr = reactive([1, 2, 3, 4, 5, 6])

effect(() => {
    console.log(arr);
})

var root = {
    directives:{
        x:{
            beforeUpdate(a,b,c,d){
                debugger
            }
        }
    },
    components: {
        tom: {
            props:['y'],
            template: `
                <h1 @click="add"> tom{{x}}  props: {{y}}</h1>

            `,
            create() {
                this.x = 0
                this.add = () => this.x++
            }
        }
    },
    template: /*html*/`
        <button @click="add"> y {{y}} </button>
        <tom --x $y>
    `,
    create() {
        this.y = 666
        this.add = () => this.y++
    },
}



var app = createApp(root)

console.log('app', app);
var instance = app.mount('#app')



