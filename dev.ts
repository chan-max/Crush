import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity, cache
} from "./packages/core";

console.time('crush')

let son = {
    emits: ['click'],
    template:/*html*/`
        <button @click="$emit('click')">son</button>
    `,
    create(scope: any) {
        scope.i = 0
    }
}

let parent = {
    components: {
        son
    },
    emits: ['click'],
    template:/*html*/`
        parent
        <slot s-slot-name="header">
        <son @click="$emit('click')"></son>
    `,
    create(scope) {
        scope.log = () => {
            console.log('son emit');
        }
    }
}

let app = createApp({
    components: {
        parent
    },
    template:/*html*/`
        <h1>root :{{i}}</h1>
        <parent @click="i++">
            <template s-slot="header">
                我是插槽内容
            </template>
        </parent>
    `,
    create({ $self }: any) {
        $self.i = 0
        exposeCurrentScopeToWindow()
    }
})



console.log(app);



app.mount()

console.timeEnd('crush')
