import {
    createApp, exposeCurrentScopeToWindow
} from "./packages/core";

console.time('crush')

window.onpopstate = () => {
    console.log(65);

}

let app = createApp()

app.rootComponent = {
    components: {
    },
    template:/*html*/`
        <router-view></router-view>
    `,
    create({ $self }: any) {
        exposeCurrentScopeToWindow()
    }
}

console.log(app);

app.mount()

app.routes = [

]

console.timeEnd('crush')
