import { Vnode } from "../vnode/dom";
import { Nodes } from "@crush/const";
import {
    docCreateComment,
    docCreateElement, docCreateText, insertElement, onceListener
} from '../dom'
import { mountAttributes } from "./attribute"
import { mountComponent } from "./mountComponent";

export function mount(vnode: any, container: any, anchor: any = null, parent: any = null) {
    switch (vnode.nodeType) {
        case Nodes.HTML_ELEMENT:
            mountElement(vnode, container, anchor, parent)
            break
        case Nodes.SVG_ELEMENT:
            mountElement(vnode, container, anchor, parent, true)
        case Nodes.TEXT:
            mountText(vnode, container, anchor, parent)
            break
        case Nodes.HTML_COMMENT:
            insertElement(vnode.el = docCreateComment(vnode.children), container, anchor)
        case Nodes.COMPONENT:
            mountComponent(vnode, container, anchor, parent)
            break
        case Nodes.RENDER_COMPONENT:
            mountRenderComponent(vnode, container, anchor, parent)
            break
        case Nodes.STYLE:
            mountStyleSheet(vnode, container, anchor, parent)
            break
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
import { transitionEnter, } from "./transitionRender";

function mountElement(vnode: any, container: any, anchor: any, parent: any, isSVG: boolean = false) {
    // 1
    processHook(LifecycleHooks.BEFORE_CREATE, vnode)
    // 2
    const { type, props, children, transition } = vnode
    // create 
    const el = vnode.el = docCreateElement(type, isSVG)
    mountAttributes(el, props, isSVG)
    processHook(LifecycleHooks.CREATED, vnode)

    processHook(LifecycleHooks.BEFORE_MOUNT, vnode)

    if (transition) {
        transitionEnter(vnode)
    }

    insertElement(el, container, anchor)

    processHook(LifecycleHooks.MOUNTED, vnode)
    mountChildren(children, el, anchor, parent)
}

function mountText(vnode: any, container: any, anchor: any, parent: any) {
    var el = docCreateText(vnode.children)
    vnode.el = el
    insertElement(el, container, anchor)
}


