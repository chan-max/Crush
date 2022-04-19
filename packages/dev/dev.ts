
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
        <h1 --for="i in 6" --if="i%2 === 0">11111</h1>
    `,
    create(scope: any) {
        scope.randomBoolean = Math.random() > 0.5
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


