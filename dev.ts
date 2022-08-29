import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, useInstance, createColor, onUnmounted, computed
} from "./packages/core";

console.time('crush')



let app = createApp({
    template:/*html*/`
        <div @click="i++">132456</div>
        <div  if="i%2===0" $style="{width:i+'px',height:i+'px',backgroundColor:'red'}" @resize.window="log">{{i}}</div>
    `,
    create() {
        let scope = useScope()
        scope.i = 100
        scope.log = [() => console.log(11),
        () => console.log(222),
        ]
    }
})



console.log(app);

app.mount()

console.timeEnd('crush')
