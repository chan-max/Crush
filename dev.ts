import { createApp, h, hasOwn, isReactive, isRef, onCreated, onMounted, onSet, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";
import { useNumber } from "@crush/reactivity/lib/custom/number";
import { watchRef } from "@crush/reactivity/lib/watchRef";
import { shallowWatchReactive, watchReactive } from "@crush/reactivity/lib/watchReactive";
import { useBoolean } from "@crush/reactivity/lib/custom/boolean";


var jerry = {
    template: `jerry`,
    create() {

    }
}

var root = {
    template: /*html*/`
        <style>
            @media  screen , (min-width:500px){
                h1{
                    color:red;
                }
            }
        </style>
        <h1> 666 </h1>
    `,
    create({
        $self
    }: any) {
        
    },
}

var app = createApp(root)

console.log('app', app);
var instance = app.mount('#app')

