
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
                from{
                    $color: count%2===0?'red':'yellow';
                }
                to{
                    $color: count%2===0?'green':'blue';
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


