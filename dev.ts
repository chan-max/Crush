import {
    createApp, exposeCurrentScopeToWindow, reactive
} from "./packages/core";

console.time('crush')



let app = createApp()

app.rootComponent = {
    components: {
        child: {
            template: /*html*/`
                <button @click="defaultModelValue++"> 子组件按钮{{count}} </button>
                {{defaultModelValue}}
            `,
            create(scope: any) {
                scope.count = 0
            }
        }
    },
    template:/*html*/`
        <button @click="count++">add {{count}} </button>
        <child *model="count">
    `,
    create({ $self }: any) {
        $self.count = 0
    }
}

console.log(app);

app.mount()

console.timeEnd('crush')
