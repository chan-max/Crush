import {
    findTemplateStringEnd,
    computed, createApp, usePromise, watchRef, warn, error, linearGradient, objectExpressionWithScope, arrayExpressionWithScope, expressionWithScope, findNextCodeBlockClosingPosition, createExpression
    , extractArrayFunctionArgs,ref

} from "./packages/core";

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
