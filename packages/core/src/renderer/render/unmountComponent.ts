import { patch } from "./patch"

export function unmountComponent(vnode: any, container: any, anchor: any) {
    var { instance } = vnode

    var vnode = instance.vnode

    patch(vnode, null, container, anchor)
}