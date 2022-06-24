import { createApp, h, hasOwn, isReactive, isRef, onCreated, onMounted, onSet, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";
import { useNumber } from "@crush/reactivity/lib/custom/number";
import { watchRef } from "@crush/reactivity/lib/watchRef";
import { shallowWatchReactive, watchReactive } from "@crush/reactivity/lib/watchReactive";

var p = reactive({
    x: 666,
    y: {
        z: 666
    }
})

window.p = p

watchReactive(p, () => {
    console.log('ok');
})





















var jerry = {
    template: `jerry`,
    create() {

    }
}

var root = {
    template: /*html*/`
        <style>
            .box{
                width:500px;
                height:30px;
                background-color:red;
                margin:20px;
            }
            .transition{
                &-enter{
                    transition :all 2s;
                    &-from{
                        background-color:black;
                        width:800px;
                    }
                    &-to{
                        background-color:#666;
                        width:100px;
                    }
                }
                &-leave{
                    transition :all 2s;
                    &-from{
                        background-color:green;
                        width:800px;
                    }
                    &-to{
                        background-color: blue ;
                        width:100px;
                    }
                }
            }
        </style>
        <button @click="add"> + </button>
        <button @click="sub"> - </button>
        <transition-group>
            <div .box  --for="i in num">{{i}}</div>
        </transition-group>
    `,
    create() {
        var num = useNumber(5)
        function add() {
            num.plus()
        }
        function sub() {
            num.minus()
        }
        return {
            num, add, sub
        }
    },
    mounted() {
        var box = document.querySelector('.box')
    }
}

var app = createApp(root)

console.log('app', app);
// var instance = app.mount('#app')

