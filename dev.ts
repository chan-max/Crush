import { computed, createApp, usePromise, watchRef, } from "./packages/core";
import { parseAttribute } from '@crush/compiler'




let tom = {
    template: `
        <h1 @click="log"> 我是汤姆猫 </h1>
    `,
    create({ $self }) {
        $self.log = () => {
            console.log($self.$x);
        }
    }
}



let root = {
    components: {
        tom
    },
    template: /*html*/`
        <style> 
                .box{
                    width:100px;
                    height:100px;
                    background-color:black;
                    @screens myipad{
                        background-color:blue;
                    }
                }
        </style>
        <div class="box" @click="log">
        </div>
        <tom>
    `,
    create({ $self }: any) {
        $self.log = () => {
            console.log($self.$x)
        }
    }
}

const app = createApp(root)



app.customScreens.myipad = `(min-width:800px) and (max-width:1200px)`

app.globalProperties.$x = 123456789


app.mount('#app')

console.log(app);

