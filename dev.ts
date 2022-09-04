import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity
} from "./packages/core";

console.time('crush')



let app = createApp({
    components: {
        tom: {
            template:/*html*/`
            `
        }
    },
    template:/*html*/`
        <h1>{{i}}</h1>
        <input s-model.debounce="i">
        <tom s-model="i">
    `,
    create({ $self }: any) {
        $self.i = 'hello world'
    }
})



console.log(app);



app.mount()

console.timeEnd('crush')
