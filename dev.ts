import { provide } from "@crush/core/lib/instance/provideInject";
import {
    createExpression, createApp, ref, useRefState, onMounted, useScope, onPropChange, onUnmounted, computed, exposeCurrentScopeToWindow, parseColor, lighten, opacity, cache, inject
} from "./packages/core";

console.time('crush')

let app = createApp({
    template:/*html*/`
        <style>
            .box{
                width:500px;
                height:500px;
                background-color:black;
            }
            .transition{
                &-enter{
                    transition:all 2s;
                    &-from{
                        width:100px;
                        background-color:red;
                    }
                    &-to{
                        width:1000px;
                        background-color:pink;
                    }
                }
                &-leave{
                    transition:all 2s;
                    &-from{
                        width:1000px;
                        background-color:#00c1de;
                    }
                    &-to{
                        width:100px;
                        background-color:blue;
                    }   
                }
            }
        </style>
        <button @click="show = !show"> {{show ? 'show' : 'hide'}} </button>
            <div .box *if="show" *transition="boxTransition"></div>
        <tom>
    `,
    create({ $self }: any) {
        $self.show = true
        $self.boxTransition = {
            type: 'animate',
            enterKeyframes: 'rollIn',
            leaveKeyframes: 'rollOut',
            duration: 2000
        }
        provide('name', 666666)
        exposeCurrentScopeToWindow()
    }
})



console.log(app);

app.mount()

console.timeEnd('crush')
