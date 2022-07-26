import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { useRefState } from "@crush/core/lib/instance/refState";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { computed, createApp, effect, h, reactive, ref, rgb, } from "./packages/core";

let root = {
    template: /*html*/`
        <style>
            .box{
                background-color:black;
                width:200px;
                height:30px;
                margin:20px;
            }
            .transition{
                &-enter{
                    transition:all 5s;
                    &-from{
                        background-color:rgb(255,0,0);
                    }
                    &-to{
                        background-color:rgb(100,0,0);
                    }
                }
                &-leave{
                    transition:all 5s;
                    &-from{
                        background-color:rgb(0,255,0);
                    }
                    &-to{
                        background-color:rgb(0,100,0);
                    }
                }
            }
        </style>
        <button @click="setCount(count + 1)"> {{count}} </button>
        <transition type="css" if="count%2 == 0">
            <div .box > 1 </div>
            <div .box> 2 </div>
        </transition>
    `,
    create({ $self }: any) {
        const {count,setCount} = useRefState(0)
    }
}



const app = createApp(root)
console.log(app);

app.mount('#app')

