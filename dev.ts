import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { useRefState } from "@crush/core/lib/instance/refState";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, effect, reactive, ref, } from "./packages/core";


let game = {
    template: /*html*/`
        <button @click="setX(x + 2)" @mounted> {{x}} </button>
    `,
    create({ $self }: any) {
        const { x, setX, onXchange } = useRefState(66)

        onXchange((newValue: any, oldValue: any) => {
            document.title = newValue
        })

        $self.mounted = () => {
            console.log('mounted');
        }
    },
}

const app = createApp(game)
console.log(app);

app.mount('#app')

