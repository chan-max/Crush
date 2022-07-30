import { computed, createApp, debounce, defineSelfName, doKeyframesAnimation, effect, h, reactive, ref, rgb, shallowCloneObject, throttle, } from "./packages/core";


let root = {
    template: /*html*/`
        <button @click="throttle(add,1000)"> {{count}} </button>
    `,
    create({ $self }: any) {
        $self.count = 5
        $self.add = () => {
            console.log('add');
            $self.count++
        }
    }
}
 


const app = createApp(root)
console.log(app);

app.mount('#app')
