
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
                $color: rgb(r,g,b) ;
            }
        </style>
        <h1> red:{{r}} -- green:{{g}} -- blue:{{b}} </h1>
        `,
    create(scope: any) {

    },
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


