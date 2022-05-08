
import {
    createApp, onMounted
} from '@crush/core'

const app = createApp({
    template: `
        <input --(active) --focus>
        `,
    create($:any) {
        $.flag = true
        $.toggle = () => $.flag = !$.flag
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



