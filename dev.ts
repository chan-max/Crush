import {
    createApp, createState, ref
} from "./packages/core";

console.time('crush')

let app = createApp()


app.rootComponent = {
    template:/*html*/`
    <button *x:a:b:c.x.y.z|o|p|q> click </button>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    </svg>
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
