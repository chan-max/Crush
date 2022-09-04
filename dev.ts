import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity
} from "./packages/core";

console.time('crush')



let app = createApp({
    components: {
        tom: {
            emits: ['click'],
            template:/*html*/`
                <button @click="$emit('click')">6666</button>
            `,
            create() {
                exposeCurrentScopeToWindow('childScope')
            },
        }
    },
    template:/*html*/`
        <h1> {{i}} </h1>
        <tom @click.once="i++"></tom>
    `,
    create({ $self }: any) {
        $self.i = 0
        exposeCurrentScopeToWindow()
    }
})



console.log(app);



app.mount()

console.timeEnd('crush')
