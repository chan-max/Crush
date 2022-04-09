
import {
    renderMethods
} from '@crush/compiler'

console.log(renderMethods);




import {
    createApp
} from '@crush/core'
const app = createApp({
    template: `
    <div>
        <h1>111</h1>
        <h2>222</h2>
        <h3>333</h3>
    </div>
    `
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);
