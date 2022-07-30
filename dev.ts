import { computed, createApp, defineSelfName, doKeyframesAnimation, effect, h, reactive, ref, rgb, shallowCloneObject, } from "./packages/core";


let root = {
    template: /*html*/`
        <h1>{{text}} </h1>
        <textarea --model.number.trim="text">
    `,
    create({ $self }: any) {
        $self.text = 666
        window.$self = $self
    }
}


const app = createApp(root)
console.log(app);

app.mount('#app')

