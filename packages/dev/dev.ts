
import {
    createApp
} from '@crush/core'

var root = {
    directives: {
        d1: {
            mounted() {
                console.log('d1 mounted');
            },
            updated(el, dirInfo) {
                console.log('d1 updated');
                console.log(el, dirInfo);
            },
            unmounted() {
                console.log('d1 unmounted');
            }
        }    
    },
    template: `
            <button @click="count++"> {{ count }} </button>
            <h1 --d1:a:b:c.x.y.z="count"   > 111 </h1>
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



