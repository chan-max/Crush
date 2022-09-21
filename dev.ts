import {
    createApp, createState, ref
} from "./packages/core";

console.time('crush')

let app = createApp()


app.rootComponent = {
    template:/*html*/`
        <video></video>
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
