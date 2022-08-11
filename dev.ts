import { computed, createApp, usePromise, watchRef, } from "./packages/core";



let root = {
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
        <div class="box" @click="log" for="i in count">
            {{i}}
        </div>
    `,
    create({ $self }: any) {
        window.$self = $self
        $self.count = 1
        $self.log = () => {
     
            $self.count++
            console.log($self.$el)
        }
    }
}

const app = createApp(root)
app.customScreens.myipad = `(min-width:800px) and (max-width:1200px)`



app.mount('#app')

