import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity
} from "./packages/core";
import { crButton, crButtonGroup } from './components/crButton'


console.time('crush')


let app = createApp({
    components: {
        tom: {
            template:/*html*/`
            `
        }
    },
    template:/*html*/`
        <h1 s-bind="{id:666}">666</h1>
    `,
    create({ $self }: any) {
        $self.i = 0
    }
})



console.log(app);



app.mount()

console.timeEnd('crush')
