import { removeFromArray } from "@crush/common";
import { Nodes } from "@crush/types";
import { patch } from "./patch";
import { updateStyleSheet } from "./updateStyleSheet";

export function update(p: any, n: any, container: any, anchor: any) {
    switch (n.nodeType) {
        case Nodes.TEXT:
            var ref = n.ref = p.ref
            if (p.children !== n.children) {
                ref.textContent = n.children
            }
            break
        case Nodes.HTML_ELEMENT:
            /*
                update props    
            */
            n.ref = p.ref
            updateChildren(p.children, n.children, container, anchor)
            break
        case Nodes.FRAGMENT:
            updateChildren(p.children, n.children, container, anchor)
            break
        case Nodes.STYLE:
            updateStyleSheet(p, n)
            break
    }
}

import {
    diffChildren
} from './sequence'

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


