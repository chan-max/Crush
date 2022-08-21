import {
    findTemplateStringEnd,
    computed, createApp, usePromise, watchRef, warn, error, linearGradient, objectExpressionWithScope, arrayExpressionWithScope, expressionWithScope, findNextCodeBlockClosingPosition, createExpression
    , extractArrayFunctionArgs

} from "./packages/core";

createApp({
    template:/*html*/`
        <h1 --(x)> {{x}} </h1>


      
    `,
    create({ $self }: any) {
        $self.x = 666
    }
}).mount('#app')
