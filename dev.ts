import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted } from "./packages/core";

let teleport = {
    components: {
        tom({ x }) {
            return h('h1', null, x)
        }
    },
    template:/*html*/`
        <style>
            for(id,i in teleports){
                #$(id){
                    width:100px;
                    height:100px;
                    color:red;
                    h1{
                        $color:rgb(i*30,i*30,i*30);
                    }
                }
            }
        </style>
        <button @click="disabled = !disabled"> 切换disabled {{ disabled ? '不可用' : '可用'}}</button>
        <h1> {{teleportTo}} </h1>
        <div for="id,i in teleports" #(id)>
            box : {{id}}
        </div>
        <input --model="teleportTo">
        <teleport $to="teleportTo" $disabled="disabled">
            <h1> 我是传送的内容 </h1>
        </teleport>
    `,
    create({ $self }: any) {
        $self.teleportTo = document.body
        $self.disabled = false
        $self.teleports = ['a', 'b', 'c', 'd', 'e', 'f', 'e']
    }
}


var app = createApp(teleport)
console.log(app);


app.mount('#app')
