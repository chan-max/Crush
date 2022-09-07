import { provide } from "@crush/core/lib/instance/provideInject";
import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity, cache, inject
} from "./packages/core";

console.time('crush')

let tom = {
    template:/*html*/`
        <h1 @click="count++"> 计数器： {{count}} </h1>
    `,
    create(scope: any) {
        scope.count = 0
    }
}

let app = createApp({
    components: {
        tom
    },
    template:/*html*/`
        <button @click="show = !show"> toggle </button>
        <tom *if="show" *keep-alive>
    `,
    create({ $self }: any) {
        $self.show = true
    }
})



console.log(app);

app.mount()

console.timeEnd('crush')
