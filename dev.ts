import {
    createExpression, createApp, ref, useRefState
} from "./packages/core";


let app = createApp({
    template:/*html*/`
        <style scoped>
            h1{
                color:red;
            } 
        </style>
        <button @click="setI(i+1)" >{{i}}</button>
        <button $disabled="i%2===0">{{i}}</button>
    `,
    create() {
        let { i, setI } = useRefState(0)
    }
})


app.mount()

