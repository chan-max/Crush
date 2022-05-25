
import {
    createApp
} from '@crush/core'

var hello = {
    template: `
        <h1>
            66666666666666
        </h1>
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
                <template  #header >
                    666666
                </template>
                <template  #footer >
                    666666
                </template>
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

