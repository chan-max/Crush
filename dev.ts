import {
    createApp, ref
} from "./packages/core";

console.time('crush')

let app = createApp()


app.rootComponent = {
    template:/*html*/`
        <style>
            h1{
                $color;
            }
        </style>
        <h1> hello </h1>
    `,
    create({ $self }: any) {
        $self.color = 'red'
    },
    mounted() {

    }
}

console.log(app);

app.mount()

console.timeEnd('crush')
