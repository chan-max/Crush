import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted, watchTargetKey, effect } from "./packages/core";
import { createRouter } from "./packages/router/lib/router";


const jax = {
    template: `武器大师`
}

const zed = {
    template: `劫`
}

const yasuo = {
    template: `亚索`
}

let root = {
    components: { jax, zed, yasuo },
    template: /*html*/`
        <h4> 根应用 </h4>
        <router-view>
    `,
    create({ $self, $watch, $router }: any) {
        $self.x = 0
        $self.add = () => $self.x++
    }
}

var app = createApp(root)
console.log(app);

const router = createRouter({})

import { onHashChange } from "./packages/router/lib/native";

onHashChange((n, o) => {
    console.log(n, o);
})

app.use(router)

app.mount('#app')




