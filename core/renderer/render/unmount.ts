import { Nodes } from "../../const/node"
import { processHook } from "../../instance/directive"
import { LifecycleHooks } from "../../instance/lifecycle"
import { removeElement } from '../dom'


export function unmount(vnode: any, container: any, anchor: any) {
    switch (vnode.nodeType) {
        case Nodes.HTML_ELEMENT:
            unmountElement(vnode)
            break
        case Nodes.STYLE:
            unmountElement(vnode)
        case Nodes.TEXT:
            removeElement(vnode.ref)
            break
    }
}

export function unmountChildren(children: any) {
    // 卸载过程目前不需要锚点
    children.forEach(unmount);
}

function unmountElement(vnode: any, isStyle: boolean = false) {
    if (vnode.children && !isStyle) {
        unmountChildren(vnode.children)
    }
    processHook(LifecycleHooks.BEFORE_UNMOUNT, vnode)
    removeElement(vnode.ref)
    processHook(LifecycleHooks.UNMOUNTED, vnode)
}