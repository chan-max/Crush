import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, useInstance, createColor, onUnmounted, computed
} from "./packages/core";

console.time('crush')


let color = createColor('red')

console.log(color);



let app = createApp({
    template:/*html*/`
        <style> 
            body{
                $background-color:hsl(x*y*360,x*100,y*100);
            }
        </style>
        <h1>x:{{x}}</h1>
        <h1>y:{{y}}</h1>
    `,
    create() {
        let x = ref(0)
        let y = ref(0)
        onMounted(() => {
            window.onmousemove = (e) => {
                x.value = e.x / window.innerWidth
                y.value = e.y / window.innerHeight
            }
        })
        onUnmounted(() => window.onmousemove = null)



        return {
            x, y
        }
    }
})

console.log(app);

app.mount()


console.timeEnd('crush')
