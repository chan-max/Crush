import { Nodes, NodesMap } from "@crush/types";
import { isEvent, parseHandlerKey } from "../common/event";
import { updateClass } from "./attribute";
import { mountDeclaration, updateDeclaration } from "./declaration";

export function mountProps(vnode: any) {
    var { ref, props } = vnode
    if (!props) {
        return
    } else {
        for (let key in props) {
            mountProp(key, props[key], ref, vnode)
        }
    }
}

function mountProp(propName: string, value: any, el: HTMLElement, vnode: any) {
    if (propName === 'style') {
        mountDeclaration(value, el.style, vnode)
    } else if (propName === 'class') {
        debugger
    } else if (isEvent(propName)) {
        var { event, options } = parseHandlerKey(propName)
        el.addEventListener(event as any, value, options as any)
    } else {
        el.setAttribute(propName, value)
    }
}

function unmountProp(propName: string, value: any, el: HTMLElement) {
    if (propName === 'style') {

    } else if (propName === 'class') {
        debugger
    } else if (isEvent(propName)) {
        var { event, options } = parseHandlerKey(propName)
        el.addEventListener(event as any, value, options as any)
    } else {
    }
}

export function updateProps(p: any, n: any, vnode: any) {
    debugger
    var { ref } = vnode
    for (let key in n) {

        if (key === 'style') {

        } else if (key === 'class') {

        } else if (isEvent(key)) {

        } else {
            if (p[key]! == n[key]) {
                ref.setAttribute(key,n[key])
            }
        }

        delete n[key]
    }

    for (let key in p) {
        unmountProp(key, p[key], ref)
    }
}
