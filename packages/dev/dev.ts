
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
        <template --if="666" --for="i in 12">
            6666
        </template>
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


