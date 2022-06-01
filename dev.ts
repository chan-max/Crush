import {
    createApp
} from './core/app/createApp'


import { getElementStyle, getElementComputedStyle, getStyle, mountDeclaration, setElementStyleDeclaration } from './core/renderer/render/declaration';

function doAnimation(el: HTMLElement, options: any) {
    const rawOptions = getElementStyle(el, options)
    setElementStyleDeclaration(el, options)
    el.addEventListener('animationend', () => {
        setElementStyleDeclaration(el, rawOptions)
    })
}

var root = {
    template: `
        <button @click="show = !show"> go </button>
        <h1 --show="show"> 111 </h1>
        <h1 --show="!show"> 222 </h1>
    `,
    create($: any) {
        $.show = true
    }
}

var app = createApp(root)
console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);

var box = document.querySelector('#box') as HTMLElement

import { onceListener } from './core/renderer/dom';








