
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
        <button --if="random">
            I am button
        </button>
    `,
    create(scope: any) {

    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


