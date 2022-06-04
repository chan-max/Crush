import { Nodes, NodesMap } from "../../node/nodes"
import { callHook, LifecycleHooks } from "../../instance/lifecycle"

import {
    mountStyleSheet
} from './mountStyleSheet'

export function mount(vnode: any, container: any, anchor: any = null) {
    switch (vnode.type) {
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

import { nodeOps } from "./nodeOps"
import { mountDeclaration } from "./declaration"
import { mountProps } from "./props"
import { mountComponent } from "./mountComponent"
import { processHook } from "../../instance/directive"

function mountElement(vnode: any, container: any, anchor: any) {
    const { tag, props, children } = vnode

    var el = document.createElement(tag)
    vnode.ref = el

    processHook(LifecycleHooks.CREATED, null, vnode)

    mountProps(vnode)

    processHook(LifecycleHooks.BEFORE_MOUNT, null, vnode)

    nodeOps.insert(el, container, anchor)

    processHook(LifecycleHooks.MOUNTED, null, vnode)

    if (children) {
        mountChildren(children, el, anchor)
    }

    // 
}