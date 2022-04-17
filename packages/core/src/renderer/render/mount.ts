import { Nodes, NodesMap } from "@crush/types"
import { callHook, LifecycleHooks } from "../../instance/lifecycle"

import {
    mountStyleSheet
} from './mountStyleSheet'

export function mount(vnode: any, container: any) {
    const type = vnode.nodeType
    switch (type) {
        case Nodes.HTML_ELEMENT:
            mountHTMLElement(vnode, container)
            break
        case Nodes.TEXT:
            mountText(vnode, container)
            break
        case Nodes.FRAGMENT:
            mountFragment(vnode, container)
            break
        case Nodes.STYLE:
            mountStyleSheet(vnode, container)
            break
    }
}

function mountFragment(vnode: any, container: any) {
    mountChildren(vnode.children, container)
}

function mountChildren(children: any, container: any) {
    children.forEach((child: any) => mount(child, container));
}

function mountText(vnode: any, container: any) {
    var textContent = vnode.children
    var text = document.createTextNode(textContent)
    container.appendChild(text)
}

import {
    isEvent,
    getEventName
} from '../common/event'

function mountHTMLElement(vnode: any, container: any) {
    const {
        type,
        props,
        children
    } = vnode

    var el = document.createElement(type)
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
    container.appendChild(el)
    callHook(LifecycleHooks.MOUNTED, vnode)

    if (children) {
        mountChildren(children, el)
    }
}