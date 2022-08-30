import { Nodes } from "@crush/const"
import { processHook, LifecycleHooks, isEvent } from "@crush/core"

import { removeElement } from '../dom'
import { unmountRenderComponent } from "./renderComponent"

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

import { updateElementAttributes } from './attribute'

function unmountElement(vnode: any) {
    const { el, props, transition, instance } = vnode
    processHook(LifecycleHooks.BEFORE_UNMOUNT, vnode)
    if (vnode.children && vnode.nodeType !== Nodes.STYLE) {
        unmountChildren(vnode.children)
    }

    //为了移除事件侦听器 , 其他属性直接忽略
    updateElementAttributes(el, props, null, instance, false, Object.keys(props).filter(isEvent))
    // 移除 ref
    if (props.ref) {
        instance.refs[props.ref] = null
    }

    if (transition) {
        transition.processUnmount(el)
    } else {
        removeElement(el)
    }

    processHook(LifecycleHooks.UNMOUNTED, vnode)
}
