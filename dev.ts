import { createApp, h, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useColor, useNumber, useString, useBoolean } from "./packages/reactivity/lib/useData";

const transition = (props,slots) => {
    var res = slots.default()
    return res
}

var root = {
    components: {
        transition
    },
    template: `
        <style>
            .box{
                width:200px;
                height:200px;
                background-color:black;
            }
            .transition{
                &-enter{
                    animation:rollIn 1s;
                }
                &-leave{
                    animation:rollOut 1s;
                }
            }
        </style>
        <button @click="add"> {{num}} </button>
        <div .box  --if="num%2 === 0" --transition=""></div>
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