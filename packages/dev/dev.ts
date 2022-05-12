
import {
    createApp, onMounted
} from '@crush/core'

var root = {
    template: `
        <h1 .a .b .c .btn>  111 </h1>
        `,
    create($: any) {
        $.count = 0
        $.add = () => $.count++
    },
}

const app = createApp(root)

console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



