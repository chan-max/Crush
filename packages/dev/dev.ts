
import {
    createApp
} from '@crush/core'

var hello = {
    template: `
        <header>
            <slot>
        </header>
    `
}

var root = {
    components: {
        hello
    },
    directives: {
        d1: {
            mounted(el, dirInfo) {
                console.log('mounted', el, dirInfo);
            },
            updated(el, dirInfo) {
                console.log('updated', el, dirInfo);
            },
            unmounted(el, dirInfo) {
                console.log('unmounted', el, dirInfo);
            }
        }
    },
    template: `
            <button @click="count++"> {{ count }} </button>
            <hello>
                <h1> 我是slot1 {{ count }} </h1>
                <h2> 我是slot2 {{ count }} </h2>
            </hello>
        `,
    create($: any) {
        $.count = 0
        $.add = () => $.count++
        $.sub = () => $.count--
        $.e = () => {
            console.log(666);
        }
    }
}

const app = createApp(root)
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);

