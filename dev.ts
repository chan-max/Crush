import { computed, createApp, usePromise, watchRef, warn, error, extractExpressionVariables } from "./packages/core";
import {parse,parseExpression} from '@babel/parser'


console.log(parseExpression('[(x,y)=> 666 ,(x,y)=> 666 ]'))



let root = {
    template: /*html*/`

    `,
    create({ $self }: any) {
        $self.count = 0
        $self.toggle = () => {
            $self.count++
        }
    }
}



const app = createApp(root)



app.mount('#app')



