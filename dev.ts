import { createApp, h, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useColor, useNumber, useString, useBoolean } from "./packages/reactivity/lib/useData";

var root = {
    components: {
        hello: (props) => h('button', null, props.num)
    },
    template: `
        <style>
        <button @click="add"> {{num}} </button>
        <hello $num="num" --if="num%2===0">
    `,
    create() {
        var num = useNumber(666)
        function add() {
            num.plus()
        }
        return {
            num, add
        }
    }
}

var app = createApp(root)

console.log('app', app);
var instance = app.mount('#app')
console.log(instance);