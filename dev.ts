import { createApp } from "./packages/core";

const hello = {
    template: `
        <h1> hello <slot> </h1>
    `,
    // beforeCreate() {
    //     console.log('beforeCreate');
    // },
    created() {
        console.log('组建选项钩子created');
    },
    // beforeMount() {
    //     console.log('beforeMount');
    // },
    // mounted() {
    //     console.log('mounted');
    // },
    // beforeUpdate() {
    //     console.log('beforeUpdate');
    // },
    // updated() {
    //     console.log('updated');
    // },
    // beforeUnmount() {
    //     console.log('beforeUnmount');
    // },
    // unmounted() {
    //     console.log('unmounted');
    // }
}
 
 
var x = {
    beforeCreate(el,info) {
        console.log('beforeCreate',el,info);
    },
    created(el,info) {
        console.log('created',el,info);
    },
    beforeMount(el,info) {
        console.log('beforeMount',el,info);
    },
    mounted(el,info) {
        console.log('mounted',el,info);
    },
    beforeUpdate(el,info) {
        console.log('beforeUpdate',el,info);
    },
    updated(el,info) {
        console.log('updated',el,info);
    },
    beforeUnmount(el,info) {
        console.log('beforeUnmount',el,info);
    },
    unmounted(el,info) {
        console.log('unmounted',el,info);
    }
}

var root = {
    directives: {
        x
    },
    components: {
        hello,
    },
    template: `
        <button @click="count++">
            {{count}}
        </button>   
        <hello --if="count%2 == 0" --x> {{count}} </hello>
        <hello --else> 无指令 {{count}} </hello>
    `,
    create($) {
        $.count = 0
        $.log = () => {
            console.log(666);
        }
    },
}

var app = createApp(root)
console.log('app', app);
var instance = app.mount('#app')
console.log('instance', instance);
