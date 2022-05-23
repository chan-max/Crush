
import {
    createApp
} from '@crush/core'

var root = {
    template: `
            <style>
                html,body{
                    padding:0;
                    margin:0;
                    height:100%;
                }
                body{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                h1{
                    animation : flip 1s infinite;
                }
            </style>
            <button @click="count++"> {{ count }} </button>
            <h1 --if="count%2 === 0"> toggle title </h1>
        `,
    create($: any) {
        $.count = 0
        $.add = () => $.count++
        $.sub = () => $.count--
        $.e = () => {
            console.log(666);
        }
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



