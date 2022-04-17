
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
            <button @click="add">
                {{count}}
            </button>
    `,
    create(scope: any) {
        scope.count = 0
        scope.add = () => {
            scope.count++
        }
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);

import {
    nextTick
} from '@crush/core'
