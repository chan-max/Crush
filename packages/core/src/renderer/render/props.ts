import { Nodes, NodesMap } from "@crush/types";
import { isEvent } from "../common/event";
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

    } else if (isEvent(propName)) {

    } else {
        el.setAttribute(propName, value)
    }
}



export function updateProps(p: any, n: any, vnode: any) {
    var { ref } = vnode
    var pKeys = Object.keys(p)

    for (let key in n) {
        if (key === 'style') {
            updateDeclaration(p[key], n[key], ref.style, vnode)
        } else if (key === 'class') {

        }
    }

}