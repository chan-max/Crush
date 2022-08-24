import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, useEmit
} from "./packages/core";

console.time('crush')

let tom = {
    props: ['name'],
    emits: ['submit'],
    template: `
        <h1 @click="c"> {{name}} </h1>
    `,
    create() {
    }
}

let app = createApp({
    components: {
        tom
    },
    template:/*html*/`
        <tom $name="6666">
    `,
    create() {
    }
})

console.log(app);

app.mount()



console.timeEnd('crush')
