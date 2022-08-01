import { computed, createApp, debounce, defineSelfName, doKeyframesAnimation, effect, h, reactive, ref, rgb, shallowCloneObject, throttle, onMounted, onBeforeClassMount } from "./packages/core";


let root = {
    template: /*html*/`
        <h1 .a .b .c> 猫和老鼠 </h1>
    `,
    create({ $self }: any) {
        onMounted(() => {
            console.log($self.$el);
        })
    }
}

onBeforeClassMount((className: any, el: any) => {
    console.log(className,el);
})


const app = createApp(root)

app.mount('#app')
