import {
    createApp, createState, ref
} from "./packages/core";

console.time('crush')

let app = createApp()


import { createColor } from '@crush/reactivity'



app.rootComponent = {
    template:/*html*/`
        <button @click="setShow(!show)"> {{show}} </button>
        <h1 *if="show"> now you can see me </h1>
    `,
    create() {
        let { show, setShow, onShowChange } = createState(true)
        
        onShowChange(() => {
            console.log('toggle');
        })
    },
}



console.log(app);

app.mount()

console.timeEnd('crush')
