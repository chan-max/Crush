import { createApp, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement, functionalComponent } from "./packages/core";


var root = {
    components: {
        hello: {
            props: ['count'],
            template: `<h1 @click="count++"> hello {{ count }} </h1>`,
        }
    },
    template: `  
        <button @click="count++"> {{count}} </button>
        <hello $count="count">
    `,
    create($) {
        $.count = 0
    }
}

var app = createApp(root)


console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

// import { reactive, readonly } from "./packages/reactivity/lib/reactive";
// import { computed } from "./packages/reactivity/lib/computed";
// import { ref } from "./packages/reactivity/lib/ref";

