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
        <h1 class:md="x"> title </h1>
    `,
    create(scope: any) {
        window.scope = scope
    },
}



console.log(app);

app.mount()

console.timeEnd('crush')
