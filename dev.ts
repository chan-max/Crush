import { createApp } from "./packages/core";

var root = {
    template: `
        <style>
            h1{
                @media (min-width:900px){
                    if(count%2 == 0){
                        color:red;
                    }
                }
            }
        </style>
        <button @click="count++">
            {{count}}
        </button>   
        <h1 > {{count}} </h1>
    `,
    create($) {
        $.count = 0
        $.log = () => {
            console.log(666);
        }
    },
}

var app = createApp(root)
console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

function transition(){
    
}

