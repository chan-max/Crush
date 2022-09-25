import {
    computed,
    createApp, createState, onWindowResize, ref
} from "./packages/core";

console.time('crush')

let app = createApp()

/*

*/

app.rootComponent = {
    template:/*html*/`
        <style>
            body,html{
                margin:0;
            }
            .box{
                width:100px;
                height:805px;
                background-color:red;
            }
        </style>
        <div .box></div>
    `,
    create(scope: any) {
        window.scope = scope
    },
}

onWindowResize((info: any) => {

    document.body.style.background = 'red'
})



console.log(app);

app.mount()

console.timeEnd('crush')
