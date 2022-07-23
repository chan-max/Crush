import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, effect, reactive, } from "./packages/core";
import { createRouter } from "./packages/router/lib/router";




let game = {
    template: /*html*/`
        <button @click="x++"> add </button>
        <h1 for="i in x" if="i %2=== 0" > title {{i}} </h1>
    `,
    create({ $self }: any) {
        $self.x = 0
    },
}

const app = createApp(game)
console.log(app);

app.mount('#app')

