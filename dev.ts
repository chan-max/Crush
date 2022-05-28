import {
    createApp
} from './core/app/createApp'

var root = {
    template: `
        <element --for="i in count" @click="count++" $is="'h'+ i"> 66666 </element>
    `,
    create($:any){
        $.count = 1
    }
}

var app = createApp(root)
console.log('app',app);
var instance = app.mount('#app')
console.log('instance',instance);

