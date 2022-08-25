import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, useEmit, useProps, useParent, useDate
} from "./packages/core";

console.time('crush')

let tom = {
    template: /*html*/`
        <style> 
            .box{
                $width:width+'px';
                $height:height+'px';
                background-color:red;
            }
        </style>
        width : <input --model="width" type="range" min="50" max="200">
        height : <input --model="height" type="range"  min="50" max="200">
        <div .box></div>
    `,
    create() {
        let width = ref(20)
        let height = ref(20)
        return {
            width,
            height
        }
    }
}

let app = createApp({
    components: {
        tom
    },
    template:/*html*/`
        <tom>
    `,
})

console.log(app);

app.mount()


console.timeEnd('crush')
