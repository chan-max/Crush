import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted, watchTargetKey, effect } from "./packages/core";
import { createRouter } from "./packages/router/lib/router";



const yasuo = {
    template: `亚索 `,
    create({ $attrs }: any) {
    }
}

let lol = {
    components: {
        yasuo
    },
    props: ['id'],
    template: `
    <h2>英雄联盟 {{id}}</h2>
    <yasuo $id="id">
    `
}


let game = {
    components: {
        lol
    },
    template: `
    <h1> 游戏中心 </h1>
    `,
    create({ $self }: any) {

    }
}

var app = createApp(game)
console.log(app);

const router = createRouter({})

app.use(router)

app.mount('#app')




