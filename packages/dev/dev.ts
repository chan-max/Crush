
import {
    renderMethods
} from '@crush/compiler'

console.log(renderMethods);

import {
    createApp
} from '@crush/core'

const app = createApp({
    template: `
        <style --for="i in count">
            for(i2 in count){
                body{
                    background-color : red ;
                }
            }
        </style>
        <button @click="add">{{count}}</button>
        `,
    create(scope: any) {
        
        scope.count = 5
        scope.add = () => {
            scope.count+=2
        }
    },
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


