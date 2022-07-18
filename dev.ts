import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted } from "./packages/core";


const tom = {
    template: `
        <h1 @click="change"> {{obj}} </h1>
    `,
    create({
        $self,
        $watch,
    }: any) {
        $self.obj = { x: 1 }
        $self.change = () => {
            $self.obj.x++
        }
        $watch($self.obj, () => {
            console.log('obj change');
        })
    }
}

let root = {
    components: {
        tom
    },
    template:/*html*/`
        <button @click="x++"> 切换组件 </button>
        <tom if="x%2 === 0">
    `,
    create({ $self }: any) {
        $self.x = 0
    }
}


var app = createApp(root)
console.log(app);


app.mount('#app')
