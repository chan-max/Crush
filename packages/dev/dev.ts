
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
                    border:5px solid red;
                    @media (min-width:500px){
                        body{
                            background-color:red;
                        }
                        color:red;
                    }
                }
        </style>
        <h1>
            这是title1
        </h1>
        <button @click="add">
            {{count}}
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


