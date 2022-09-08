import { provide } from "@crush/core/lib/instance/provideInject";
import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity, cache, inject
} from "./packages/core";

console.time('crush')

let counter = {
    template:/*html*/`
        <h1 @click="count++"> 计数器： {{count}} </h1>
    `,
    create(scope: any) {
        scope.count = 0
    }
}


function createComponent(){
    return {
        template:`
            <h1><h1>
        `
    }
}

let tom = {
    template: `
        <h1> 我是汤姆猫 </h1>
    `
}

let jerry = {
    template: `
    <h1> 我是杰瑞鼠 </h1>
`
}

let app = createApp({
    components: {
        counter,
        tom,
        jerry
    },
    template:/*html*/`
        <component *is.dynamic="component" *keep-alive="">
    `,
    create({ $self }: any) {
        exposeCurrentScopeToWindow()
        $self.component = 'tom'
    }
})



console.log(app);

app.mount()

console.timeEnd('crush')
