
import {
    createApp, onMounted
} from '@crush/core'

const app = createApp({
    template: `
        <input --focus>
        `,
    create($:any) {
        $.flag = true
        $.toggle = () => $.flag = !$.flag
    },
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



