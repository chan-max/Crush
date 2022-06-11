import { createApp, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement, functionalComponent } from "./packages/core";


var root = {
    components: {
        hello: {
            props: ['data'],
            template: `<h1 @click="count++"> {{ data }} </h1>`,
            create(){
            }
        }
    },
    template: `
        <button @click="count++"> {{count}} </button>
        <hello $data >
            <h6 --if="12346" > 我是插槽 </h6>
        </hello>
    `,
    create($) {
        $.count = 0
        $.data = {
            a:111,
            b:222,
            c:333
        }
    }
}

var app = createApp(root)


console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

// import { reactive, readonly } from "./packages/reactivity/lib/reactive";
// import { computed } from "./packages/reactivity/lib/computed";
// import { ref } from "./packages/reactivity/lib/ref";

