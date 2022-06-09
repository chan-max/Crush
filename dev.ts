import { createApp, hasOwn, isReactive, isRef, onMounted, removeElement } from "./packages/core";

const tom = {
    props: {
        name: {
            type: Number,
            required: true
        }
    },
    template: `
        <h6> I am child component </h6>
        <input $value="count" type="range">
        <button @click="count++"> {{count}} </button>
    `,
    create($) {
        console.log(this);

        $.count = 0
    }
}

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
                debugger
                console.log('unmounted');
            },
        }
    },
    template: `
        <style>
            .box{
                width:200px;
                height:200px;
                border:1px solid green;
            }
        </style>
        <button @click="count++"> {{count}} </button>
        <div .box --x --if="count%2 === 0"> 666 </div>
        <div .box --if="count%2 === 1"> 777 </div>
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
// import { ref} from "./packages/reactivity/lib/ref";




