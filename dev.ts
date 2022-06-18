import { createApp, h, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useColor, useNumber, useString, useBoolean } from "./packages/reactivity/lib/useData";



var root = {
    components:{
        tom:{
            template:`
            <h6> tom </h6>
            <slot>`
        }
    },
    template: `
        <button @click="add"> {{num}} </button>
        <tom>
            {{num}}
        </tom>
    `,
    create() {
        var num = useNumber(30)
        function add() {
            num.plus()
        }
        return {
            num, add
        }
    },
    mounted() {
        var box = document.querySelector('.box')
    }
}

var app = createApp(root)

console.log('app', app);
var instance = app.mount('#app')
console.log(instance);

var c = ref(1)
window.c = c

var c1 = computed(() => c.value*2)
var c2 = computed(() => c1.value*2)
var c3 = computed(() => c2.value*2)

effect(() => {
    console.log(c3.value);
})