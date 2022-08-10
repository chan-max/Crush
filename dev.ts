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
        <div class="box">
            
        </div>
    `,
    create({ $self,$options }: any) {

    }
}


const app = createApp(root)


console.log(app);


app.mount('#app')

