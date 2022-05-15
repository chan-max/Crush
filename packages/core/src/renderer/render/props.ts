import { keys, removeFromArray } from "@crush/common";
import { EMPTY_MAP } from "@crush/common/src/value";
import { Nodes, NodesMap } from "@crush/types";
import viteConfig from "../../../../_docs/vite.config";
import { isEvent, parseHandlerKey } from "../common/event";
import { unmountClass, updateClass } from "./class";
import { mountDeclaration, unmountDeclaration, updateDeclaration } from "./declaration";

export function mountProps(vnode: any) {
    var { ref, props } = vnode
    if (!props) {
        return
    } else {
        updateProps(EMPTY_MAP, props, ref, vnode)
    }
}


export function updateProps(p: any, n: any, el: HTMLElement, vnode: any) {

    var removeList = keys(p)

    for (let key in n) {
        var pValue = p[key]
        var nValue = n[key]
        if (key === 'style') {
            updateDeclaration(pValue, nValue, el.style, vnode)
        } else if (key === 'class') {
            updateClass(pValue, nValue, el)
        } else if (isEvent(key)) {
            if (pValue !== nValue) {
                var { event, options } = parseHandlerKey(key)
                el.removeEventListener(event, pValue)
                el.addEventListener(event, nValue, options as any)
            }
        } else {
            if (p[key]! == n[key]) {
                el.setAttribute(key, n[key])
            }
        }

        removeFromArray(removeList as any, key)
    }

    removeList.forEach((key: any) => {
        unmountProp(key, p[key], el, vnode)
    })

}

function unmountProp(propName: string, value: any, el: HTMLElement, vnode: any) {
    if (propName === 'style') {
        unmountDeclaration(value, el.style, vnode)
    } else if (propName === 'class') {
        unmountClass(el)
    } else if (isEvent(propName)) {
        var { event, options } = parseHandlerKey(propName)
        el.removeEventListener(event as any, value, options as any)
    } else {
        el.removeAttribute(propName)
    }
}