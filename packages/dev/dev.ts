
import {
    createApp
} from '@crush/core'

var root = {
    directives: {
        d1: {
            mounted() {
                console.log('d1 mounted');
            },
            updated() {
                console.log('d1 updated');
            },
            unmounted() {
                console.log('d1 unmounted');
            }
        },
        d2: {
            mounted() {
                console.log('d2 mounted');
            },
            updated() {
                console.log('d2 updated');
            },
            unmounted() {
                console.log('d2 unmounted');
            }
        }
    },
    template: `
            <button @click="count++"> {{ count }} </button>
            <h1 --d1:a:b:c.x.y.z="count" --if="count%2===0"> 111 </h1>
            <h1 --d2:a:b:c.x.y.z="count" --if="count%2===1"> 222 </h1>
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



