import { provide } from "@crush/core/lib/instance/provideInject";
import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity, cache, inject
} from "./packages/core";

console.time('crush')



function createComponent(name: any) {
    return {
        template:/*html*/`
            <h1 @click="count++"> ${name}计数器： {{count}} </h1>
            <h1> ..... </h1>
        `,
        create(scope: any) {
            scope.count = 0
        }
    }
}


let app = createApp({
    components: {
        a: createComponent('a'),
        b: createComponent('b'),
        c: createComponent('c'),
        d: createComponent('d'),
        e: createComponent('e'),
        f: createComponent('f'),
    },
    template:/*html*/`
        当前组件: <input *model="component">
        <component *is.dynamic="component || 'a'" *keep-alive="">
    `,
    create({ $self }: any) {
        exposeCurrentScopeToWindow()
        $self.component = 'a'
    }
})



console.log(app);

app.mount()

console.timeEnd('crush')
