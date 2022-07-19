import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted, watchTargetKey } from "./packages/core";


var x = ref(0)
window.x = x

let root = {
    components: {
        tom: () => {
            return x.value % 2 === 0 ? h('h6', null, '汤姆') : h('h6', null, '杰瑞')
        },
    },
    template: /*html*/`
        <style>
            for(i in 5){
                #$('div'+i){
                    $color:rgb(255-25*i,255-25*i,255-25*i);
                    $background-color:rgb(25*i,25*i,25*i);
                    $width:50 + i * 10 + 'px';
                    $height:50 + i * 10 + 'px';
                }
            }
        </style>
        <div for="i in 5" $id="'div'+i"></div>
        <input --model="t">
        <h1 @click="change"> {{x}} </h1>
        <teleport $to="t">
            {{x}}
        </teleport>
    `,
    create({
        $self,
        $watch,
    }: any) {
        $self.t = ''
        $self.x = 0
        $self.change = () => {
            console.log('x change');
            $self.x++
        }
    }
}

var app = createApp(root)
console.log(app);



app.mount('#app')
