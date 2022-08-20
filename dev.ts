import {
    findTemplateStringEnd,
    computed, createApp, usePromise, watchRef, warn, error, linearGradient, objectExpressionWithScope, arrayExpressionWithScope, expressionWithScope, findNextCodeBlockClosingPosition, createExpression
    , extractArrayFunctionArgs

} from "./packages/core";

createApp({
    template:/*html*/`
        <style>
            button{
                $color: l%2 === 0? 'red':'blue';
                $backgroundColor: l%2 !== 0? 'red':'blue';
                ...btnStyle;
            }
        </style>
        <button @click="l++"> {{l}} </button>
    `,
    create({ $self }: any) {
        $self.l = 3
        $self.btnStyle = {
            border:'1px solid black'
        }
    }
}).mount('#app')
