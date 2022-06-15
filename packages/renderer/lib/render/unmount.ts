import { Nodes } from "@crush/const"
import { processHook, LifecycleHooks } from "@crush/core"

import { removeElement } from '../dom'
import { unmountRenderComponent } from "./renderComponent"
import { unmountComponent } from './unmountComponent'

export function unmount(vnode: any, container: any, anchor: any) {
    switch (vnode.nodeType) {
        case Nodes.HTML_ELEMENT:
            unmountElement(vnode)
            break
        case Nodes.STYLE:
            unmountElement(vnode,)
        case Nodes.TEXT:
            removeElement(vnode.el)
            break
        case Nodes.COMPONENT:
            unmountComponent(vnode, container, anchor)
            break
        case Nodes.RENDER_COMPONENT:
            unmountRenderComponent(vnode, container, anchor)
            break
    }
}

export function unmountChildren(children: any) {
    // 卸载过程目前不需要锚点
    children.forEach(unmount);
}

function unmountElement(vnode: any) {
    processHook(LifecycleHooks.BEFORE_UNMOUNT, vnode)
    if (vnode.children && vnode.nodeType !== Nodes.STYLE) {
        unmountChildren(vnode.children)
    }
    const el = vnode.el
    removeElement(vnode.el)
    processHook(LifecycleHooks.UNMOUNTED, vnode)
}