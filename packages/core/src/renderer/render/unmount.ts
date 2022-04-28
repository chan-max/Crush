import { Nodes } from "@crush/types";
import { nodeOps } from './nodeOps'

export function unmount(vnode: any, container: any, anchor: any) {
    switch (vnode.nodeType) {
        case Nodes.HTML_ELEMENT:
            if (vnode.children) {
                unmountChildren(vnode.children)
            }
            nodeOps.remove(vnode.ref)
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