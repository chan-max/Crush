
import {
    createApp
} from '@crush/core'

var root = {
    directives: {
        d1: {
            mounted(el,dirInfo) {
                console.log('mounted',el, dirInfo);
            },
            updated(el, dirInfo) {
                console.log('updated',el, dirInfo);
            },
            unmounted(el, dirInfo) {
                console.log('unmounted',el, dirInfo);
            }
        }    
    },
    template: `
            <button @click="count++"> {{ count }} </button>
            <h1 --d1="count"   --if="count%2===0"> 111 </h1>
            <h1 --d1="count*10"   --else> 222 </h1>
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



