import {
    createExpression, createApp, ref
} from "./packages/core";

let exp = createExpression('x+y')

console.log(exp.scopedExpression());


createApp({
    template:/*html*/`
        <style scoped>
            h1{
                color:red;
            }
        </style>
        <h1> hello world </h1>
    `,
    create({ $self }: any) {
    }
}).mount('#app')
