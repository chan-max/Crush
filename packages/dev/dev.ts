
import {
    createApp
} from '@crush/core'

const app = createApp({
    template: `
        <style>

           if(flag){
                h2{
                    color:red;
                }
           }
           else-if{
               @media screen{
                   body{
                       background-color:blue;
                   }
               }
           }
            
        </style>
        <button @click="toggle"> toggle </button>
        <h1> 111 </h1>
        <h2> 222 </h2>
        <h3> 333 </h3>
        `,
    create($) {
        $.flag = true
        $.toggle = () => $.flag = !$.flag
    },
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


import {
    useState
} from '../core/src/instance/create'



