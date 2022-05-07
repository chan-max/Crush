
import {
    createApp
} from '@crush/core'

const app = createApp({
    template: `
        <button @click="setWidth( width + 1 )">
            width ++
        </button>
        <button @click="setHeight( height + 1 )">
            height ++
        </button>
        <h1> width : {{width}} </h1>
        <h1> height : {{height}} </h1>
        `,
    create() {
        var { width, setWidth , onWidthChange } = useState(0)
        var { height, setHeight , onHeightChange } = useState(0)
        
        onWidthChange(() => {
            console.log('66666666666666666666');
        })
    },
})
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);


import {
    useState
} from '../core/src/instance/create'



