import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, useInstance, createColor, onUnmounted, computed
} from "./packages/core";

console.time('crush')



let app = createApp({
    template:/*html*/`
        <button @click:once="log"> click </button>
        <input --model="text" @keydown.delete="log">
    `,
    create() {
        let scope = useScope()
        let text = ref(666)
        scope.text = text
        scope.log = (e) => {
            console.log(e);
        }
    }
})

app.keyCodes.Space = 's'

console.log(app);

app.mount()

console.timeEnd('crush')
