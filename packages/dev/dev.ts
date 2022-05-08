
import {
    createApp, onMounted
} from '@crush/core'

const app = createApp({
    template: `
        <button @click="add"> {{count}} </button>
        <input --focus>
        `,
    create($:any) {
        $.count = 0
        $.add = () => $.count++
    },
    directives:{
        focus(el){
            el.focus()
        }
    }
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



