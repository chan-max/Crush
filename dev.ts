import { createApp, doCSSAnimation, getElementStyle, h, hasOwn, important, isReactive, isRef, markRaw, mountDeclaration, onCreated, onMounted, onSet, removeElement, setElementStyleDeclaration } from "./packages/core";
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

var app = createApp({ container: '#app', })

console.log(app);



app.mount({
    template:/*html*/`
    <style> 
        .box{
            width:200px;
            height:50px;
            background-color:gray;
            margin:10px;
        }
    </style>
    <button @click="setCount(count + 1)" > add </button>
    <button @click="setCount(count - 1)" > sub </button>
    <transition-group enter-keyframes="rollIn" leave-keyframes="rollOut" type="animate" duration="2000">
        <div --for="i in count" .box> {{ i }} </div>
    </transition-group>
    `,
    create({ $self }: any) {
        let { count, setCount, onCountChange } = useRefState(3)
    }
})




