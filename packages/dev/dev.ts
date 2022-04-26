
import {
    renderMethods
} from '@crush/compiler'

console.log(renderMethods);

import {
    createApp
} from '@crush/core'
import { onMounted } from '@crush/core/src/instance/lifecycle';
const app = createApp({
    template: `
        <style>
            h1{
                animation:fade 1s infinite;
            }

            @keyframes fade{
                for(i in 100){
                    $(i){
                        if( i < 10 ){
                            color:blue;
                        }
                        else-if( i < 20 ){
                            color:red;
                        }
                        else-if( i < 30 ){
                            color:yellow;
                        }
                        else-if( i < 40 ){
                            color:purple;
                        }
                        else-if( i < 50 ){
                            color:black;
                        }
                        else-if( i < 60 ){
                            color:orange;
                        }
                        else{
                            color:white;
                        }
                    }
                }
            }
        </style>
        <h1> 这是title1 </h1>
        <button @click="add">
             {{ count }}
        </button>
        `,
    create(scope: any) {
        scope.count = 0
        scope.add = () => scope.count++
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


