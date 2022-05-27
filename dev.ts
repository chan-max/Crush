
import {
    createApp
} from './core/app/createApp'

var app = createApp({
    template:`
        666
    `
})
console.log(app);

var instance = app.mount('#app')
