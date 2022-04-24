import { Nodes, NodesMap } from "@crush/types"
import { callHook, LifecycleHooks } from "../../instance/lifecycle"

import {
    mountStyleSheet
} from './mountStyleSheet'

export function mount(vnode: any, container: any, anchor: any) {
    const type = vnode.nodeType
    switch (type) {
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
    vnode.el = el
    nodeOps.insert(el, container, anchor)
}

import {
    isEvent,
    getEventName
} from '../common/event'
import nodeOps from "./nodeOps"

function mountHTMLElement(vnode: any, container: any, anchor: any) {
    const {
        type,
        props,
        children
    } = vnode

    var el = document.createElement(type)
    vnode.el = el
    if (props) {
        // mount props
        Object.entries(props).forEach(([key, value]: any) => {
            if (isEvent(key)) {
                var event = getEventName(key)
                el.addEventListener(event, value)
            } else if (key === NodesMap[Nodes.CLASS]) {
                // mount class
                var className = Object.keys(value).filter((classKey: string) => value[classKey]).join(' ')
                el.className = className
            } else if (key === 'style') {

            } else {
                // normal attribute
                el.setAttribute(key, value)
            }
        })
    }
    callHook(LifecycleHooks.CREATED, vnode, el)
    callHook(LifecycleHooks.BEFORE_MOUNT, vnode, el)
    nodeOps.insert(el, container, anchor)
    callHook(LifecycleHooks.MOUNTED, vnode)

    if (children) {
        mountChildren(children, el, anchor)
    }
}