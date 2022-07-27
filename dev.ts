import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { useRefState } from "@crush/core/lib/instance/refState";
import { watch } from "@crush/core/lib/instance/watch";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { computed, createApp, doCSSAnimation, effect, h, reactive, ref, rgb, } from "./packages/core";

let root = {
    components: {
        tom: { template: `tom` }
    },
    template: /*html*/`
        <style>
            .box{
                width:200px;
                height:200px;
                background-color:red;
            }
        </style>
        <button @click="add"> {{num}} </button>
        <tom #t>
            <template #header>
                111
            </template>
            <template #footer>
            222
            </template>
        </tom>
    `,
    create({ $self, $refs }: any) {
        let num = ref(0)
        function add() {
            num.value++
        }

        effect(() => {
            document.title = num.value + '!!!'
        })

        watch(num,() => {
            console.log('watch');
        })

        return {
            num, add
        }
    }
}



const app = createApp(root)
console.log(app);

app.mount('#app')

