
import {
    createApp, exposeCurrentScopeToWindow
} from "./packages/core";

console.time('crush')




let app = createApp({
    template:/*html*/`
    <h1>{{input}}</h1>
    <input *model="input" type="radio">
    `,
    create({ $self }: any) {
        exposeCurrentScopeToWindow()
        $self.input = ''
    }
})



console.log(app);

app.mount()

console.timeEnd('crush')
