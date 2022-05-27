
import {
    createApp
} from '@crush/core'

var root = {
    directives: {
        x: {
            mounted(el,info){
                console.log('mounted');
            },
            unmounted(){
                console.log('unmounted');
            },
            updated(el,info){
                console.log('updated',el,info);
            }
        }
    },
    template: `
            <button @click="count++"> {{count}} </button>
            <input --model="count">
        `,    
    create($: any) {
        $.count = 0
        $.add = () => $.count++
        $.sub = () => $.count--
        $.e = () => {
            console.log(666);
        }
        console.log(this);
    }
}

const app = createApp(root)
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);

