import {
    createApp
} from './core/app/createApp'

var root = {
    template: `
        <style>
             .test{
                height:200px;
                width:200px;
                background-color:red;
                animation : bounce 1s infinite;
            }
        </style>
        <button @click="count++"> {{count}} </button>
        <div class="test"></div>
    `,
    create($: any) {
        $.count = 1
    }
}

var app = createApp(root)
console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

