import {
    createApp
} from './core/app/createApp'

var root = {
    template: `
        <style>
             .test{
                height:200px;
                width:200px;
                if(count%2 === 0 ){
                    background-color:red;
                }
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

import { getComputedStyle } from './core/animate/animation'
import { setStyleDeclaration, getStyleDeclaration } from './core/renderer/render/declaration'


var el = document.querySelector('#app')








