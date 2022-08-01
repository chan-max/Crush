import { computed, createApp, debounce, defineSelfName, doKeyframesAnimation, effect, h, reactive, ref, rgb, shallowCloneObject, throttle, onMounted } from "./packages/core";


let root = {
    components: {
        tom: { template: `<h6> 我是 tom </h6>` },
        jerry: { template: `<h6> 我是 jerry </h6>` },
    },
    template: /*html*/`
        <h1> 猫和老鼠 </h1>
    `,
    create({ $self }: any) {
        onMounted(() => {
            console.log($self.$el);
        })
    }
}

const app = createApp(root)

app.mount('#app')
