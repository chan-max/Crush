
import {
    createApp, onMounted, useState
} from '@crush/core'

var root = {
    template: `
        <style>
            button{
                $color: count%2 === 0 ? 'red' : 'blue' ;
            }
        </style>
        <button @click="setCount( count + 1 )"> {{ count }} </button>
        `,
    create($: any) {
        const { count, setCount, onCountChange } = useState(0)
        onCountChange(() => {
            document.title = `count : ${$.count}`
        })
    },
}

const app = createApp(root)

console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



