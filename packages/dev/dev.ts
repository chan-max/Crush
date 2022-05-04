
import {
    renderMethods
} from '@crush/compiler'

console.log(renderMethods);

import {
    createApp
} from '@crush/core'

const app = createApp({
    template: `
        <button style="color:red;"  $style="{backgroundColor:'blue'}" >{{count}}</button>
        `,
    create(scope: any) {
        scope.count = 0
        scope.aMixin = {
            backgroundColor:'yellow'
        }
        scope.add = () => {
            scope.count += 10
        }
    },
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


