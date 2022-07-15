import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement } from "./packages/core";


var app = createApp({
    template: /*html*/`
        <style>
            .box{
                width:300px;
                height:300px;
                background-color:white;
                border:5px solid black;
            }

            .transition{
                &-enter{
                    transition:all 4s;
                    &-from{
                        width:500px;
                        background-color:red;
                    }
                    &-to{
                        width:100px;
                    }
                }
                &-leave{
                    transition:all 5s;
                    &-from{
                        width:500px;
                        background-color:green;
                    }
                    &-to{
                        width:100px;
                    }
                }
            }
        
        </style>
        <button @click="count++" > {{count %2 ===0 ? '出现':'消失'}} </button>
        <div .box  --show="count%2 == 0" --transition></div>
    `,
    create({ $self }: any) {
        $self.count = 0
    }
})
console.log(app);



app.mount('#app')
