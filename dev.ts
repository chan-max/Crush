import {
    createExpression, createApp, ref
} from "./packages/core";


let app = createApp({
    template:/*html*/`
        <style scoped>
            h1{
                color:red;
            }
        </style>
        <h1 .x .y .z style="color:blue"> hello world </h1>
    `,
    create({ $self }: any) {

    }
})


app.mount()

