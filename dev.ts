import { createApp } from "./packages/core";

import { withScope } from "./packages/core";



var app = createApp({ container: '#app' })
console.log(app);

app.mount({
    template: /*html*/`
        <style>
            .box{
                width:300px;
                height:300px;
                background-color:red;
                animation : bounceOutUp 2s infinite;
            }
        </style>
        <div .box @click="add" >
            {{count}}
        </div>
    `,
    create({ $self }: any) {
        $self.count = 0
        $self.add = () => $self.count++
    }
})
