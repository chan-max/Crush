import {
    createExpression, createApp, ref
} from "./packages/core";

let exp = createExpression('x+y')

console.log(exp.scopedExpression());


createApp({
    template:/*html*/`
        <h1 @click="c"> {{x}} </h1>
        <input --model="x">
    `,
    create({ $self }: any) {
        $self.x = ref(666)
        $self.c = () => {
            $self.x = ref(10056)
        }
    }
}).mount('#app')
