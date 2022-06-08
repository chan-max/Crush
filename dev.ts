import { createApp, hasOwn, isReactive, isRef, onMounted } from "./packages/core";

var root = {
    directives:{
        x:{
            updated(el,infos){
                console.log(el,infos.oldValue);
            }
        }
    },
    template: `
        <h1 --x:a:b:c.x.y.z="count*10" @click="count++"> {{count}} </h1>
    `,
    create($) {
        $.count = 0
    },
}



var app = createApp(root)

console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

// import { reactive, readonly } from "./packages/reactivity/lib/reactive";
// import { computed } from "./packages/reactivity/lib/computed";
// import { ref} from "./packages/reactivity/lib/ref";





