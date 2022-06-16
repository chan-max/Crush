import { createApp, h, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useColor, useNumber, useString, useBoolean } from "./packages/reactivity/lib/useData";

var root = {
    template: `
        <style>
            .box{
                width:200px;
                height:200px;
                background-color:black;
            }
            .test{
                &-enter-form{
                    color:red;
                }
                &-enter-active{
                    color:red;
                }
                &-enter-to{
                    color:red;
                }
                &-leave-form{
                    color:red;
                }
                &-leave-active{
                    color:red;
                }
                &-leave-to{
                    color:red;
                }
            }
        </style>
        <button @click="add"> {{num}} </button>
        <div .box  --if="num%2 === 0" --transition="'test'">
        </div>
    `,
    create() {
        var num = useNumber(30)
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