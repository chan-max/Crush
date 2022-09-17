import {
    createApp, ref
} from "./packages/core";

console.time('crush')

let app = createApp()


app.rootComponent = {
    template:/*html*/`
        <h1 @click="count++"> {{count}} </h1>
    `,
    create({ $self }: any) {
        $self.count = 0
    },
    mounted() {

    }
}



console.log(app);

app.mount()

console.timeEnd('crush')
