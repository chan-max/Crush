
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
            body{
                for(i in 6){
                    $(i):i;
                }
            }
        </style>
    `,
    create(scope: any) {
        scope.count = 666
        scope.add = () => scope.count++
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


