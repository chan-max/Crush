
import {
    createApp, onMounted
} from '@crush/core'

const app = createApp({
    template: `
        <input --focus #app>
        `,
    create($: any) {
        $.count = 0
        $.add = () => $.count++
    },
    directives: {
        focus(el: HTMLElement) {
            el.focus()
        }
    }
})

console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



