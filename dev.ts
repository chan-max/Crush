import {
    computed,
    createApp,
    onMounted,
} from "./packages/core";

console.time('crush')

let app = createApp()

app.rootComponent = {
    template:/*html*/`
    <canvas id="myCanvas" width="200" height="100" style="border:1px solid #c3c3c3;">
    您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
    `,
    create(scope: any) {
        
    },
}



console.log(app);

app.mount()

console.timeEnd('crush')
