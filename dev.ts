import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity
} from "./packages/core";
import { crButton, crButtonGroup } from './components/crButton'


console.time('crush')


let app = createApp({
    components: {
        crButton, crButtonGroup
    },
    template:/*html*/`
        <cr-button-group>
            <cr-button> login </cr-button>
            <cr-button> signin  </cr-button>
            <cr-button> logout </cr-button>
        </cr-button-group>
    `,
    create({ $self }: any) {
        $self.i = 0
    }
})



console.log(app);



app.mount()

console.timeEnd('crush')
