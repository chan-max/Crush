import { Nodes } from "@crush/const"
import { processHook, LifecycleHooks } from "@crush/core"

import { updateAttributes } from "./attribute"
import { patch } from "./patch"
import { updateComponent } from './updateComponent'

export function update(p: any, n: any, container: any, anchor: any, parent: any) {
    switch (n.nodeType) {
        case Nodes.TEXT:
            updateText(p, n)
            break
        case Nodes.HTML_ELEMENT:
            updateHTMLElement(p, n, container, anchor)
            break
        case Nodes.STYLE:
            updateStyleSheet(p, n,)
            break
        case Nodes.COMPONENT:
            updateComponent(p, n, container, anchor, parent)
            break
        case Nodes.RENDER_COMPONENT:
            updateRenderComponent(p, n, container, anchor, parent)
            break
        case Nodes.HTML_COMMENT:
            // comment dont update
            break
    }
}


import {
    sortChildren
} from './sequence'
import { updateStyleSheet } from "./updateStyleSheet"
import { updateRenderComponent } from "./renderComponent"

function updateText(p: any, n: any) {
    var el = n.el = p.el
    if (p.children !== n.children) {
        el.textContent = n.children
    }
}


function updateHTMLElement(p: any, n: any, container: any, anchor: any) {

    var el = n.el = p.el

    processHook(LifecycleHooks.BEFORE_UPDATE, n, p)
    updateAttributes(el, p.props, n.props)
    processHook(LifecycleHooks.UPDATED, n, p)
    // updated hooks should be called here ? or after children update
    updateChildren(p.children, n.children, container, anchor, parent)
}


export function updateChildren(pChildren: any, nChildren: any, container: any, anchor: any, parent: any) {
    var {
        p, n
    } = sortChildren(pChildren, nChildren, false)

    var max = Math.max(p.length, n.length)
    for (let i = 0; i < max; i++) {
        patch(p[i], n[i], container, getAnchor(p, i + 1), parent)
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

