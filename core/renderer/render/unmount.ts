import { Nodes } from "../../const/node"
import {
    nodeOps
} from './nodeOps'


export function unmount(vnode: any, container: any, anchor: any) {
    switch (vnode.type) {
        case Nodes.HTML_ELEMENT:
            unmountElement(vnode)
            break
        case Nodes.TEXT:
            nodeOps.remove(vnode.ref)
            break
    }
}

export function unmountChildren(children: any) {
    // 卸载过程目前不需要锚点
    children.forEach(unmount);
}

function unmountElement(vnode: any) {
    if (vnode.children) {
        unmountChildren(vnode.children)
    }
    nodeOps.remove(vnode.ref)
}