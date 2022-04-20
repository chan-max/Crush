
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
        <button @click.ctrl="login">
            {{count}}
        </button>
        `,
    create(scope: any) {
        scope.count = 0
        scope.login = (x, y, z) => {
            scope.count++
            console.log(x);
            console.log(y);
            console.log(z);
        }
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


