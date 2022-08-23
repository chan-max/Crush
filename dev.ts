import {
    createExpression, createApp, ref, useRefState, onMounted
} from "./packages/core";


let app = createApp({
    components: {
    },
    template:/*html*/`
        <tom>
        <tom>
    `,
    create({ $self }: any) {
        onMounted(() => {
            console.log($self.$el);
        })
    }
})

console.log(app);

app.mount()


