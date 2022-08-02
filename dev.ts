import { computed, createApp, debounce, defineSelfName, doKeyframesAnimation, effect, h, reactive, ref, rgb, shallowCloneObject, throttle, onMounted, onBeforeClassMount } from "./packages/core";


let root = {
    template: /*html*/`
        <style>
                .box{
                    width:200px;
                    height:200px;
                    background-color:red;
                }
        </style>
        <div class="animate_rollIn_2s_infinite box">
        </div>
    `,
    create({ $self }: any) {

    }
}



const app = createApp(root)

app.mount('#app')
