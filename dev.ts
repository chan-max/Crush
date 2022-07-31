import { computed, createApp, debounce, defineSelfName, doKeyframesAnimation, effect, h, reactive, ref, rgb, shallowCloneObject, throttle, } from "./packages/core";


let root = {
    template: /*html*/`
        <h1> {{text}} </h1>
        <input --model.debounce.2000="text">
    `,
    create({ $self}: any) {
        $self.text = '123465'
    }
}

const app = createApp(root)

app.mount('#app')
