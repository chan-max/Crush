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
    components: {
        tom: {
            template:`<h6> 123456789 </h6>`
        }
    },
    template:/*html*/`
    <style> 
        .box{
            width:200px;
            height:50px;
            background-color:gray;
            margin:10px;
        }
    </style>
    <h6> {{ str }} </h6>
    
    `,
    create({ $self }: any) {
        $self.str = 'hello'
    }
})




