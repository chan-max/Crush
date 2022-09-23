import {
    computed,
    createApp, createState, ref
} from "./packages/core";

console.time('crush')

let app = createApp()

/*

*/

app.rootComponent = {
    template:/*html*/`
    `,
    create(scope: any) {

    },
}



console.log(app);

app.mount()

console.timeEnd('crush')
