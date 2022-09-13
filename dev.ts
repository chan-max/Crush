import {
    createApp, ref
} from "./packages/core";

console.time('crush')

let app = createApp()


app.rootComponent = {
    template:/*html*/`
        <h1> {{text}} </h1>
        <input *model="text">
    `,
    create({ $self }: any) {
        window.scope = this
        $self.text = ref('hello')
    }
}



console.log(app);

app.mount()

console.timeEnd('crush')
