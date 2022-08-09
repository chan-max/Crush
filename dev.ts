import { computed, createApp, } from "./packages/core";


function getData() {
    return new Promise((resolve: any) => {
        setTimeout(() => {
            resolve({
                name: 'yauso',
                age: 20
            })
        }, 2000);
    })
}


let root = {
    template: /*html*/`
        <style>
                .box{
                    width:200px;
                    height:200px;
                    border:5px solid red;
                } 
        </style>
        <div .box>
            {{data}}
        </div>
    `,
    create({ $self }: any) {
        window.$self = $self
        $self.data = getData()
    }
}



const app = createApp(root)

app.mount('#app')
