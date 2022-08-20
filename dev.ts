import {
    findTemplateStringEnd,
    computed, createApp, usePromise, watchRef, warn, error, linearGradient, objectExpressionWithScope, arrayExpressionWithScope, expressionWithScope, findNextCodeBlockClosingPosition, createExpression
    ,extractArrayFunctionArgs

} from "./packages/core";

createApp({
    template:/*html*/`
        <style>
            div{
                h$(i){
                    color:red;
                }
            }
        </style>
        <element for="i in 6" $is="'h'+i">6666</element>
    `,
    create({ $self }: any) {
        $self.l = 6
    }
}).mount('#app')
