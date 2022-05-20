
import {
    createApp, onMounted, useState
} from '@crush/core'

var root = {
    template: `
        <button @click="add"> add </button>
        <button @click="sub"> sub </button>
        <h1 --fade> {{ count }} </h1>
        `,
    create($: any) {
        $.count = 0
        $.add = () => $.count++
        $.sub = () => $.count--
    },
    directives: {
        fade: {
            created() {
                console.log('created');
            }
        }
    }
}

const app = createApp(root)
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



