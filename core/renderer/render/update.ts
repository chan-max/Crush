import { Nodes } from "../../const/node"
import { patch } from "./patch"

export function update(p: any, n: any, container: any, anchor: any) {
    switch (n.nodeType) {
        case Nodes.TEXT:
            updateText(p, n)
            break
        case Nodes.HTML_ELEMENT:
            updateHTMLElement(p, n, container, anchor)
            break
    }
}


import {
    diffChildren
} from './sequence'

function updateText(p: any, n: any) {
    var el = n.ref = p.ref
    if (p.children !== n.children) {
        el.textContent = n.children
    }
}

import { callHook, LifecycleHooks } from "../../instance/lifecycle";

function updateHTMLElement(p: any, n: any, container: any, anchor: any) {

    var el = n.ref = p.ref

    // updated hooks should be called here ? or after children update
    updateChildren(p.children, n.children, container, anchor)
}


export function updateChildren(pChildren: any, nChildren: any, container: any, anchor: any) {
    var {
        p, n
    } = diffChildren(pChildren, nChildren, false)

    var max = Math.max(p.length, n.length)
    for (let i = 0; i < max; i++) {
        patch(p[i], n[i], container, getAnchor(p, i + 1))
    }
}

/*
    在已经挂载的vnodes中获取anchor
*/
function getAnchor(vnodes: any, index: number) {
    for (let i = index; i < vnodes.length; i++) {
        var ref = vnodes[i]?.ref
        if (ref) {
            return ref
        }
    }
}

