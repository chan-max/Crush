import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted, watchTargetKey, effect } from "./packages/core";
import { createRouter } from "./packages/router/lib/router";

let game = {
    template: `
        index
    `,
    create({ $self, $router }: any) {
        $self.x = '1'
        $self.add = () => $self.x += '！'
        setInterval($self.add, 2000)
    }
}



const app = createApp(game)
console.log(app);

app.mount('#app')



