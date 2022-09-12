import {
    createApp, exposeCurrentScopeToWindow, reactive
} from "./packages/core";

console.time('crush')





let app = createApp()

app.rootComponent = {
    components: {
    },
    template:/*html*/`
        <button @click="add">add</button>
        <h1 *for=" i in arr"> hello{{i}} </h1>
    `,
    create({ $self }: any) {
        $self.arr = []
        $self.add = () => {
            $self.arr.push('111')
        }
    }
}

console.log(app);

app.mount()

console.timeEnd('crush')
