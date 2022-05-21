import { Nodes, NodesMap } from "../../node/nodes"
import { callHook, LifecycleHooks } from "../../instance/lifecycle"

import {
    mountStyleSheet
} from './mountStyleSheet'

export function mount(vnode: any, container: any, anchor: any = null) {
    switch (vnode.type) {
        case Nodes.HTML_ELEMENT:
            mountHTMLElement(vnode, container, anchor)
            break
        case Nodes.TEXT:
            mountText(vnode, container, anchor)
            break
        case Nodes.FRAGMENT:
            mountFragment(vnode, container, anchor)
            break
        case Nodes.STYLE:
            mountStyleSheet(vnode, container)
            break
    }
}

function mountFragment(vnode: any, container: any, anchor: any) {
    debugger // wont
    mountChildren(vnode.children, container, anchor)
}

export function mountChildren(children: any, container: any, anchor: any) {
    children.forEach((child: any) => {
        /*
            会出现由于分支产生的 空节点
        */
        if (child) {
            mount(child, container, anchor)
        }
    });
}

function mountText(vnode: any, container: any, anchor: any) {
    var textContent = vnode.children
    var el = document.createTextNode(textContent)
    vnode.ref = el
    nodeOps.insert(el, container, anchor)
}

import {
    isEvent,
    parseHandlerKey
} from '../common/event'
import { nodeOps } from "./nodeOps"
import { mountDeclaration } from "./declaration"
import { mountProps } from "./props"

function mountHTMLElement(vnode: any, container: any, anchor: any) {
    const { tag, props, children } = vnode

    var el = document.createElement(tag)
    vnode.ref = el

    mountProps(vnode)

    callHook(LifecycleHooks.CREATED, vnode, null, el)
    callHook(LifecycleHooks.BEFORE_MOUNT, vnode, null, el)
    nodeOps.insert(el, container, anchor)
    callHook(LifecycleHooks.MOUNTED, vnode, null, el)

    if (children) {
        mountChildren(children, el, anchor)
    }
}