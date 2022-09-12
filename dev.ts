import {
    createApp
} from "./packages/core";

console.time('crush')

let app = createApp()


app.rootComponent = {
    template:/*html*/`
        <h1> {{date}} </h1>
        <input *model="date" type="datetime-local">
    `,
    create({ $self }: any) {
        $self.date = '2018-06-01T08:30'
    }
}



console.log(app);

app.mount()

console.timeEnd('crush')
