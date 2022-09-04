import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity
} from "./packages/core";

console.time('crush')



let app = createApp({
    components: {
        tom: {
            template:/*html*/`
                <h1>child : {{defaultModelValue}} </h1>
                <input s-model="defaultModelValue">
            `,
            create() {
                exposeCurrentScopeToWindow('childScope')
            },
            beforeUpdate() {
            }
        }
    },
    template:/*html*/`
        <input s-model="i">
        <input s-model="j">
        <input s-model="k">
        <tom s-model:x="i"></tom>
    `,
    create({ $self }: any) {
        $self.i = '111'
        $self.j = '222'
        $self.k = '333'
        exposeCurrentScopeToWindow()
    }
})



console.log(app);



app.mount()

console.timeEnd('crush')
