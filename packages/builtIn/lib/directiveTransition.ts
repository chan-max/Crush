
/*
*/


export const transition = {
    beforeCreate(_: any, { value }: any, vnode: any) {
        vnode.transition = true
    },
    beforeUpdate(el: any, bindings: any, vnode: any, pvnode: any) {
    },
}