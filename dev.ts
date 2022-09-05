import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity, cache
} from "./packages/core";

console.time('crush')



let app = createApp({
    components: {
        tom: {
            emits: ['click'],
            template:/*html*/`
                <button @click.once="$emit('click')" >6666</button>
                <button @click="j++"> 其他更新 {{j}}</button>
            `,
            create() {
                let scope = useScope()
                scope.j = 0
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
