import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { useRefState } from "@crush/core/lib/instance/refState";
import { watch } from "@crush/core/lib/instance/watch";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { computed, createApp, doKeyframesAnimation, effect, h, reactive, ref, rgb, } from "./packages/core";

let root = {
    components: {
        tom: {
            template: `tom{{$attrs.id}}`,
        }
    },
    template: /*html*/`
        <style>
            .box{
                width:200px;
                height:200px;
                background-color:red;
            }
        </style>
        <button @click="animate"> 动起来 </button>
        <div .box>
        </div>
    `,
    create({ $self, $refs, $animate, $querySelectorAll, $querySelector }: any) {
        $self.animate = () => {
            let el = $querySelector('.box')
            doKeyframesAnimation(el,{
                name:'rollIn',
                duration:2000
            })
        }
    }
}

const app = createApp(root)
console.log(app);

app.mount('#app')

