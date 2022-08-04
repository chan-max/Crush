import { computed, createApp, debounce, defineSelfName, doKeyframesAnimation, effect, h, reactive, ref, rgb, shallowCloneObject, throttle, onMounted, onBeforeClassMount } from "./packages/core";


let root = {
    template: /*html*/`
        <style>
                .box{
                    width:200px;
                    height:200px;
                    background-color:black;
                    @media {
                        background-color:red;
                    }
                }
        </style>
        <div .box>
        </div>
    `,
    create({ $self }: any) {

    }
}



const app = createApp(root)

app.mount('#app')
