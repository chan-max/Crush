
import {
    renderMethods
} from '@crush/compiler'

console.log(renderMethods);

import {
    createApp
} from '@crush/core'
const app = createApp({
    template: `
        <style>
                h1{
                    color!:red;
                    ...customMixin;
                }
        </style>
        <h1>
            title 1
        </h1>
    `,
    create(scope: any) {
        scope.customMixin = {
            backgroundColor: 'blue'
        }
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);

