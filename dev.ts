import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { useRefState } from "@crush/core/lib/instance/refState";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, effect, reactive, ref, } from "./packages/core";


function tom(props:any) {
    debugger
    return 'tom'
}

let game = {
    components: {
        tom
    },
    template: /*html*/`
        <h1 ...b> 123456 </h1>
    `,
    create({ $self }: any) {
        const { x, setX, onXchange } = useRefState(66)
        $self.b = {
            id:'id',
            class:['x','y']
        }
        onXchange((newValue: any, oldValue: any) => {
            document.title = newValue
        })

    },
}

const app = createApp(game)
console.log(app);

app.mount('#app')

