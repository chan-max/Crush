
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
            for(i in 6){
                h$(i){
                    colo   r:red;
                }
            }
        </style>
        <h1>111</h1>
        <h2>222</h2>
        <h3>333</h3>
        <h4>444</h4>
        <h5>555</h5>
        <h6>666</h6>
        `,
    create(scope: any) {
        scope.x = 100
        scope.add = () => {
            scope.x += 21
        }
    },
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


