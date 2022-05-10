
import {
    createApp, onMounted
} from '@crush/core'

var root = {
    template: `
        <input --focus #app>
        `,
    create($: any) {
    }
}

const app = createApp(root)

app.mixin({
    mounted(){
        debugger
    }
})


console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



