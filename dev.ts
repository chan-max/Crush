import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref } from "./packages/core";

let p = reactive({ a: 1 })
var r = ref(666)
var c = computed(() => r.value * p.a)

watchComputed(c,)



var app = createApp({ container: '#app' })
console.log(app);

app.mount({
    template: /*html*/`
        <style>
            .box{
                width:300px;
                height:300px;
                background-color:red;
                animation :  fadeOutBottomRight 2s infinite;
            }
        </style>

        <div .box ref="box" >
            {{count}}
        </div>
    `,
    create({ $self, $refs }: any) {
        $self.count = 0
        $self.add = () => $self.count++

    }
})
