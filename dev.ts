import { provide } from "@crush/core/lib/instance/provideInject";
import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity, cache, inject
} from "./packages/core";

console.time('crush')



let app = createApp({
    template:/*html*/`
    <h3>{{date}}</h3>
    <input *model="date" type="date">
    `,
    create({ $self }: any) {
        exposeCurrentScopeToWindow()
        $self.date = ''
    }
})



console.log(app);

app.mount()

console.timeEnd('crush')
