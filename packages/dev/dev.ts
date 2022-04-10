
import {
    renderMethods
} from '@crush/compiler'

console.log(renderMethods);

import {
    createApp
} from '@crush/core'
const app = createApp({
    template: `
        <button>{{count}}</button>
    `,
    create(scope){
        scope.count = 6666
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);

