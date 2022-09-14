import {
    createApp, ref
} from "./packages/core";

console.time('crush')

let app = createApp()


app.rootComponent = {
    template:/*html*/`
        <h1> {{date}} </h1>
        <input *model="date" type="week">
    `,
    create({ $self }: any) {
        $self.date = ''
    }
}

console.log(app);

app.mount()

console.timeEnd('crush')
