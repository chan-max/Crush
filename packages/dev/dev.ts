
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
        <button @click="login">
            {{count}}
        </button>
        <if condition="count">
            <h1>111</h1>
            <h2>222</h2>
        </if>
        `,
    create(scope: any) {
        scope.count = 0
        scope.login = () => {
            scope.count++
        }
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


