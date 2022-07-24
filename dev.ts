import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { useRefState } from "@crush/core/lib/instance/refState";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { computed, createApp, effect, reactive, ref, rgb, } from "./packages/core";

let game = {
    template: /*html*/`
    `,
    create({ $self }: any) {
        window.$self = $self
        const { x, setX, onXchange } = useRefState(66)
        $self.r = ref(12)
    }
}




const app = createApp(game)
console.log(app);

app.mount('#app')

