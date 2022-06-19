import { createApp, h, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useColor, useNumber, useString, useBoolean } from "./packages/reactivity/lib/useData";
import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";


var d = useDate()
window.d = d
effect(() => {
    console.log( d.format('YYYY --- MM --- MMM - MMMM -- DD -- HH -- mm -- ss')    );
})











var jerry = {
    template: `jerry`,
    create() {
        console.log(this.$instance);

    }
}

var root = {
    components: {
        tom: {
            components: {
                jerry
            },
            template: `
            <h6> tom </h6>
            <jerry>
            `
        }
    },
    template: `
        <h4 @click="add"> {{num}} </h4>
        <tom>
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

