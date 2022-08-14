
import { Nodes } from "@crush/const";
import {
    docCreateComment,
    docCreateElement, docCreateText, insertElement, onceListener, setAttribute
} from '../dom'
import { mountAttributes } from "./attribute"
import { mountComponent } from "./mountComponent";

export function mount(vnode: any, container: any, anchor: any = null, parent: any = null) {
    switch (vnode.nodeType) {
        case Nodes.HTML_ELEMENT:
            return mountElement(vnode, container, anchor, parent)
        case Nodes.SVG_ELEMENT:
            return mountElement(vnode, container, anchor, parent, true)
        case Nodes.TEXT:
            return mountText(vnode, container, anchor, parent)
        case Nodes.HTML_COMMENT:
            return insertElement(vnode.el = docCreateComment(vnode.children), container, anchor)
        case Nodes.COMPONENT:
            return mountComponent(vnode, container, anchor, parent)
        case Nodes.RENDER_COMPONENT:
            return mountRenderComponent(vnode, container, anchor, parent)
        case Nodes.STYLE:
            return mountStyleSheet(vnode, container, anchor, parent)
    }
}

export function mountChildren(children: any, container: any, anchor: any, parent: any) {
    if (!children) return
    children.forEach((child: any) => {
        mount(child, container, anchor, parent)
    });
}

import { processHook, LifecycleHooks } from '@crush/core'

import { mountStyleSheet } from "./mountStyleSheet";
import { mountRenderComponent } from "./renderComponent";




function mountElement(vnode: any, container: any, anchor: any, parent: any, isSVG: boolean = false) {
    vnode.instance = parent
    // 1
    processHook(LifecycleHooks.BEFORE_CREATE, vnode)
    // 2
    const { type, props, children, transition } = vnode
    const { scopedId } = parent

    // create 
    const el: any = vnode.el = docCreateElement(type, isSVG)
    el._vnode = vnode
    // set scoped id
    if (scopedId) {
        setAttribute(el, String(scopedId))
    }
    mountAttributes(el, props, parent, isSVG)
    processHook(LifecycleHooks.CREATED, vnode)
    processHook(LifecycleHooks.BEFORE_MOUNT, vnode)
    // 进入动画不影响节点的插入
    if (transition) {
        transition.processMount(el, () => insertElement(el, container, anchor))
    } else {
        insertElement(el, container, anchor)
    }

    // mounted 后需不需要拿到子节点元素
    processHook(LifecycleHooks.MOUNTED, vnode)

    mountChildren(children, el, anchor, parent)

    processHook(LifecycleHooks.CHILDREN_MOUNTED, vnode)
}

function mountText(vnode: any, container: any, anchor: any, parent: any) {
    var el = docCreateText(vnode.children)
    vnode.el = el
    vnode.instance = parent
    insertElement(el, container, anchor)
}


