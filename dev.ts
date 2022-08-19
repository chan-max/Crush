import {
    findTemplateStringEnd,
    computed, createApp, usePromise, watchRef, warn, error, linearGradient, objectExpressionWithScope, arrayExpressionWithScope, expressionWithScope, findNextCodeBlockClosingPosition
    ,

} from "./packages/core";


createApp({
    template:/*html*/`
        <for iterator="i in  10">
            <for iterator="j in 5">
                <li> {{i}} {{j}} </li>
            </for>
        </for>
    `,
    create({$self}:any){
        $self.l = 6
    }
}).mount('#app')
