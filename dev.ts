import { createApp, doKeyframesAnimation, getElementStyle, h, hasOwn, important, isReactive, isRef, markRaw, mountDeclaration, onCreated, onMounted, onSet, removeElement, setElementStyleDeclaration } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";
import { useNumber } from "@crush/reactivity/lib/custom/number";
import { watchRef } from "@crush/reactivity/lib/watchRef";
import { shallowWatchReactive, watchReactive } from "@crush/reactivity/lib/watchReactive";
import { useBoolean } from "@crush/reactivity/lib/custom/boolean";
import { useRefState } from "@crush/core/lib/instance/refState";
import { createRouter } from "./packages/router/lib/router";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";

var app = createApp({
    container: '#app',
})

console.log(app);

app.render({
    template:/*html*/`
    <style>
        .transition{
            &-enter{
                transition:all 4s;
                &-from{
                    background-color:#ff0000;
                }
                &-to{
                    background-color:#aa0000;
                }
            }
            &-leave{
                transition:all 2s;
                &-from{
                    background-color:#00ff00;
                }
                &-to{
                    background-color:#00aa00;
                }
            }
        }
        .box{
            width:200px;
            height:200px;
            border: 5px solid black;
        }
    </style>
    <button @click="setCount( count + 3 )"> {{count}} </button>
    <div .box  --transition="" --show="count %2 == 0">
        666
    </div>
    `,
    create() {
        let { count, setCount, onCountChange } = useRefState(0)
    }
})



