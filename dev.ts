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
        <button> 动起来     </button>
        <div .box ref="box">
            <header>
                <h6 .title> 111 </h6>
                <h6 #h>    <tom #ttt .tt> </h6>
            </header>
        </div>
        <tom #ttt .tt> 
        <tom #ttt .tt> 
        <tom #ttt .tt> 
    `,
    create({ $self, $refs, $animate, $querySelectorAll }: any) {
        window.querySelectorAll = $querySelectorAll
    }
}



const app = createApp(root)
console.log(app);

app.mount('#app')

