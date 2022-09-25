import {
    computed,
    createApp, createState, getCustomScreensMediaString, ref
} from "./packages/core";

console.time('crush')

let app = createApp()



app.rootComponent = {
    template:/*html*/`
    <input @keydown.e="log">
    `,
    create(scope: any) {
        scope.log =() => {
            console.log(666);
            
        }
    },
}



console.log(app);

app.mount()

console.timeEnd('crush')
