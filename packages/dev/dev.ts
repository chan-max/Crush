
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
        <for iterator="i in 6">
            <h1>
                6666666
            </h1>
        </for>
        `,
    create(scope: any) {
        scope.count = 1
        scope.login = () => {
            scope.count++
        }
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


