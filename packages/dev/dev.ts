
import {
    createApp, onMounted, useState
} from '@crush/core'

var root = {
    template: `
        <style>
            .test{
                animation: backInDown 1s;
            }
        </style>
        <h1 class="test">I am flash</h1>
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



