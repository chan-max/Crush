
import {
    createApp
} from '@crush/core'

const hello = {
    template: `
        <h1 @click="x++"> hello  {{ x }} </h1>
    `,
    create($){
        $.x = 0
    }
}

const world = {
    template: `
        <h1> static component </h1>
    `
}

var root = {
    template: `
            <button @click="count++"> {{ count }} </button>
            <hello --if="count%2 === 1">
            <world --else>
        `,
    create($: any) {
        $.count = 0
        $.add = () => $.count++
        $.sub = () => $.count--
        $.e = () => {
            console.log(666);
        }
    },
    components: {
        hello,
        world
    },
    directives: {
        x: {
            created() {
                debugger
            },
            beforeMount() {

            },
            mounted() {

            },
            beforeUpdate() {

            },
            updated() {

            },
            beforeUnmount() {

            },
            unmounted() {

            }
        }
    }
}

const app = createApp(root)
console.log('app', app);
const instance = app.mount('#app')
console.log('instance', instance);



