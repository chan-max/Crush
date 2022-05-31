import {
    createApp
} from './core/app/createApp'




var root = {
    template: `
        <style>
            :root{
                $--main : count%2 === 0 ?  'blue' : 'red' ; 
            }
            #box{
                width : 200px;
                height : 200px;
                background-color : var(--main);
            }
        </style>
        <button @click="count++"> {{ count }} </button>
        <div id="box">
        </div>
    `,
    create($: any) {
        $.count = 1
    }
}

var app = createApp(root)
console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

import { getElementStyle, getElementComputedStyle, getStyle } from './core/renderer/render/declaration';

var box = document.querySelector('#box')









