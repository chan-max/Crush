import { createApp } from "./packages/core";

var root = {
    template: `
        <style>
            html,body{
                margin:0;
                width:100%;
                height:100%;
            }
 
                body{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
    
            h1{
                animation :rollOut 2s infinite;
            }
        </style>
        <button @click="count++">
            {{count}}
        </button>   
        <h1 --if="count%2 === 0" > {{count}} </h1>
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

