import { defineAsyncComponent } from "@crush/builtin/lib/defineAsyncComponent";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";
import { createApp, reactive, ref, computed, watchReactive, watchRef, isReactive, doCSSAnimation, remountElement, shallowCloneArray, h, onMounted } from "./packages/core";


const loading = {
    template: `
        ...
    `
}

const error = {
    template: `加载失败`
}


let tom = defineAsyncComponent({
    loader: () => new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                template: ` 我是异步组件 `
            })
        }, 3000);
    }),
    loading,
    error,
    onError() { }
})


let tree = {
    value: 150,
    children: [{
        value: 580,
        children: [{
            value: 120,
            children: []
        }, {
            value: 960,
            children: []
        }, {
            value: 12000,
            children: []
        }]
    }, {
        value: 5550,
        children: []
    }, {
        value: 35434,
        children: []
    }, {
        value: 4557,
        children: []
    }]
}

var app = createApp({
    name: 'tree',
    template:/*html*/`
    <div>
        <h1> {{tree.value}} </h1>
        <div if="tree.children" style="marginLeft:200px;">
            <tree for="child in tree.children" $tree="child">
        </div>
    <div>
    `,
    props: {
        tree:{
            default:tree
        }
    },
    create({ $self }: any) {
        console.log($self.$instance);
    }
})
console.log(app);



app.mount('#app')
