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
                    transition:all 3s;
                    &-from{
                        background-color:rgb(255,0,0);
                    }
                    &-to{
                        background-color:rgb(100,0,0);
                    }
                }
                &-leave{
                    transition:all 3s;
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
        <div .box  for="i in count"> {{i}} </div>
    `,
    create({ $self }: any) {
        const {count,setCount} = useRefState(5)
    }
}



const app = createApp(root)
console.log(app);

app.mount('#app')

