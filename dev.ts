import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted, watchTargetKey } from "./packages/core";



let root = {
    template: `
        <h1 @click="change"> {{x}} </h1>
    `,
    create({
        $self,
        $watch,
    }: any) {
        $self.x = 6666
        $self.change = () => {
            $self.x++
        }
        let unwatch =  $watch('x', () => {
            console.log('x change');
        })

        setTimeout(() => {
            unwatch()
        }, 3002);
    }
}


var app = createApp(root)
console.log(app);


app.mount('#app')
