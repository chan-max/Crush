import { createApp, hasOwn, isReactive, isRef, onCreated, onMounted, removeElement } from "./packages/core";


var root = {
    directives: {
        x: {
            created() {
                console.log('created');
            },
            updated() {
                console.log('updated');
            },
            mounted() {
                console.log('mounted');
            },
            beforeUnmount(el) {
                removeElement(el)
            },
            unmounted(el) {
                console.log('unmounted');
            },
        }
    },
    components:{
        hello
    },
    template: `  
        <button @click="count++"> {{count}} </button>
        <hello --for="i in count">
    `,
    create($) {
        $.count = 0
        $.log = () => {
            console.log(66);
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

// functional component
