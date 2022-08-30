import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, useInstance, createColor, onUnmounted, computed, exposeCurrentScopeToWindow
} from "./packages/core";

console.time('crush')


let app = createApp({
    template:/*html*/`
        <button @click="log">log</button>
        <input --model="i" type="checkbox" >
    `,
    create() {
        let scope = useScope()
        scope.i = []
        scope.log = () => console.log(scope.i)
    }
})



console.log(app);



app.mount()

console.timeEnd('crush')
