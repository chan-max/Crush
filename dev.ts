import {
    createApp, ref
} from "./packages/core";

console.time('crush')

let app = createApp()


app.rootComponent = {
    template:/*html*/`
            
    `,
    create({ $self }: any) {
        $self.input = () => {
            debugger
        }
    },
    mounted() {

    }
}



console.log(app);

app.mount()

console.timeEnd('crush')
