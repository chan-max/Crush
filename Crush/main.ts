
import {
    createApp
} from './core/module/app'

var appModule = createApp({
    container: '#app'
})

var root = appModule.mount({
    template: `
    <style>
        --if(22){
            body{
                background-color:red;
            }
        }
    </style>
    `
})







