
import {
    createApp
} from '@crush/core'

var root = {
    template: `
            <h1 --x> 123456789 </h1>
            <button @click="count++"> {{count}} </button>
        `,
    create($: any) {
        $.count = 0
        $.add = () => $.count++
        $.sub = () => $.count--
    },
    directives: {
        x: {
            created() {
                console.log('created');
                debugger
            },
            beforeMount() {
                debugger
            },
            mounted() {
                debugger
            },
            beforeUpdate() {
                debugger
            },
            updated(){
                debugger
            },
            beforeUnmount(){
                debugger
            },
            unmounted(){
                debugger
            }
        }
    }
}

const app = createApp(root)
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



