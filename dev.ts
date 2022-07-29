import { computed, createApp, defineSelfName, doKeyframesAnimation, effect, h, reactive, ref, rgb, shallowCloneObject, } from "./packages/core";


function getUser(): any {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'chan',
                age: 23
            })
        }, 3000);
    })
}


let root = {
    template: /*html*/`
        <h1> {{$uid}} </h1>
    `,
    create({ $self }: any) {

    }
}



const app = createApp(root)
console.log(app);

app.mount('#app')

setTimeout(app.unmount, 3000)
