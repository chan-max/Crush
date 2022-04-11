
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
        <h1>
            title 1
        </h1>
    `,
    create(scope: any) {
        debugger
        scope.count = 6666
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);

