import { Vnode } from "../vnode/dom";
import { Nodes } from "@crush/const";
import { mountComponent } from "./mountComponent";
import {
    docCreateElement, docCreateText, insertElement
} from '../dom'
import { mountAttributes } from "./attribute"

export function mount(vnode: Vnode, container: any, anchor: any = null) {
    switch (vnode.nodeType) {
        case Nodes.HTML_ELEMENT:
            mountElement(vnode, container, anchor)
            break
        case Nodes.TEXT:
            mountText(vnode, container, anchor)
            break
        case Nodes.COMPONENT:
            mountComponent(vnode, container, anchor)
            break
        case Nodes.STYLE:
            mountStyleSheet(vnode, container, anchor)
            break
    }
}

export function mountChildren(children: any, container: any, anchor: any) {
    children.forEach((child: any) => {
        mount(child, container, anchor)
    });
}

import { processHook,LifecycleHooks } from '@crush/core'

import { mountStyleSheet } from "./mountStyleSheet";

function mountElement(vnode: any, container: any, anchor: any) {
    const { type, props, children } = vnode
    processHook(LifecycleHooks.BEFORE_CREATE, vnode)
    // create 
    var el = docCreateElement(type)
    vnode.el = el
    mountAttributes(el, props)
    processHook(LifecycleHooks.CREATED, vnode)
    processHook(LifecycleHooks.BEFORE_MOUNT, vnode)
    insertElement(el, container, anchor)
    processHook(LifecycleHooks.MOUNTED, vnode)
    if (children) {
        mountChildren(children, el, anchor)
    }
}

function mountText(vnode: any, container: any, anchor: any) {
    var el = docCreateText(vnode.children)
    vnode.el = el
    insertElement(el, container, anchor)
}