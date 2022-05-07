
import {
    createApp, onMounted
} from '@crush/core'

const app = createApp({
    template: `
        <button @click="toggle"> toggle </button>
        <h1> 111 </h1>
        <h2 --if="flag"> 222 </h2>
        <h3> 333 </h3>
        `,
    create($) {
        $.flag = true
        $.toggle = () => $.flag = !$.flag
    },
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



