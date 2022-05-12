import { EMPTY_MAP } from "@crush/common/src/value";
import { Nodes, NodesMap } from "@crush/types";
import { isEvent, parseHandlerKey } from "../common/event";
import { updateClass } from "./class";
import { mountDeclaration, updateDeclaration } from "./declaration";

export function mountProps(vnode: any) {
    var { ref, props } = vnode
    if (!props) {
        return
    } else {
        updateProps(EMPTY_MAP, props, ref, vnode)
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


export function updateProps(p: any, n: any, el: HTMLElement, vnode: any) {

    for (let key in n) {

        if (key === 'style') {

        } else if (key === 'class') {

        } else if (isEvent(key)) {

        } else {
            if (p[key]! == n[key]) {
                el.setAttribute(key, n[key])
            }
        }
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