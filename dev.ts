import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, useInstance
} from "./packages/core";

console.time('crush')

let tom = {
    props: ['x'],
    template: /*html*/`
        <h1> {{x}} </h1>
    `,
    create() {
        onPropChange('x', () => {
            console.log('x change');
        })
    }
}



let app = createApp({
    components: {
        tom
    },
    template:/*html*/`
        <button @click="x++">{{x}}</button>
        <tom $x>
    `,
    create() {
        let scope = useScope()
        scope.x = 0
    }
})

console.log(app);

app.mount()


console.timeEnd('crush')
