import { Nodes } from "@crush/const"
import { processHook, LifecycleHooks } from "@crush/core"

import { removeElement } from '../dom'
import { unmountRenderComponent } from "./renderComponent"
import { transitionLeave } from "./transitionRender"
import { unmountComponent } from './unmountComponent'

export function unmount(vnode: any, container: any, anchor: any, parent: any) {
    switch (vnode.nodeType) {
        case Nodes.HTML_ELEMENT:
            unmountElement(vnode)
            break
        case Nodes.HTML_COMMENT:
            removeElement(vnode.el)
            break
        case Nodes.STYLE:
            unmountElement(vnode)
            break
        case Nodes.SVG_ELEMENT:
            unmountElement(vnode)
            break
        case Nodes.TEXT:
            removeElement(vnode.el)
            break
        case Nodes.COMPONENT:
            unmountComponent(vnode, container, anchor)
            break
        case Nodes.RENDER_COMPONENT:
            unmountRenderComponent(vnode, container, anchor, parent)
            break
    }
}

export function unmountChildren(children: any) {
    // 卸载过程目前不需要锚点
    children.forEach(unmount);
}

function unmountElement(vnode: any) {
    const { el, transition } = vnode
    processHook(LifecycleHooks.BEFORE_UNMOUNT, vnode)
    if (vnode.children && vnode.nodeType !== Nodes.STYLE) {
        unmountChildren(vnode.children)
    }
    if (transition) {
        transitionLeave(vnode)
    } else {
        removeElement(el)
    }

    processHook(LifecycleHooks.UNMOUNTED, vnode)
}
