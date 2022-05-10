
import {
    createApp, onMounted
} from '@crush/core'

var root = {
    template: `
        <hello>

        </hello>
        `,
    create($: any) {
        $.count = 0
        $.add = () => $.count++
    },
    components:{
        hello:{}
    }
}

const app = createApp(root)

console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



