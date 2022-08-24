import {
    createExpression, createApp, ref, useRefState, onMounted
} from "./packages/core";

console.time('crush')

let app = createApp({
    components: {
    },
    template:/*html*/`
        <input --model="fw" type="range">
        <p $style="{fontWeight:fw*20}">11111111</p>
    `,
    create({ $self }: any) {
        $self.fw = 200
    }
})

console.log(app);

app.mount()

console.timeEnd('crush')
