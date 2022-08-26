import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, useEmit, useProps, useParent, useDate, onUpdated, isRgbColor, parseHslColor, hsl, exposeCurrentScopeToWindow,
} from "./packages/core";

console.time('crush')

let tom = {
    template: /*html*/`
        <h1>{{text}}</h1>
        <input  --model="text">
    `,
    create() {
 


        let scope = useScope()
        exposeCurrentScopeToWindow()
        scope.text = ref('12465')
    }
}



let app = createApp({
    components: {
        tom
    },
    template:/*html*/`
        <tom>
    `,
})

console.log(app);

app.mount()


console.timeEnd('crush')
