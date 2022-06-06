import { createApp, hasOwn, isReactive, isRef } from "./packages/core";

var root = {
    template: `
        <style>
        </style>
        <button @click="count++">
            {{count}}
        </button>   
        <h1 --if="count%2 == 0"> {{count}} </h1>
    `,

    create($) {
        $.count = 0
        $.log = () => {
            console.log(666);
        }
    },
}

var app = createApp(root)
console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

import { reactive } from "./packages/reactivity/lib/reactive";



var p = reactive([1,2,3,4,5,6])

for(let i of p){
    console.log(i);
    
}

