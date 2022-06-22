import { createApp, h, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useColor, useNumber, useString, useBoolean } from "./packages/reactivity/lib/useData";
import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";


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
        <button @click="add"> {{num}} </button>
        <transition-group>
            <div .box  --for="i in num">{{i}}</div>
        </transition-group>
    `,
    create() {
        var num = useNumber(5)
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
