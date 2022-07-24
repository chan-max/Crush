import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { useRefState } from "@crush/core/lib/instance/refState";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { computed, createApp, effect, reactive, ref, rgb, } from "./packages/core";

let game = {
    template: /*html*/`
        <style>
            h1{
                $color:rgb(count*10,count*10,count*10);
                $background-color:rgb(255-count*10,255-count*10,255-count*10);
            }
        </style>
        <button @click="setCount(count + 1)"> + </button>
        <button @click="setCount(count - 1)"> - </button>
        <h1> count : {{count}} </h1>
    `,
    create() {
        const { count, setCount, onCountChange } = useRefState(0)
        onCountChange(() => {
            console.log('count change !')
        })
    }
}




const app = createApp(game)
console.log(app);

app.mount('#app')

